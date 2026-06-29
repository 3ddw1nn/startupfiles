import type { Metadata } from "next";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { siteConfig } from "@startupfiles/shared/site";
import { ConvexProviders } from "../components/convex-providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConvexAuthNextjsServerProvider>
          <ConvexProviders>{children}</ConvexProviders>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
