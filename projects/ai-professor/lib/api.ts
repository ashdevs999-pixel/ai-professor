import type { Course, CourseFilters, PaginatedResponse, User, Review } from '@/types';

const API_BASE = '/api';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // Handle wrapped responses
    if (data.success !== undefined) {
      return data.data;
    }
    
    return data;
  }

  // Course methods
  async getCourses(filters?: CourseFilters): Promise<PaginatedResponse<Course>> {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.level) params.set('difficulty', filters.level);
    if (filters?.page) params.set('page', filters.page.toString());
    
    const result = await this.request<{ courses: any[], pagination: any }>(`/courses?${params}`);
    
    // Transform API response to match Course type
    return {
      data: result.courses.map(course => this.transformCourse(course)),
      total: result.pagination.total,
      page: result.pagination.page,
      pageSize: result.pagination.limit,
      hasMore: result.pagination.page < result.pagination.totalPages,
    };
  }

  async getCourse(id: string): Promise<Course> {
    const course = await this.request<any>(`/courses/${id}`);
    return this.transformCourse(course);
  }

  async getFeaturedCourses(): Promise<Course[]> {
    const result = await this.getCourses({ page: 1 });
    return result.data.slice(0, 3);
  }

  private transformCourse(apiCourse: any): Course {
    // Group lessons by week to create curriculum
    const curriculum = this.groupLessonsByWeek(apiCourse.lessons || [], apiCourse.topic);
    
    return {
      id: apiCourse.id,
      slug: apiCourse.id,
      title: apiCourse.title,
      description: apiCourse.description || '',
      shortDescription: apiCourse.description?.substring(0, 150) || '',
      thumbnail: apiCourse.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
      instructor: {
        id: apiCourse.instructor_id || 'unknown',
        name: 'AI Expert',
        avatar: 'https://ui-avatars.com/api/?name=AI+Expert&size=200&background=6366f1&color=fff',
        title: 'AI Research Scientist',
        bio: 'Expert in artificial intelligence',
        expertise: [apiCourse.topic],
        rating: 4.8,
        courseCount: 1,
        studentCount: 1000,
      },
      level: apiCourse.difficulty || 'beginner',
      duration: `${apiCourse.duration_weeks || 8} weeks`,
      weeklyHours: 5,
      enrolledCount: apiCourse.enrolled_count || 0,
      rating: 4.5,
      reviewCount: 50,
      price: 0,
      topics: [apiCourse.topic],
      prerequisites: [],
      learningOutcomes: [],
      curriculum,
      featured: false,
      createdAt: apiCourse.created_at,
      updatedAt: apiCourse.updated_at,
    };
  }
  
  private groupLessonsByWeek(lessons: any[], topic: string) {
    const weekMap = new Map<number, any[]>();
    
    lessons.forEach(lesson => {
      const week = lesson.week_number || 1;
      if (!weekMap.has(week)) {
        weekMap.set(week, []);
      }
      weekMap.get(week)!.push({
        id: lesson.id,
        title: lesson.title,
        description: lesson.content?.substring(0, 100) || 'Learn key concepts',
        week: week,
        order: lesson.order_index || 1,
        duration: `${Math.round((lesson.estimated_minutes || 60) / 60)}h`,
        videoDuration: lesson.video_url ? '15 min' : undefined,
      });
    });
    
    const curriculum = [];
    for (let week = 1; weekMap.has(week); week++) {
      curriculum.push({
        week,
        title: `Week ${week}`,
        description: `${topic} - Week ${week}`,
        lessons: weekMap.get(week) || [],
        duration: '5 hours',
      });
    }
    
    return curriculum;
  }

  // User methods
  async getUserProfile(): Promise<User> {
    return this.request<User>('/user/profile');
  }

  // Reviews
  async getCourseReviews(courseId: string): Promise<PaginatedResponse<Review>> {
    return this.request<PaginatedResponse<Review>>(`/courses/${courseId}/reviews`);
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await fetch('/api/auth/callback/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  }

  async signup(data: { name: string; email: string; password: string }) {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Signup failed' }));
      throw new Error(error.error || 'Signup failed');
    }
    
    return response.json();
  }

  async resetPassword(email: string) {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    return { success: true, message: 'Password reset email sent' };
  }
}

export const api = new ApiClient();
