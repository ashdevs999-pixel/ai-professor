'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import type { Course } from '@/types';
import { formatNumber, formatCurrency } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  featured?: boolean;
}

export function CourseCard({ course, featured = false }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card hover padding="none" className="h-full overflow-hidden">
          {/* Thumbnail */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {featured && (
              <div className="absolute top-3 left-3">
                <Badge variant="secondary">Featured</Badge>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <Badge
                variant={course.level === 'beginner' ? 'success' : course.level === 'intermediate' ? 'warning' : 'error'}
              >
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {course.shortDescription}
            </p>

            {/* Instructor */}
            <div className="flex items-center gap-2 mb-4">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {course.instructor.name}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration_weeks ? `${course.duration_weeks} weeks` : 'Self-paced'}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.lesson_count || 10} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{formatNumber(course.enrolledCount || 0)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{(course.rating || 4.8).toFixed(1)}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(course.price)}
                </span>
                {course.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatCurrency(course.originalPrice)}
                  </span>
                )}
              </div>
              <Button size="sm">View Course</Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
