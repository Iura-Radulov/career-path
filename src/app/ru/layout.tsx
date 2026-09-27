import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://careerpathsim.com';

export const metadata: Metadata = {
  title: {
    default: 'Career Path Simulator — Найди свою идеальную профессию с ИИ',
    template: '%s | Career Path Simulator',
  },
  description:
    'AI-профориентация для школьников и студентов. Пройди 10-минутный тест, исследуй 8 профессий через AI-ролевые игры, получи персональный план развития. Бесплатно, без регистрации.',
  openGraph: {
    title: 'Career Path Simulator — Найди свою идеальную профессию с ИИ',
    description:
      'AI-профориентация для школьников и студентов. Пройди 10-минутный тест, исследуй 8 профессий через AI-ролевые игры, получи персональный план развития.',
    url: `${siteUrl}/ru`,
    siteName: 'Career Path Simulator',
    type: 'website',
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Path Simulator — Найди свою идеальную профессию с ИИ',
    description:
      'AI-профориентация: 10-минутный тест, 8 профессий, AI-ролевые игры, персональный план развития.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${siteUrl}/ru`,
    languages: {
      en: siteUrl,
      ru: `${siteUrl}/ru`,
    },
  },
};

export default function RuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
