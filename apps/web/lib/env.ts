export function requireEnv(name: "NEXT_PUBLIC_CONVEX_URL" | "NEXT_PUBLIC_APP_URL") {
  const value =
    process.env[name] ??
    (name === "NEXT_PUBLIC_CONVEX_URL" ? process.env.CONVEX_URL : undefined) ??
    (name === "NEXT_PUBLIC_CONVEX_URL" ? "http://127.0.0.1:3210" : undefined) ??
    (name === "NEXT_PUBLIC_APP_URL" ? "http://localhost:3000" : undefined);
  if (!value) {
    throw new Error(`Missing environment variable \`${name}\`.`);
  }
  return value;
}
