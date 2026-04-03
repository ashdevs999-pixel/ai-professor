import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentSession } from '@/lib/auth'
import { db } from '@/lib/supabase'
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  Crown,
  FileText,
  Settings,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Admin Dashboard - CXO Academy',
  description: 'Admin dashboard for CXO Academy',
}

// Admin emails that bypass all checks
const ADMIN_EMAILS = ['bryanbleong@gmail.com']

async function getStats() {
  try {
    const admin = true // Use admin client
    
    // Get user count
    const users = await db.users.getAll()
    const userCount = users.length
    
    // Get enrollment count
    const allEnrollments = []
    for (const user of users) {
      const enrollments = await db.enrollments.getByUser(user.id)
      allEnrollments.push(...enrollments)
    }
    const enrollmentCount = allEnrollments.length
    
    // Get course count
    const courses = await db.courses.getAll({ is_published: true })
    const courseCount = courses.length
    
    return {
      userCount,
      enrollmentCount,
      courseCount,
      revenue: 0 // Placeholder - integrate with Stripe later
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return {
      userCount: 0,
      enrollmentCount: 0,
      courseCount: 0,
      revenue: 0
    }
  }
}

export default async function AdminPage() {
  const session = await getCurrentSession()
  
  // Check if user is admin
  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email)
  
  if (!isAdmin) {
    redirect('/')
  }
  
  const stats = await getStats()
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome back, {session.user.email}</p>
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.userCount}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.enrollmentCount}</div>
              <p className="text-xs text-muted-foreground">Course enrollments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Courses</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.courseCount}</div>
              <p className="text-xs text-muted-foreground">Active courses</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Placeholder (integrate with Stripe)</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/courses">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Manage Courses
                </CardTitle>
                <CardDescription>
                  View, edit, and manage all courses
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Manage Users
                </CardTitle>
                <CardDescription>
                  View and manage user accounts
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/enrollments">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  View Enrollments
                </CardTitle>
                <CardDescription>
                  Track course enrollments and progress
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/content">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Content Management
                </CardTitle>
                <CardDescription>
                  Generate and manage course content
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Analytics
                </CardTitle>
                <CardDescription>
                  View detailed analytics and reports
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/settings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </CardTitle>
                <CardDescription>
                  Configure site settings
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
        
        {/* Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Admin Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Your Admin Privileges</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                <li>Access all lesson content without enrollment</li>
                <li>View all users and their data</li>
                <li>Manage courses and content</li>
                <li>View analytics and reports</li>
              </ul>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Note:</strong> This is a basic admin dashboard. More features will be added soon.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
