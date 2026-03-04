import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Campos obligatorios incompletos" }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL ?? "info@almadenomada.com";

    await sendEmail({
      to: adminEmail,
      subject: `Nuevo mensaje de contacto — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#184038;">Nuevo mensaje de contacto</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:16px;">
            <tr><td style="padding:8px 0;font-weight:bold;color:#184038;">Nombre</td><td style="padding:8px 0;">${name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#184038;">Email</td><td style="padding:8px 0;">${email}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#184038;">Teléfono</td><td style="padding:8px 0;">${phone || "—"}</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#FAF6E8;border-radius:8px;">
            <p style="margin:0;font-weight:bold;color:#184038;">Mensaje:</p>
            <p style="margin:8px 0 0;color:#333;">${message.replace(/\n/g, "<br>")}</p>
          </div>
        </div>
      `,
      text: `Nuevo mensaje de contacto\n\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || "—"}\n\nMensaje:\n${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al enviar" }, { status: 500 });
  }
}
