import type { Metadata } from 'next';
import SetRuLang from '@/components/SetRuLang';
import ProfessionPageContent from '@/app/professions/[slug]/ProfessionPageContent';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, breadcrumbSchema } from '@/lib/schema';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://careerpathsim.com';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: 'software-dev' }, { slug: 'doctor' }, { slug: 'designer' },
    { slug: 'engineer' }, { slug: 'marketer' }, { slug: 'data-scientist' },
    { slug: 'renewable-energy' }, { slug: 'content-creator' },
    { slug: 'ai-ml-engineer' }, { slug: 'project-manager' },
    { slug: 'psychologist' }, { slug: 'cybersecurity' },
    { slug: 'devops' }, { slug: 'product-manager' },
    { slug: 'data-analyst' }, { slug: 'smm-specialist' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ruNames: Record<string, string> = {
    'software-dev': 'Разработчик ПО',
    'doctor': 'Врач',
    'designer': 'UX/UI Дизайнер',
    'engineer': 'Инженер-строитель',
    'marketer': 'Digital-маркетолог',
    'data-scientist': 'Аналитик данных',
    'renewable-energy': 'Специалист по ВИЭ',
    'content-creator': 'Контент-криейтор',
    'ai-ml-engineer': 'AI/ML Инженер',
    'project-manager': 'Project Manager',
    'psychologist': 'Психолог',
    'cybersecurity': 'Специалист по кибербезопасности',
    'devops': 'DevOps Инженер',
    'product-manager': 'Product Manager',
    'data-analyst': 'Data Analyst',
    'smm-specialist': 'SMM-специалист',
  };
  const name = ruNames[slug] || slug;
  return {
    title: `${name} — тест совместимости`,
    description: `Узнай, подходит ли тебе профессия ${name}. Пройди AI-тест совместимости, поговори с AI-специалистом и получи персональный план развития с информацией о зарплатах.`,
    alternates: {
      canonical: `${siteUrl}/ru/professions/${slug}`,
      languages: {
        en: `${siteUrl}/professions/${slug}`,
        ru: `${siteUrl}/ru/professions/${slug}`,
      },
    },
  };
}

export default async function RuProfessionPage({ params }: Props) {
  const { slug } = await params;
  const ruNames: Record<string, string> = {
    'software-dev': 'Разработчик ПО',
    'doctor': 'Врач',
    'designer': 'UX/UI Дизайнер',
    'engineer': 'Инженер-строитель',
    'marketer': 'Digital-маркетолог',
    'data-scientist': 'Аналитик данных',
    'renewable-energy': 'Специалист по ВИЭ',
    'content-creator': 'Контент-криейтор',
    'ai-ml-engineer': 'AI/ML Инженер',
    'project-manager': 'Project Manager',
    'psychologist': 'Психолог',
    'cybersecurity': 'Специалист по кибербезопасности',
    'devops': 'DevOps Инженер',
    'product-manager': 'Product Manager',
    'data-analyst': 'Data Analyst',
    'smm-specialist': 'SMM-специалист',
  };
  const name = ruNames[slug] || slug;
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Главная', url: '/ru' },
        { name: 'Профессии', url: '/ru/professions' },
        { name, url: `/ru/professions/${slug}` },
      ])} />
      <SetRuLang>
        <ProfessionPageContent slug={slug} />
      </SetRuLang>
    </>
  );
}
