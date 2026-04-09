import nodemailer from 'nodemailer';

/**
 * Creates a Nodemailer transporter.
 * Uses Gmail with App Password from environment variables.
 * Falls back to Ethereal (fake SMTP) in dev mode if no credentials are set.
 */
const createTransporter = async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // ✅ Production: Real Gmail with App Password
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // 🔧 Dev fallback: Ethereal catches emails without sending them
    // Visit https://ethereal.email to view sent emails
    const testAccount = await nodemailer.createTestAccount();
    const transport = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('\n📧 [DEV] Ethereal Email SMTP ready.');
    console.log(`   User: ${testAccount.user}`);
    console.log(`   Pass: ${testAccount.pass}`);
    console.log(`   Preview emails at: https://ethereal.email/messages\n`);
    return transport;
  }
};

/**
 * Sends an email.
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} [options.html] - Optional HTML body
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER
        ? `"EventScout" <${process.env.EMAIL_USER}>`
        : '"EventScout Dev" <dev@eventscout.com>',
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);

    if (!process.env.EMAIL_USER) {
      // In dev mode show the ethereal preview link
      console.log(`📧 [DEV] Email Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } else {
      console.log(`✅ Email sent to ${to} (MessageId: ${info.messageId})`);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ sendEmail error:', error.message);
    return { success: false, error: error.message };
  }
};

export default sendEmail;
