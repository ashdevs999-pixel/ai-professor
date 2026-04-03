import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - CXO Academy',
  description: 'Terms and conditions for using the CXO Academy platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: April 2, 2026</p>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
          <p><strong>IMPORTANT:</strong> By using CXO Academy, you agree to these terms. Please read them carefully.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>By accessing or using the CXO Academy platform (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not use the Service.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. Description of Service</h2>
          <p>CXO Academy provides online educational content including courses, learning programs, quick guides, and AI news. Content is delivered through our web platform and may include text-based lessons, exercises, and supplementary materials.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. User Accounts</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You must provide accurate and complete information when creating an account</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You must be at least 16 years old to create an account</li>
            <li>You may not create multiple accounts or share your account with others</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">4. Purchases and Payments</h2>
          <p>Courses and programs are available for individual purchase at the prices displayed on our pricing page. All prices are in USD unless otherwise stated.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Pricing:</strong> Prices are subject to change. You will be charged the price in effect at the time of purchase</li>
            <li><strong>Payment:</strong> Payment is processed securely through our payment provider</li>
            <li><strong>Refund Policy:</strong> We offer a 14-day money-back guarantee if you are unsatisfied with your purchase. Contact support to request a refund</li>
            <li><strong>Access:</strong> Upon successful payment, you receive lifetime access to the purchased content</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">5. Intellectual Property</h2>
          <p>All content on CXO Academy — including but not limited to text, graphics, logos, course materials, and software — is owned by or licensed to us and is protected by copyright and intellectual property laws.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You may access and use purchased content for your personal, non-commercial education</li>
            <li>You may not reproduce, distribute, modify, or create derivative works from our content</li>
            <li>You may not share your access credentials to allow others to access paid content</li>
            <li>Corporate/team access requires separate arrangement — contact us for team licensing</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">6. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
            <li>Copy, scrape, or redistribute our content without permission</li>
            <li>Interfere with or disrupt the Service&apos;s operation</li>
            <li>Impersonate any person or entity</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">7. Disclaimer of Warranties</h2>
          <p>THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, either express or implied. We do not guarantee that the Service will be uninterrupted, timely, secure, or error-free.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">8. Limitation of Liability</h2>
          <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, AI PROFESSOR SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">9. Indemnification</h2>
          <p>You agree to indemnify and hold harmless CXO Academy from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">10. Modifications</h2>
          <p>We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms. Material changes will be communicated via email or platform notification.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">11. Governing Law</h2>
          <p>These Terms are governed by the laws of Singapore, Any disputes shall be resolved in the courts of Singapore.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">12. Contact</h2>
          <p>For questions about these Terms, contact us at <a href="mailto:support@cxoacademy.co" className="text-primary-600 dark:text-primary-400 underline">support@cxoacademy.co</a>.</p>
        </div>
      </div>
    </div>
  )
}
