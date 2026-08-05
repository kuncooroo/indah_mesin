import "server-only";
import nodemailer from "nodemailer";

type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export function isMailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

export async function sendMail(input: SendMailInput): Promise<{ sent: boolean; error?: string }> {
  if (!isMailConfigured()) {
    console.info("[mail] SMTP belum dikonfigurasi. Email tidak dikirim:", {
      to: input.to,
      subject: input.subject,
    });
    return { sent: false, error: "SMTP_NOT_CONFIGURED" };
  }

  try {
    const port = Number(process.env.SMTP_PORT ?? 587);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html ?? `<p>${input.text.replace(/\n/g, "<br/>")}</p>`,
    });
    return { sent: true };
  } catch (reason) {
    console.error("[mail] gagal mengirim:", reason);
    return {
      sent: false,
      error: reason instanceof Error ? reason.message : "MAIL_SEND_FAILED",
    };
  }
}
