const siteUrl = (process.env.NEXT_PUBLIC_APP_URL as string) || 'https://careerpathsim.com';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Career Path Simulator',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      'AI-powered career guidance and professional orientation for students and young professionals. Discover your ideal career path with interactive tests, AI roleplay, and personalized roadmaps.',
    sameAs: [
      'https://t.me/CareerPathSimulatorBot',
    ],
    founder: {
      '@type': 'Person',
      name: 'PrepCraft LTD',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
    },
  };
}

export function webApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Career Path Simulator',
    url: siteUrl,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    description:
      'Discover your ideal career path with AI-powered tests and interactive roleplay. Explore 8 professions, get a personalized roadmap, and find your path with confidence.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'AI-powered career compatibility tests',
      'Interactive AI roleplay with professionals',
      'Personalized career roadmaps',
      'Salary insights for EU and CIS markets',
      'Works in Telegram and browser',
    ],
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}
