import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CourseFilters } from '@/types';

export function useCourses(filters?: CourseFilters) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => api.getCourses(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCourse(slug: string) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: () => api.getCourse(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useFeaturedCourses() {
  return useQuery({
    queryKey: ['featured-courses'],
    queryFn: () => api.getFeaturedCourses(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useCourseReviews(courseId: string) {
  return useQuery({
    queryKey: ['course-reviews', courseId],
    queryFn: () => api.getCourseReviews(courseId),
    enabled: !!courseId,
  });
}
