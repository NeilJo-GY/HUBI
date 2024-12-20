import type { Metadata } from "next";
import "../app/globals.css";
import { Providers } from '@/app/src/lib/providers';

export const metadata: Metadata = {
  title: {
    template: '%s | Mage',
    default: 'Mage, Work and Create Freely',
  },
  description: "UBI Grants Powered by AI",
  keywords: ['UBI', 'Remote', 'Self-organization'],
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <head>
        <script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          async
          defer
        ></script>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
