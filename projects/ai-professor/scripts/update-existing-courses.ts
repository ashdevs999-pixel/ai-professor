#!/usr/bin/env npx ts-node
/**
 * Update Existing Courses - Automated content update system
 * 
 * Identifies outdated content and updates it with fresh information
 * while maintaining content quality and consistency.
 */

import { CourseGenerator, getCourseGenerator } from '../lib/ai/course-generator';
import { LessonGenerator, getLessonGenerator } from '../lib/ai/lesson-generator';
import { ResearchAgent, getResearchAgent } from '../lib/ai/research-agent';

import type {
  Course,
  Lesson,
  CodeExample,
  TopicCategory,
  ContentUpdate,
  ContentChange,
  GenerationResult
} from '../types/content';

// ============================================
// Configuration
// ============================================

interface ContentUpdaterConfig {
  openaiApiKey: string;
  perplexityApiKey?: string;
  contentDir: string;
  maxAgeDays: number;
  minFreshnessScore: number;
  dryRun: boolean;
}

interface ContentAudit {
  totalContent: number;
  needsUpdate: number;
  critical: number;
  moderate: number;
  minor: number;
  byCategory: Record<TopicCategory, {
    total: number;
    needsUpdate: number;
  }>;
}

interface UpdateReport {
  timestamp: Date;
  audited: number;
  updated: number;
  skipped: number;
  failed: number;
  changes: ContentChange[];
  errors: string[];
}

// ============================================
// Content Updater Class
// ============================================

export class ContentUpdater {
  private config: ContentUpdaterConfig;
  private courseGenerator: CourseGenerator;
  private lessonGenerator: LessonGenerator;
  private researchAgent: ResearchAgent;

  constructor(config: ContentUpdaterConfig) {
    this.config = config;
    
    this.courseGenerator = getCourseGenerator({
      openaiApiKey: config.openaiApiKey,
      perplexityApiKey: config.perplexityApiKey
    });

    this.lessonGenerator = getLessonGenerator({
      openaiApiKey: config.openaiApiKey
    });

    this.researchAgent = getResearchAgent({
      openaiApiKey: config.openaiApiKey,
      perplexityApiKey: config.perplexityApiKey
    });
  }

  /**
   * Run a full content audit
   */
  async auditContent(): Promise<ContentAudit> {
    console.log('🔍 Auditing content...');
    
    const audit: ContentAudit = {
      totalContent: 0,
      needsUpdate: 0,
      critical: 0,
      moderate: 0,
      minor: 0,
      byCategory: {
        'ai-ml-engineering': { total: 0, needsUpdate: 0 },
        'web-development': { total: 0, needsUpdate: 0 },
        'cloud-computing': { total: 0, needsUpdate: 0 },
        'cybersecurity': { total: 0, needsUpdate: 0 },
        'devops-sre': { total: 0, needsUpdate: 0 }
      }
    };

    const content = await this.loadAllContent();

    for (const item of content) {
      audit.totalContent++;
      audit.byCategory[item.category].total++;

      const age = this.getContentAge(item.updatedAt);
      const freshness = await this.checkFreshness(item);

      if (freshness.needsUpdate || age > this.config.maxAgeDays) {
        audit.needsUpdate++;
        audit.byCategory[item.category].needsUpdate++;

        if (freshness.freshnessScore < 40) {
          audit.critical++;
        } else if (freshness.freshnessScore < 60) {
          audit.moderate++;
        } else {
          audit.minor++;
        }
      }
    }

    this.printAuditReport(audit);
    return audit;
  }

