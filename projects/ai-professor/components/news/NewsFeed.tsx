'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { NewsCard } from './NewsCard';
import { NewsFilters } from './NewsFilters';
import { NewsSearch } from './NewsSearch';
import type { NewsItem, NewsFilters as NewsFiltersType } from '@/types/news';

interface NewsFeedProps {
  filters?: NewsFiltersType;
  showFilters?: boolean;
  showSearch?: boolean;
  infiniteScroll?: boolean;
  itemsPerPage?: number;
}

export function NewsFeed({
  filters: initialFilters = {},
  showFilters = true,
  showSearch = true,
  infiniteScroll = true,
  itemsPerPage = 20,
}: NewsFeedProps) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState<NewsFiltersType>(initialFilters);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch news items
  const fetchNews = useCallback(
    async (pageNum: number, append: boolean = false) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.source) params.append('source', filters.source);
        if (filters.search) params.append('search', filters.search);
        if (filters.tags) params.append('tags', filters.tags.join(','));
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        params.append('page', pageNum.toString());
        params.append('limit', itemsPerPage.toString());
        params.append('sortBy', filters.sortBy || 'published_at');
        params.append('sortOrder', filters.sortOrder || 'desc');

        const response = await fetch(`/api/news?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setTotalItems(data.pagination.total);
          
          if (append) {
            setItems((prev) => [...prev, ...data.data]);
          } else {
            setItems(data.data);
          }
          
          setHasMore(pageNum < data.pagination.totalPages);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters, itemsPerPage]
  );

  // Initial fetch and when filters change
  useEffect(() => {
    setPage(1);
    fetchNews(1, false);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<NewsFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    handleFilterChange({ search: query, page: 1 });
  }, [handleFilterChange]);

  // Load more items
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage, true);
    }
  }, [loadingMore, hasMore, page, fetchNews]);

  // Infinite scroll
  useEffect(() => {
    if (!infiniteScroll) return;

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [infiniteScroll, loadMore]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      {showSearch && (
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 py-4">
          <NewsSearch onSearch={handleSearch} />
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <NewsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Results Count */}
      {!loading && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {items.length} of {totalItems} articles
        </div>
      )}

      {/* News Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No news items found. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NewsCard item={item} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {infiniteScroll && hasMore && !loading && (
        <div className="flex justify-center py-8">
          {loadingMore ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          ) : (
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
}
