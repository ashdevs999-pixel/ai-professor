import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - CXO Academy',
  description: 'Learn how CXO Academy collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: April 2, 2026</p>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account information:</strong> Name, email address, and password when you create an account</li>
            <li><strong>Payment information:</strong> Payment method and transaction details when you purchase a course or program</li>
            <li><strong>Usage data:</strong> Pages visited, courses accessed, lesson progress, and time spent on the platform</li>
            <li><strong>Device information:</strong> Browser type, operating system, and device type for compatibility and security purposes</li>
            <li><strong>Communications:</strong> Content of messages you send to us via contact forms or support channels</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide, maintain, and improve our educational services</li>
            <li>Process transactions and send related information, including purchase confirmations and invoices</li>
            <li>Track your learning progress and provide personalized recommendations</li>
            <li>Respond to your comments, questions, and support requests</li>
            <li>Monitor and analyze trends to improve user experience</li>
            <li>Detect, investigate, and prevent fraudulent or unauthorized activities</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. Data Storage and Security</h2>
          <p>Your data is stored securely using industry-standard encryption (AES-256) both in transit (TLS 1.3) and at rest. We use Supabase (hosted on AWS) as our database provider, which maintains SOC 2 Type II compliance.</p>
          <p>We implement appropriate technical and organizational measures to protect your personal data. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">4. Cookies and Tracking</h2>
          <p>We use essential cookies to maintain your session (authentication, shopping cart) and optional analytics cookies to understand how users interact with our platform. You can disable non-essential cookies through your browser settings.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Essential cookies:</strong> Required for login, security, and shopping cart functionality</li>
            <li><strong>Analytics cookies:</strong> Help us understand usage patterns to improve the platform</li>
            <li><strong>Preference cookies:</strong> Remember your settings (theme, language preferences)</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">5. Third-Party Services</h2>
          <p>We may share limited data with trusted third-party service providers that help us operate our platform:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Supabase:</strong> Database and authentication services</li>
            <li><strong>Stripe:</strong> Payment processing (if applicable)</li>
            <li><strong>Vercel:</strong> Hosting and deployment services</li>
          </ul>
          <p>These providers are contractually obligated to protect your data and are prohibited from using it for their own purposes.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">6. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access, correct, or delete your personal data</li>
            <li>Object to or restrict the processing of your data</li>
            <li>Data portability (receive your data in a structured format)</li>
            <li>Withdraw consent at any time where processing is based on consent</li>
          </ul>
          <p>To exercise these rights, please contact us at <a href="mailto:support@cxoacademy.co" className="text-primary-600 dark:text-primary-400 underline">support@cxoacademy.co</a>.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">7. Data Retention</h2>
          <p>We retain your personal data for as long as your account is active or as needed to provide services. If you delete your account, we will delete your personal data within 30 days, except where we are legally required to retain it longer (e.g., financial records).</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">8. Children&apos;s Privacy</h2>
          <p>Our services are not directed at individuals under the age of 16. We do not knowingly collect personal data from children under 16.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">9. International Data Transfers</h2>
          <p>Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, including standard contractual clauses approved by relevant authorities.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">11. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at:</p>
          <ul className="list-none space-y-1">
            <li>Email: <a href="mailto:support@cxoacademy.co" className="text-primary-600 dark:text-primary-400 underline">support@cxoacademy.co</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
