import { Resend } from "resend";
import { env } from "../config/env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export class MailService {
    static async sendMagicLink(email: string, token: string) {
        const url = `${env.ALLOWED_ORIGINS}/verify?token=${token}`;

        if (!resend) {
            console.log("------------------------------------------");
            console.log(`[MOCK EMAIL] To: ${email}`);
            console.log(`[URL] ${url}`);
            console.log("------------------------------------------");
            return;
        }

        try {
            await resend.emails.send({
                from: "Printeast <onboarding@resend.dev>",
                to: email,
                subject: "Login to Printeast",
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0f172a; margin-bottom: 16px;">Welcome to Printeast</h2>
            <p style="color: #475569; font-size: 16px; line-height: 24px;">
              Click the button below to securely sign in to your Printeast account. This link will expire in 15 minutes.
            </p>
            <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #ff0080 0%, #7928ca 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
              Sign In to Dashboard
            </a>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">
              If you didn't request this email, you can safely ignore it.
            </p>
          </div>
        `,
            });
        } catch (error) {
            console.error("Failed to send email via Resend:", error);
            // Fallback to console in dev
            console.log(`[FALLBACK URL] ${url}`);
        }
    }
}