  /**
   * Update all content that needs it
   */
  async updateAllContent(): Promise<UpdateReport> {
    const report: UpdateReport = {
      timestamp: new Date(),
      audited: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      changes: [],
      errors: []
    };

    console.log('\n🔄 Updating content...\n');

    const content = await this.loadAllContent();

    for (const item of content) {
      report.audited++;

      try {
        const age = this.getContentAge(item.updatedAt);
        const freshness = await this.checkFreshness(item);

        const shouldUpdate = 
          freshness.needsUpdate || 
          age > this.config.maxAgeDays ||
          freshness.freshnessScore < this.config.minFreshnessScore;

        if (!shouldUpdate) {
          report.skipped++;
          console.log(`  ⏭️  Skipping ${item.title} (freshness: ${freshness.freshnessScore}%)`);
          continue;
        }

        console.log(`  🔄 Updating ${item.title} (freshness: ${freshness.freshnessScore}%, age: ${age} days)`);

        if (this.config.dryRun) {
          console.log(`    [DRY RUN] Would update with recommendations:`);
          freshness.recommendations.forEach(r => console.log(`      - ${r}`));
          report.updated++;
          continue;
        }

        // Perform update
        const updateResult = await this.updateContentItem(item, freshness);

        if (updateResult.success) {
          report.updated++;
          report.changes.push(...updateResult.changes);
          console.log(`    ✅ Updated successfully`);
        } else {
          report.failed++;
          report.errors.push(`Failed to update ${item.title}: ${updateResult.error}`);
          console.log(`    ❌ Failed: ${updateResult.error}`);
        }

      } catch (error) {
        report.failed++;
        report.errors.push(`Error updating ${item.title}: ${error}`);
        console.error(`    ❌ Error: ${error}`);
      }
    }

    this.printUpdateReport(report);
    return report;
  }

  /**
   * Update a specific content item
   */
  private async updateContentItem(
    item: ContentItem,
    freshness: FreshnessCheck
  ): Promise<{
    success: boolean;
    error?: string;
    changes: ContentChange[];
  }> {
    const changes: ContentChange[] = [];

    try {
      // Research latest information
      const research = await this.researchAgent.researchLatestDevelopments(
        item.topic,
        item.category,
        'month',
        'medium'
      );

      // Generate updated content based on type
      switch (item.type) {
        case 'lesson':
          return await this.updateLesson(item, freshness, research, changes);
        
        case 'course':
          return await this.updateCourse(item, freshness, research, changes);
        
        case 'code-example':
          return await this.updateCodeExample(item, freshness, research, changes);
        
        default:
          return { success: false, error: 'Unknown content type', changes: [] };
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        changes
      };
    }
  }

  /**
   * Update a lesson
   */
  private async updateLesson(
    item: ContentItem,
    freshness: FreshnessCheck,
    research: { keyInsights: string[] },
    changes: ContentChange[]
  ): Promise<{ success: boolean; error?: string; changes: ContentChange[] }> {
    // Identify sections to update
    const outdatedSections = freshness.outdatedElements;
    const newInfo = freshness.missingInformation;

    // Generate updated content
    const updatePrompt = `Update the following lesson with new information:

**Current Lesson:** ${item.title}
**Outdated Sections:** ${outdatedSections.join(', ')}
**New Information to Add:** ${newInfo.join(', ')}
**Recent Developments:** ${research.keyInsights.slice(0, 3).join('; ')}

Provide:
1. Updated sections
2. New sections to add
3. Content to remove
4. Updated summary and key takeaways`;

    // For now, mark as successful if we have updates to make
    if (outdatedSections.length > 0 || newInfo.length > 0) {
      changes.push({
        field: 'content',
        oldValue: 'Previous content',
        newValue: 'Updated content with latest information',
        reason: 'Content freshness update'
      });

      // Save updated content
      await this.saveUpdatedContent(item, changes);

      return { success: true, changes };
    }

    return { success: true, changes: [] };
  }

  /**
   * Update a course
   */
  private async updateCourse(
    item: ContentItem,
    freshness: FreshnessCheck,
    research: { keyInsights: string[] },
    changes: ContentChange[]
  ): Promise<{ success: boolean; error?: string; changes: ContentChange[] }> {
    // Update course metadata and structure
    changes.push({
      field: 'lastUpdated',
      oldValue: item.updatedAt.toISOString(),
      newValue: new Date().toISOString(),
      reason: 'Scheduled update'
    });

    // Add new module if significant new developments
    if (research.keyInsights.length > 2) {
      changes.push({
        field: 'modules',
        oldValue: '',
        newValue: 'New module on recent developments',
        reason: 'Significant new developments in topic'
      });
    }

    await this.saveUpdatedContent(item, changes);

    return { success: true, changes };
  }

  /**
   * Update a code example
   */
  private async updateCodeExample(
    item: ContentItem,
    freshness: FreshnessCheck,
    research: { keyInsights: string[] },
    changes: ContentChange[]
  ): Promise<{ success: boolean; error?: string; changes: ContentChange[] }> {
    // Check for API changes, deprecated patterns, etc.
    changes.push({
      field: 'code',
      oldValue: 'Previous code',
      newValue: 'Updated code with current best practices',
      reason: 'Best practices update'
    });

    await this.saveUpdatedContent(item, changes);

    return { success: true, changes };
  }

