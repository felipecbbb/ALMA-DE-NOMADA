function readEnv(name: string) {
  return String(process.env[name] ?? "").trim();
}

export function getPublicImagesBucket() {
  return readEnv("SUPABASE_PUBLIC_BUCKET") || "alma-public";
}

export function getPrivateGuidesBucket() {
  return readEnv("SUPABASE_PRIVATE_BUCKET") || "alma-guides";
}

