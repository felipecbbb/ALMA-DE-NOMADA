import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { contactFormHtml, contactFormText } from "@/lib/email-templates";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Campos obligatorios incompletos" }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL ?? "almadenomad@gmail.com";

    await sendEmail({
      to: adminEmail,
      subject: `Nuevo mensaje de contacto — ${name}`,
      html: contactFormHtml({ name, email, phone: phone ?? "", message }),
      text: contactFormText({ name, email, phone: phone ?? "", message }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Error sending email:", err);
    return NextResponse.json({ error: "Error al enviar" }, { status: 500 });
  }
}
