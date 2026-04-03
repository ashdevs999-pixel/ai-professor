'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ExternalLink, User, ArrowLeft, Share2 } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { NewsArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo';
import type { NewsItem } from '@/types/news';
import { NEWS_CATEGORY_LABELS as categoryLabels, NEWS_CATEGORY_COLORS as categoryColors } from '@/types/news';
import {
  TwitterShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  TwitterIcon,
  LinkedinIcon,
  FacebookIcon,
} from 'react-share';

export default function NewsArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/news/${params.id}`);
        const data = await response.json();
        
        if (data.success || data.data) {
          setArticle(data.data || data);
          
          // Fetch related articles
          const relatedResponse = await fetch(
            `/api/news?category=${(data.data || data).category}&limit=3`
          );
          const relatedData = await relatedResponse.json();
          
          if (relatedData.success || relatedData.data) {
            const items = relatedData.data || relatedData;
            setRelatedArticles(
              items.filter((item: NewsItem) => item.id !== (data.data || data).id).slice(0, 3)
            );
          }
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Article Not Found
          </h1>
          <Link href="/news">
            <Button>Back to News</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent';

  const shareUrl = `https://cxoacademy.co/news/${article.id}`;
  const shareTitle = article.title;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* SEO Structured Data */}
      <NewsArticleJsonLd
        headline={article.title}
        description={article.summary || article.title}
        url={`https://cxoacademy.co/news/${article.id}`}
        datePublished={article.published_at || article.created_at || new Date().toISOString()}
        dateModified={article.created_at}
        category={categoryLabels[article.category]}
        sourceName={article.source_name}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://cxoacademy.co' },
          { name: 'AI News', url: 'https://cxoacademy.co/news' },
          { name: article.title, url: `https://cxoacademy.co/news/${article.id}` },
        ]}
      />
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/news"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to News
          </Link>

          <Badge variant={categoryColors[article.category] as any} className="mb-4">
            {categoryLabels[article.category]}
          </Badge>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-1">
              <ExternalLink className="w-4 h-4" />
              <span>{article.source_name}</span>
            </div>
            {article.author && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Share2 className="w-4 h-4" />
              Share:
            </span>
            <TwitterShareButton url={shareUrl} title={shareTitle}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={shareUrl} title={shareTitle}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <FacebookShareButton url={shareUrl}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Image */}
        {article.image_url && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Summary */}
        {article.summary && (
          <Card className="mb-8 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Summary
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{article.summary}</p>
          </Card>
        )}

        {/* Content */}
        {article.content && (
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {article.content}
            </p>
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Read Original */}
        <Card className="mb-12 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Read the Full Article
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Continue reading at {article.source_name}
              </p>
            </div>
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button rightIcon={<ExternalLink className="w-4 h-4" />}>
                Read Original
              </Button>
            </a>
          </div>
        </Card>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <Link href={`/news/${item.id}`}>
                    <div className="p-4">
                      <Badge variant={categoryColors[item.category] as any} className="mb-2">
                        {categoryLabels[item.category]}
                      </Badge>
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
