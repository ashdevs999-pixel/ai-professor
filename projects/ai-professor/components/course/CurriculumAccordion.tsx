'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CurriculumWeek, Lesson } from '@/types';

interface CurriculumAccordionProps {
  weeks: CurriculumWeek[];
  courseSlug: string;
  completedLessons?: string[];
  currentWeek?: number;
}

export function CurriculumAccordion({
  weeks,
  courseSlug,
  completedLessons = [],
  currentWeek,
}: CurriculumAccordionProps) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(
    currentWeek ?? weeks[0]?.week ?? null
  );

  const toggleWeek = (week: number) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

  return (
    <div className="space-y-3">
      {weeks.map((week) => (
        <div
          key={week.week}
          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
        >
          {/* Week Header */}
          <button
            onClick={() => toggleWeek(week.week)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            aria-expanded={expandedWeek === week.week}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center font-bold',
                  expandedWeek === week.week
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}
              >
                {week.week}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {week.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {week.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{week.lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{week.duration}</span>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-gray-400 transition-transform',
                  expandedWeek === week.week && 'rotate-180'
                )}
              />
            </div>
          </button>

          {/* Week Content */}
          <AnimatePresence>
            {expandedWeek === week.week && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-3 space-y-2">
                  {week.lessons.map((lesson) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      courseSlug={courseSlug}
                      isCompleted={completedLessons.includes(lesson.id)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function LessonItem({
  lesson,
  courseSlug,
  isCompleted,
}: {
  lesson: Lesson;
  courseSlug: string;
  isCompleted: boolean;
}) {
  return (
    <a
      href={`/courses/${courseSlug}/${lesson.week}?lesson=${lesson.id}`}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors group"
    >
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
          isCompleted
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20'
        )}
      >
        {lesson.order}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
          {lesson.title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {lesson.description}
        </p>
      </div>
      {lesson.videoDuration && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {lesson.videoDuration}
        </span>
      )}
    </a>
  );
}
