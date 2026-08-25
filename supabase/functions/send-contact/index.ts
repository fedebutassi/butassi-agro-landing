import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const CONTACT_EMAIL = Deno.env.get("CONTACT_EMAIL") ?? "butassihnos@gmail.com";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const ALLOWED_ORIGINS = ["https://www.butassihnos.com.ar", "https://butassihnos.com.ar", "http://localhost:5173"];

const getCorsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
});

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get("Origin"));

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json() as {
      nombre: string;
      email: string;
      telefono?: string;
      tipoConsulta?: string;
      mensaje: string;
      company?: string;
    };

    // Honeypot
    if (body.company && body.company.trim().length > 0) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validación básica
    if (!body.nombre?.trim() || !body.email?.trim() || !body.mensaje?.trim()) {
      return new Response(JSON.stringify({ error: "Campos requeridos faltantes" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(JSON.stringify({ error: "Email inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const htmlBody = `
      <h2>Nueva consulta desde butassihnos.com.ar</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;font-weight:bold">Nombre</td><td style="padding:8px">${escapeHtml(body.nombre)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${escapeHtml(body.email)}</td></tr>
        ${body.telefono ? `<tr><td style="padding:8px;font-weight:bold">Teléfono</td><td style="padding:8px">${escapeHtml(body.telefono)}</td></tr>` : ""}
        ${body.tipoConsulta ? `<tr><td style="padding:8px;font-weight:bold">Tipo</td><td style="padding:8px">${escapeHtml(body.tipoConsulta)}</td></tr>` : ""}
        <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Mensaje</td><td style="padding:8px;white-space:pre-wrap">${escapeHtml(body.mensaje)}</td></tr>
      </table>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Butassi Web <noreply@butassihnos.com.ar>",
        to: [CONTACT_EMAIL],
        reply_to: body.email,
        subject: `Consulta web — ${body.nombre}`,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend error: ${err}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Error al enviar el mensaje" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
