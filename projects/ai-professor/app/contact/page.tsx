import { Metadata } from 'next'
import { Mail, MessageSquare, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact - CXO Academy',
  description: 'Get in touch with the CXO Academy team.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
          Have a question, suggestion, or need support? We&apos;d love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Email Us</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">For general inquiries, partnerships, or support</p>
            <a href="mailto:support@cxoacademy.co" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              support@cxoacademy.co
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <Clock className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Response Time</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">We aim to respond to all inquiries within 24 hours during business days</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Monday - Friday, 9 AM - 6 PM SGT (UTC+8)</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            Send us a message
          </h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
              <select
                id="subject"
                name="subject"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="billing">Billing Question</option>
                <option value="partnership">Partnership Opportunity</option>
                <option value="feedback">Content Feedback</option>
                <option value="enterprise">Enterprise/Team Access</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tell us how we can help..."
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
