import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://careerpathsim.com';
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Career Path Simulator — Discover Your Ideal Career with AI',
    template: '%s | Career Path Simulator',
  },
  description:
    'AI-powered career guidance and professional orientation for students and young professionals. Discover your ideal career path with interactive tests, AI roleplay, and personalized roadmaps. Free, 10 minutes, no registration required.',
  openGraph: {
    title: 'Career Path Simulator — Discover Your Ideal Career with AI',
    description:
      'AI-powered career guidance for students and young professionals. Take a 10-minute test, explore 8 professions through AI roleplay, get a personalized roadmap.',
    url: siteUrl,
    siteName: 'Career Path Simulator',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Path Simulator — Discover Your Ideal Career with AI',
    description:
      'AI-powered career guidance. Take a 10-minute test, explore 8 professions through AI roleplay, get a personalized roadmap.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-950`}>
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
