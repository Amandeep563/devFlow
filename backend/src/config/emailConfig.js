import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransporter({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

//Email template

export const emailTemplate = {
  passwordReset: (resetUrl, userName) => ({
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${userName},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p><strong>This link expires in 10 minutes.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          If the button doesn't work, copy this link: ${resetUrl}
        </p>
      </div>
    `,
    text: `
      Hi ${userName},
      
      You requested to reset your password. 
      Click this link to reset it: ${resetUrl}
      
      This link expires in 10 minutes.
      If you didn't request this, please ignore this email.
    `,
  }),
};

//send email function
export const sendEmail = async (to, template) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    const result = await transporter.sendEmail(mailOptions);
    console.log("Email sent sucessfully: ", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.log("Email sending failed: ", error);
    return { success: false, error: error.message };
  }
};