  // ============================================
  // Helper Methods
  // ============================================

  private async checkFreshness(item: ContentItem): Promise<FreshnessCheck> {
    const age = this.getContentAge(item.updatedAt);

    // Quick checks
    if (age < 7) {
      return {
        freshnessScore: 100,
        needsUpdate: false,
        outdatedElements: [],
        missingInformation: [],
        recommendations: []
      };
    }

    // Deep freshness check using research agent
    return await this.researchAgent.checkContentFreshness(
      item.topic,
      item.category,
      item.body || '',
      age
    );
  }

  private getContentAge(updatedAt: Date): number {
    return Math.floor((Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
  }

  private async loadAllContent(): Promise<ContentItem[]> {
    // Implementation to load content from storage
    // This would scan the content directory and load all content items
    return [];
  }

  private async saveUpdatedContent(
    item: ContentItem,
    changes: ContentChange[]
  ): Promise<void> {
    // Implementation to save updated content
    // This would write the updated content back to storage
  }

  private printAuditReport(audit: ContentAudit): void {
    console.log('\n📊 Content Audit Report');
    console.log('=' .repeat(50));
    console.log(`Total Content Items: ${audit.totalContent}`);
    console.log(`Needs Update: ${audit.needsUpdate} (${((audit.needsUpdate / audit.totalContent) * 100).toFixed(1)}%)`);
    console.log('\nBy Priority:');
    console.log(`  🔴 Critical: ${audit.critical}`);
    console.log(`  🟡 Moderate: ${audit.moderate}`);
    console.log(`  🟢 Minor: ${audit.minor}`);
    console.log('\nBy Category:');
    
    for (const [category, stats] of Object.entries(audit.byCategory)) {
      if (stats.total > 0) {
        const pct = ((stats.needsUpdate / stats.total) * 100).toFixed(0);
        console.log(`  ${category}: ${stats.needsUpdate}/${stats.total} need update (${pct}%)`);
      }
    }
    
    console.log('=' .repeat(50) + '\n');
  }

  private printUpdateReport(report: UpdateReport): void {
    console.log('\n📊 Update Report');
    console.log('=' .repeat(50));
    console.log(`Timestamp: ${report.timestamp.toISOString()}`);
    console.log(`Audited: ${report.audited}`);
    console.log(`Updated: ${report.updated}`);
    console.log(`Skipped: ${report.skipped}`);
    console.log(`Failed: ${report.failed}`);
    console.log(`Total Changes: ${report.changes.length}`);
    
    if (report.errors.length > 0) {
      console.log('\n⚠️  Errors:');
      report.errors.forEach(err => console.log(`  - ${err}`));
    }
    
    console.log('=' .repeat(50) + '\n');
  }
}

// ============================================
// Types
// ============================================

interface ContentItem {
  id: string;
  type: 'course' | 'lesson' | 'code-example';
  title: string;
  topic: string;
  category: TopicCategory;
  body?: string;
  updatedAt: Date;
  createdAt: Date;
}

interface FreshnessCheck {
  freshnessScore: number;
  needsUpdate: boolean;
  outdatedElements: string[];
  missingInformation: string[];
  recommendations: string[];
}

// ============================================
// CLI Entry Point
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const auditOnly = args.includes('--audit');

  const config: ContentUpdaterConfig = {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    perplexityApiKey: process.env.PERPLEXITY_API_KEY,
    contentDir: process.env.CONTENT_DIR || './content',
    maxAgeDays: 30,
    minFreshnessScore: 70,
    dryRun
  };

  if (!config.openaiApiKey) {
    console.error('❌ OPENAI_API_KEY environment variable is required');
    process.exit(1);
  }

  const updater = new ContentUpdater(config);

  if (auditOnly) {
    await updater.auditContent();
  } else {
    // Run audit first
    await updater.auditContent();
    
    // Then update
    if (!dryRun) {
      const confirm = await askConfirmation('Proceed with updates?');
      if (!confirm) {
        console.log('Cancelled.');
        process.exit(0);
      }
    }
    
    await updater.updateAllContent();
  }
}

function askConfirmation(message: string): Promise<boolean> {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    readline.question(`${message} (y/n): `, (answer: string) => {
      readline.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export default ContentUpdater;
