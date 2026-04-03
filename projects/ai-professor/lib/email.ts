// Email Utility using Resend

import { Resend } from 'resend'

// Lazy initialization to avoid build-time errors
let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build')
  }
  return _resend
}

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

// Default from address
const DEFAULT_FROM = process.env.EMAIL_FROM || 'CXO Academy <noreply@cxoacademy.co>'

// Send email
export async function sendEmail(options: EmailOptions): Promise<{ id: string }> {
  try {
    const resend = getResend()
    const { data, error } = await resend.emails.send({
      from: options.from || DEFAULT_FROM,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      attachments: options.attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
      })),
    })

    if (error) {
      throw new Error(error.message)
    }

    return { id: data?.id || '' }
  } catch (error: any) {
    throw new EmailError(
      error.message || 'Failed to send email',
      error.code
    )
  }
}

// Email templates
export const emailTemplates = {
  // Welcome email for new users
  welcome: (name: string, email: string) => ({
    subject: 'Welcome to CXO Academy! 🎓',
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to CXO Academy!</h1>
    </div>
    <div class="content">
      <h2>Hi ${name},</h2>
      <p>Welcome to CXO Academy! We're excited to have you on board.</p>
      <p>Stay current with AI news. Get smarter with AI courses. One platform.</p>
      <p>You now have access to:</p>
      <ul>
        <li>📚 Expert-designed courses</li>
        <li>🤖 AI-powered learning assistance</li>
        <li>📊 Progress tracking</li>
        <li>🎯 Personalized learning paths</li>
      </ul>
      <p>Get started by exploring our course catalog and enrolling in your first course!</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses" class="button">Browse Courses</a>
      </p>
      <p>Happy learning!</p>
      <p>The CXO Academy Team</p>
    </div>
    <div class="footer">
      <p>CXO Academy - Where leaders learn to lead in the age of AI.</p>
      <p>${process.env.NEXT_PUBLIC_APP_URL}</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Welcome to CXO Academy!

Hi ${name},

Welcome to CXO Academy! We're excited to have you on board.

You now have access to:
- Expert-designed courses
- AI-powered learning assistance
- Progress tracking
- Personalized learning paths

Get started by exploring our course catalog: ${process.env.NEXT_PUBLIC_APP_URL}/courses

Happy learning!
The CXO Academy Team
    `,
  }),

  // Course enrollment confirmation
  enrollmentConfirmation: (
    userName: string,
    courseTitle: string,
    courseId: string
  ) => ({
    subject: `You've enrolled in ${courseTitle}! 📚`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Enrollment Confirmed!</h1>
    </div>
    <div class="content">
      <h2>Hi ${userName},</h2>
      <p>You've successfully enrolled in <strong>${courseTitle}</strong>!</p>
      <p>Your learning journey begins now. Here's what you can do next:</p>
      <ul>
        <li>📖 Start with the first lesson</li>
        <li>📝 Take notes as you learn</li>
        <li>🤖 Use AI assistance for questions</li>
        <li>📊 Track your progress</li>
      </ul>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}" class="button">Start Learning</a>
      </p>
      <p>Happy learning!</p>
      <p>The CXO Academy Team</p>
    </div>
    <div class="footer">
      <p>CXO Academy - Where leaders learn to lead in the age of AI.</p>
      <p>${process.env.NEXT_PUBLIC_APP_URL}</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Enrollment Confirmed!

Hi ${userName},

You've successfully enrolled in ${courseTitle}!

Your learning journey begins now. Start with the first lesson: ${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}

Happy learning!
The CXO Academy Team
    `,
  }),

  // Course completion
  courseCompletion: (
    userName: string,
    courseTitle: string,
    courseId: string,
    completionDate: string
  ) => ({
    subject: `Congratulations! You've completed ${courseTitle}! 🎉`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .certificate { background: white; padding: 20px; border: 2px solid #667eea; margin: 20px 0; text-align: center; }
    .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Course Completed!</h1>
    </div>
    <div class="content">
      <h2>Congratulations, ${userName}!</h2>
      <p>You've successfully completed <strong>${courseTitle}</strong>!</p>
      <div class="certificate">
        <h3>Certificate of Completion</h3>
        <p><strong>${userName}</strong></p>
        <p>has completed</p>
        <p><strong>${courseTitle}</strong></p>
        <p>on ${completionDate}</p>
      </div>
      <p>What's next?</p>
      <ul>
        <li>📜 Download your certificate</li>
        <li>📚 Explore related courses</li>
        <li>💼 Apply your new skills</li>
      </ul>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}/certificate" class="button">View Certificate</a>
      </p>
      <p>Keep up the great work!</p>
      <p>The CXO Academy Team</p>
    </div>
    <div class="footer">
      <p>CXO Academy - Where leaders learn to lead in the age of AI.</p>
      <p>${process.env.NEXT_PUBLIC_APP_URL}</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Congratulations!

Hi ${userName},

You've successfully completed ${courseTitle}!

You can view and download your certificate here: ${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}/certificate

Keep up the great work!
The CXO Academy Team
    `,
  }),

  // Subscription confirmation
  subscriptionConfirmation: (
    userName: string,
    planName: string,
    amount: string,
    nextBillingDate: string
  ) => ({
    subject: `Your ${planName} subscription is active! ✨`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Subscription Activated!</h1>
    </div>
    <div class="content">
      <h2>Hi ${userName},</h2>
      <p>Your <strong>${planName}</strong> subscription is now active!</p>
      <p>Subscription details:</p>
      <ul>
        <li>Plan: ${planName}</li>
        <li>Amount: ${amount}</li>
        <li>Next billing date: ${nextBillingDate}</li>
      </ul>
      <p>You now have access to all ${planName} features!</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/billing" class="button">Manage Subscription</a>
      </p>
      <p>Thank you for choosing CXO Academy!</p>
      <p>The CXO Academy Team</p>
    </div>
    <div class="footer">
      <p>CXO Academy - Where leaders learn to lead in the age of AI.</p>
      <p>${process.env.NEXT_PUBLIC_APP_URL}</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Subscription Activated!

Hi ${userName},

Your ${planName} subscription is now active!

Plan: ${planName}
Amount: ${amount}
Next billing date: ${nextBillingDate}

Manage your subscription: ${process.env.NEXT_PUBLIC_APP_URL}/account/billing

Thank you for choosing CXO Academy!
The CXO Academy Team
    `,
  }),

  // Password reset
  passwordReset: (userName: string, resetLink: string) => ({
    subject: 'Reset Your Password',
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <h2>Hi ${userName},</h2>
      <p>We received a request to reset your password.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </p>
      <div class="warning">
        <p><strong>Security notice:</strong> This link will expire in 24 hours. If you didn't request a password reset, please ignore this email.</p>
      </div>
      <p>Stay secure!</p>
      <p>The CXO Academy Team</p>
    </div>
    <div class="footer">
      <p>CXO Academy - Where leaders learn to lead in the age of AI.</p>
      <p>${process.env.NEXT_PUBLIC_APP_URL}</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Password Reset Request

Hi ${userName},

We received a request to reset your password.

Reset your password here: ${resetLink}

This link will expire in 24 hours. If you didn't request a password reset, please ignore this email.

Stay secure!
The CXO Academy Team
    `,
  }),

  // Weekly research update
  weeklyResearchUpdate: (
    userName: string,
    courseTitle: string,
    weekNumber: number,
    summary: string
  ) => ({
    subject: `Week ${weekNumber} Research Update: ${courseTitle}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .summary { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📚 Weekly Research Update</h1>
    </div>
    <div class="content">
      <h2>Hi ${userName},</h2>
      <p>Here's the latest research update for Week ${weekNumber} of <strong>${courseTitle}</strong>:</p>
      <div class="summary">
        ${summary}
      </div>
      <p>Stay curious and keep learning!</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses" class="button">Continue Learning</a>
      </p>
      <p>The CXO Academy Team</p>
    </div>
    <div class="footer">
      <p>CXO Academy - Where leaders learn to lead in the age of AI.</p>
      <p>${process.env.NEXT_PUBLIC_APP_URL}</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Weekly Research Update

Hi ${userName},

Here's the latest research update for Week ${weekNumber} of ${courseTitle}:

${summary}

Continue learning: ${process.env.NEXT_PUBLIC_APP_URL}/courses

Stay curious!
The CXO Academy Team
    `,
  }),
}

// Error class
export class EmailError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'EmailError'
  }
}
