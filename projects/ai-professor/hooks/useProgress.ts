import { useState, useCallback } from 'react';

interface ProgressState {
  lessonId: string;
  completed: boolean;
  timestamp: string;
}

export function useCourseProgress(courseId: string) {
  const storageKey = `course-progress-${courseId}`;
  
  const [progress, setProgress] = useState<ProgressState[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  });

  const updateProgress = useCallback((lessonId: string, completed: boolean) => {
    setProgress((prev) => {
      const existing = prev.findIndex((p) => p.lessonId === lessonId);
      const newItem: ProgressState = {
        lessonId,
        completed,
        timestamp: new Date().toISOString(),
      };

      let updated: ProgressState[];
      if (existing >= 0) {
        updated = [...prev];
        updated[existing] = newItem;
      } else {
        updated = [...prev, newItem];
      }

      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  }, [storageKey]);

  const getLessonProgress = useCallback((lessonId: string): boolean => {
    return progress.find((p) => p.lessonId === lessonId)?.completed ?? false;
  }, [progress]);

  const calculateOverallProgress = useCallback((totalLessons: number): number => {
    if (totalLessons === 0) return 0;
    const completed = progress.filter((p) => p.completed).length;
    return Math.round((completed / totalLessons) * 100);
  }, [progress]);

  const resetProgress = useCallback(() => {
    setProgress([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return {
    progress,
    updateProgress,
    getLessonProgress,
    calculateOverallProgress,
    resetProgress,
  };
}
