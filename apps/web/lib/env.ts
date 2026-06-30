export function requireEnv(name: "NEXT_PUBLIC_CONVEX_URL" | "NEXT_PUBLIC_APP_URL") {
  const vercelAppUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  const value =
    name === "NEXT_PUBLIC_CONVEX_URL"
      ? process.env.NEXT_PUBLIC_CONVEX_URL
      : (process.env.NEXT_PUBLIC_APP_URL ??
        (vercelAppUrl ? `https://${vercelAppUrl.replace(/^https?:\/\//, "")}` : "http://localhost:3000"));

  if (!value) {
    throw new Error(`Missing environment variable \`${name}\`.`);
  }
  return value;
}
