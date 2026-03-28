'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Clock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/types';

interface LessonCardProps {
  lesson: Lesson;
  courseSlug: string;
  isCompleted?: boolean;
  isCurrent?: boolean;
}

export function LessonCard({ lesson, courseSlug, isCompleted = false, isCurrent = false }: LessonCardProps) {
  return (
    <Link href={`/courses/${courseSlug}/${lesson.week}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer',
          'border-gray-200 dark:border-gray-700',
          isCurrent
            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
        )}
      >
        {/* Status Icon */}
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
            isCompleted
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
              : isCurrent
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
          )}
        >
          {isCompleted ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white truncate">
            {lesson.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
            {lesson.description}
          </p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          {lesson.videoDuration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{lesson.videoDuration}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
