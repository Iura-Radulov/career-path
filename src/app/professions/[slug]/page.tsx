import type { Metadata } from 'next';
import ProfessionPageContent from './ProfessionPageContent';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema';

const slugNames: Record<string, string> = {
  'software-dev': 'Software Developer',
  'doctor': 'Doctor',
  'designer': 'UX/UI Designer',
  'engineer': 'Civil Engineer',
  'marketer': 'Digital Marketer',
  'analyst': 'Data Analyst / Scientist',
  'energy': 'Renewable Energy Tech',
  'creator': 'Content Creator',
};

export async function generateStaticParams() {
  return Object.keys(slugNames).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = slugNames[slug];
  if (!name) {
    return { title: 'Profession Not Found' };
  }
  return {
    title: `${name} — Career Path Simulator`,
    description: `Explore the ${name} career. Take an AI compatibility test, chat with an AI professional, and get a personalized roadmap with salary insights.`,
  };
}

export default async function ProfessionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = slugNames[slug] || slug;
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Professions', url: '/professions' },
        { name, url: `/professions/${slug}` },
      ])} />
      <ProfessionPageContent slug={slug} />
    </>
  );
}
