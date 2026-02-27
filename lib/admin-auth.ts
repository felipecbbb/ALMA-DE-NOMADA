import { NextRequest } from "next/server";

export function isAdminRequest(request: NextRequest) {
  const configured = process.env.ADMIN_PANEL_KEY;
  if (!configured) return false;
  return request.headers.get("x-admin-key") === configured;
}

export function requireAdminRequest(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return new Response(
      JSON.stringify({ error: "No autorizado. Falta clave de administrador." }),
      {
        status: 401,
        headers: { "content-type": "application/json" },
      },
    );
  }

  return null;
}
