'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  Calendar,
  ChevronRight,
  Play,
  CheckCircle,
} from 'lucide-react';
import { Button, Card, Badge, ProgressBar, Avatar } from '@/components/ui';
import { CourseCard } from '@/components/course';
import { Sidebar } from '@/components/layout';
import { useFeaturedCourses } from '@/hooks';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';

// Mock data for enrolled courses
const enrolledCourses = [
  {
    id: '1',
    title: 'Deep Learning Fundamentals',
    progress: 75,
    currentLesson: 'Week 6: Convolutional Neural Networks',
    nextLesson: 'CNN Architecture',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop',
    instructor: { name: 'Dr. Sarah Chen', avatar: '' },
  },
  {
    id: '2',
    title: 'Natural Language Processing',
    progress: 40,
    currentLesson: 'Week 3: Word Embeddings',
    nextLesson: 'Word2Vec Implementation',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
    instructor: { name: 'Prof. James Wilson', avatar: '' },
  },
  {
    id: '3',
    title: 'Reinforcement Learning',
    progress: 15,
    currentLesson: 'Week 1: Introduction to RL',
    nextLesson: 'Markov Decision Processes',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=225&fit=crop',
    instructor: { name: 'Dr. Emily Park', avatar: '' },
  },
];

const certificates = [
  {
    id: '1',
    title: 'Machine Learning Basics',
    issuedAt: '2024-01-15',
    credentialUrl: '#',
  },
  {
    id: '2',
    title: 'Python for Data Science',
    issuedAt: '2024-02-20',
    credentialUrl: '#',
  },
];

const upcomingLessons = [
  {
    id: '1',
    course: 'Deep Learning Fundamentals',
    lesson: 'CNN Architecture',
    time: 'Today, 3:00 PM',
    duration: '45 min',
  },
  {
    id: '2',
    course: 'Natural Language Processing',
    lesson: 'Word2Vec Implementation',
    time: 'Tomorrow, 10:00 AM',
    duration: '30 min',
  },
  {
    id: '3',
    course: 'Reinforcement Learning',
    lesson: 'Markov Decision Processes',
    time: 'Wednesday, 2:00 PM',
    duration: '40 min',
  },
];

const stats = [
  {
    label: 'Courses Enrolled',
    value: '3',
    icon: BookOpen,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    label: 'Completed',
    value: '2',
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    label: 'Certificates',
    value: '2',
    icon: Award,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    label: 'Hours Learned',
    value: '45',
    icon: Clock,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { data: recommendedCourses } = useFeaturedCourses();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?message=Please sign in to access your dashboard');
    }
  }, [isAuthenticated, router]);

  // Show loading while checking auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main
        className={cn(
          'transition-all duration-300',
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Continue your learning journey
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center gap-4">
                  <div className={cn('p-3 rounded-lg', stat.bgColor)}>
                    <stat.icon className={cn('w-6 h-6', stat.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Continue Learning */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Continue Learning
                  </h2>
                  <Link
                    href="/dashboard/courses"
                    className="text-primary-600 dark:text-primary-400 hover:underline text-sm flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <Card key={course.id} hover className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-32 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {course.currentLesson}
                          </p>
                          <div className="mb-2">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600 dark:text-gray-400">
                                Progress
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {course.progress}%
                              </span>
                            </div>
                            <ProgressBar value={course.progress} size="sm" />
                          </div>
                          <Button size="sm" leftIcon={<Play className="w-4 h-4" />}>
                            Continue
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Recommended Courses */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Recommended for You
                  </h2>
                  <Link
                    href="/courses"
                    className="text-primary-600 dark:text-primary-400 hover:underline text-sm flex items-center gap-1"
                  >
                    Browse All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {recommendedCourses?.slice(0, 2).map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Upcoming Lessons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Upcoming Lessons
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {upcomingLessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className={cn(
                          'p-3 rounded-lg',
                          index === 0
                            ? 'bg-primary-50 dark:bg-primary-900/20'
                            : 'bg-gray-50 dark:bg-gray-800'
                        )}
                      >
                        <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          {lesson.lesson}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {lesson.course}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                          <span>{lesson.time}</span>
                          <span>•</span>
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Certificates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Certificates
                      </h2>
                    </div>
                    <Link
                      href="/dashboard/certificates"
                      className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {cert.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Issued {new Date(cert.issuedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Learning Streak */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Learning Streak</h2>
                  </div>
                  <p className="text-4xl font-bold mb-1">7 Days</p>
                  <p className="text-primary-100 text-sm">
                    Keep it up! You're on fire! 🔥
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
