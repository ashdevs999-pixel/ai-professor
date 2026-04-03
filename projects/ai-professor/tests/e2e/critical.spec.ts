import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://ai-professor-red.vercel.app';

test.describe('Critical Path Tests', () => {
  
  test('Homepage loads', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/CXO Academy/);
    await expect(page.locator('h1')).toContainText('CXO');
  });

  test('Guides page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/guides`);
    await expect(page.locator('h1')).toContainText('Quick Guides');
    // Should show at least one guide card
    await expect(page.locator('text=Installing OpenClaw')).toBeVisible();
  });

  test('Guide detail page loads without error', async ({ page }) => {
    await page.goto(`${BASE_URL}/guides/guide-openclaw`);
    
    // Should NOT show error page
    await expect(page.locator('text=Application error')).not.toBeVisible();
    await expect(page.locator('text=Guide Not Found')).not.toBeVisible();
    
    // Should show lesson content
    await expect(page.locator('text=What is OpenClaw')).toBeVisible();
  });

  test('All guide pages load', async ({ page }) => {
    const guides = [
      'guide-openclaw',
      'guide-chatgpt',
      'guide-claude',
      'guide-gemini',
      'guide-grok',
      'guide-kimi',
      'guide-perplexity',
      'guide-cursor',
      'guide-vscode',
      'guide-github',
      'guide-website',
      'guide-botfather',
      'guide-rag-knowledge-bases',
      'guide-crewai-agents',
      'guide-voice-ai-elevenlabs',
      'guide-ai-image-generation',
      'guide-fine-tuning-llms',
      'guide-ai-excel-sheets',
      'guide-ai-email-automation',
      'guide-ai-meeting-assistants',
      'guide-nocode-ai-apps',
      'guide-github-copilot-deep-dive',
      'guide-windsurf-ide',
      'guide-vibe-coding',
    ];

    for (const guide of guides) {
      await page.goto(`${BASE_URL}/guides/${guide}`);
      await expect(page.locator('text=Application error')).not.toBeVisible();
      await expect(page.locator('text=Guide Not Found')).not.toBeVisible();
    }
  });

  test('Courses page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/courses`);
    await expect(page.locator('h1')).toContainText('Courses');
  });

  test('Course detail page loads without error', async ({ page }) => {
    // Test first course
    await page.goto(`${BASE_URL}/courses/245cbd99-b45d-448e-8b12-3ab3b865a3da`);
    
    // Should NOT show error page
    await expect(page.locator('text=Application error')).not.toBeVisible();
    await expect(page.locator('text=Course Not Found')).not.toBeVisible();
    
    // Should show course content
    await expect(page.locator('text=Machine Learning')).toBeVisible();
  });

  test('All course pages load', async ({ page }) => {
    const courses = [
      { id: '245cbd99-b45d-448e-8b12-3ab3b865a3da', name: 'Machine Learning' },
      { id: '6f466bf7-5e89-4f5e-b14c-cefaa9bf3800', name: 'Deep Learning' },
      { id: 'a3224274-bfb4-4b61-81ab-fe35e203269b', name: 'NLP' },
      { id: '1cff768a-d1d1-4c33-9d99-be1b621e96fa', name: 'AI Engineer' },
      { id: '37993b02-0364-43c4-938b-e41250a0e8ce', name: 'Vibe Coding' },
    ];

    for (const course of courses) {
      await page.goto(`${BASE_URL}/courses/${course.id}`);
      await expect(page.locator('text=Application error')).not.toBeVisible();
      await expect(page.locator('text=Course Not Found')).not.toBeVisible();
    }
  });

  test('News page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/news`);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('Breaking news page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/breaking`);
    await expect(page.locator('h1')).toContainText('Breaking');
  });

  test('Stats API returns valid data', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/stats`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('articles');
    expect(data).toHaveProperty('guides');
    expect(data).toHaveProperty('courses');
    expect(typeof data.articles).toBe('number');
    expect(typeof data.guides).toBe('number');
    expect(typeof data.courses).toBe('number');
  });
});

test.describe('No Console Errors', () => {
  
  test('Homepage has no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning:') && 
      !e.includes('noopener') &&
      !e.includes('favicon')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('Guides page has no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto(`${BASE_URL}/guides`);
    await page.waitForLoadState('networkidle');

    const criticalErrors = errors.filter(e => 
      !e.includes('Warning:') && 
      !e.includes('noopener')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
