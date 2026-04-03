import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy - CXO Academy',
  description: 'Learn about how CXO Academy uses cookies and similar technologies.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Cookie Policy</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: April 2, 2026</p>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">What Are Cookies?</h2>
          <p>Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, improve performance, and understand how you use our platform.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cookies We Use</h2>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Essential Cookies</h3>
          <p>These are necessary for the platform to function and cannot be disabled:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Authentication cookies</strong> — Keep you logged in securely</li>
            <li><strong>Session cookies</strong> — Maintain your session state as you navigate</li>
            <li><strong>CSRF protection</strong> — Prevent cross-site request forgery attacks</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Functional Cookies</h3>
          <p>These enable enhanced functionality and personalization:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Theme preference</strong> — Remember your light/dark mode choice</li>
            <li><strong>Language preference</strong> — Remember your selected language</li>
            <li><strong>Course progress</strong> — Track your learning progress locally</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Cookies</h3>
          <p>These help us understand how users interact with our platform:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Page views</strong> — Which pages are visited most frequently</li>
            <li><strong>Time on page</strong> — How long users spend on lessons</li>
            <li><strong>Navigation patterns</strong> — How users move through the platform</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Managing Cookies</h2>
          <p>You can control and manage cookies through your browser settings. Most browsers allow you to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>View what cookies are stored and delete individual ones</li>
            <li>Block cookies from specific or all websites</li>
            <li>Block third-party cookies while allowing first-party cookies</li>
            <li>Clear all cookies when you close your browser</li>
          </ul>
          <p>Please note that disabling essential cookies may affect the functionality of our platform.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Third-Party Cookies</h2>
          <p>We use carefully selected third-party services that may set their own cookies:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Supabase</strong> — Authentication and database services</li>
            <li><strong>Vercel</strong> — Hosting and performance analytics</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Changes to This Policy</h2>
          <p>We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated revision date.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact</h2>
          <p>Questions about our use of cookies? Contact us at <a href="mailto:support@cxoacademy.co" className="text-primary-600 dark:text-primary-400 underline">support@cxoacademy.co</a>.</p>
        </div>
      </div>
    </div>
  )
}
