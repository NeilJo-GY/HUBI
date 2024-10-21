import type { Metadata } from "next";
import "../app/globals.css";
import { Providers } from '@/app/lib/providers';

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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
