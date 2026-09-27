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
    languages: {
      en: siteUrl,
      ru: `${siteUrl}/ru`,
    },
  },
  other: {
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
        {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=110281596', 'ym');

            ym(110281596, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
          `}
        </Script>
        <noscript>
          <div><img src="https://mc.yandex.ru/watch/110281596" style={{position:'absolute', left:'-9999px'}} alt="" /></div>
        </noscript>
        {/* /Yandex.Metrika counter */}
        {/* Server-side meta for verification bots */}
        <meta name="impact-site-verification" value="686bace0-0db3-44d6-9981-1e35b907199b" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
