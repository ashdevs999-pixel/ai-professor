'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button, Select, Badge } from '@/components/ui';
import type { NewsFiltersProps, NewsCategory, NEWS_CATEGORY_LABELS } from '@/types/news';
import { NEWS_CATEGORY_LABELS as categoryLabels } from '@/types/news';

const categories: NewsCategory[] = ['news', 'launches', 'research', 'tools', 'announcements'];

export function NewsFilters({
  filters,
  onFilterChange,
  sources,
  showCategoryFilter = true,
  showSourceFilter = true,
  showDateFilter = false,
}: NewsFiltersProps) {
  const hasActiveFilters = filters.category || filters.source || filters.startDate || filters.endDate;

  const clearFilters = () => {
    onFilterChange({
      category: undefined,
      source: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Category Filter */}
        {showCategoryFilter && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <Select
              value={filters.category || ''}
              onChange={(e) => onFilterChange({ category: e.target.value as NewsCategory || undefined })}
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map((cat) => ({
                  value: cat,
                  label: categoryLabels[cat],
                })),
              ]}
            />
          </div>
        )}

        {/* Source Filter */}
        {showSourceFilter && sources && sources.length > 0 && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source
            </label>
            <Select
              value={filters.source || ''}
              onChange={(e) => onFilterChange({ source: e.target.value || undefined })}
              options={[
                { value: '', label: 'All Sources' },
                ...sources.map((source) => ({
                  value: source,
                  label: source,
                })),
              ]}
            />
          </div>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="pt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              leftIcon={<X className="w-4 h-4" />}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="primary" className="flex items-center gap-1">
              {categoryLabels[filters.category]}
              <button
                onClick={() => onFilterChange({ category: undefined })}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.source && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.source}
              <button
                onClick={() => onFilterChange({ source: undefined })}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
