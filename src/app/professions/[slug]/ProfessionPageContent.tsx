'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LandingNav from '@/components/LandingNav';
import Footer from '@/components/Footer';
import AffiliatePlatforms from '@/components/AffiliatePlatforms';
import SalaryLocalized from '@/components/SalaryLocalized';
import { useTranslation } from '@/lib/i18n';
import { MINI_APP_WEB_URL } from '@/lib/constants';

interface ProfessionData {
  id: number;
  slug: string;
  name_en: string;
  name_ru: string;
  emoji: string;
  category: string;
  description_short: string | null;
  description_long: string | null;
  why_popular: string | null;
  entry_salary_eu: string | null;
  entry_salary_cis: string | null;
  growth_outlook: string | null;
  what_to_study: string | null;
  background_image: string | null;
}

const fallbackProfessions: Record<string, Omit<ProfessionData, 'id' | 'description_long' | 'why_popular' | 'what_to_study'>> = {
  'software-dev': {
    slug: 'software-dev', name_en: 'Software Developer', name_ru: 'Разработчик ПО',
    emoji: '💻', category: 'technology',
    description_short: 'Создавай приложения, сайты и программы, которыми пользуются миллионы.',
    entry_salary_eu: '€40,000 – €95,000', entry_salary_cis: '$12,000 – $50,000',
    growth_outlook: 'Very High (25% by 2030)', background_image: null,
  },
  'doctor': {
    slug: 'doctor', name_en: 'Doctor', name_ru: 'Врач',
    emoji: '🏥', category: 'health',
    description_short: 'Лечи людей и спасай жизни в одной из самых важных профессий.',
    entry_salary_eu: '€55,000 – €120,000', entry_salary_cis: '$15,000 – $60,000',
    growth_outlook: 'High (10% by 2030)', background_image: null,
  },
  'designer': {
    slug: 'designer', name_en: 'UX/UI Designer', name_ru: 'UX/UI Дизайнер',
    emoji: '🎨', category: 'creative',
    description_short: 'Создавай удобные и красивые интерфейсы для цифровых продуктов.',
    entry_salary_eu: '€35,000 – €80,000', entry_salary_cis: '$10,000 – $45,000',
    growth_outlook: 'High (15% by 2030)', background_image: null,
  },
  'engineer': {
    slug: 'engineer', name_en: 'Civil Engineer', name_ru: 'Инженер-строитель',
    emoji: '⚙️', category: 'engineering',
    description_short: 'Проектируй и строй здания, мосты и инфраструктуру будущего.',
    entry_salary_eu: '€45,000 – €85,000', entry_salary_cis: '$12,000 – $40,000',
    growth_outlook: 'Moderate (5% by 2030)', background_image: null,
  },
  'marketer': {
    slug: 'marketer', name_en: 'Digital Marketer', name_ru: 'Digital-маркетер',
    emoji: '📊', category: 'business',
    description_short: 'Продвигай бренды и продукты в цифровом мире.',
    entry_salary_eu: '€30,000 – €70,000', entry_salary_cis: '$8,000 – $35,000',
    growth_outlook: 'High (18% by 2030)', background_image: null,
  },
  'analyst': {
    slug: 'data-scientist', name_en: 'Data Analyst / Scientist', name_ru: 'Аналитик данных',
    emoji: '👨‍💼', category: 'technology',
    description_short: 'Анализируй данные и находи инсайты для бизнеса.',
    entry_salary_eu: '€45,000 – €100,000', entry_salary_cis: '$15,000 – $55,000',
    growth_outlook: 'Very High (28% by 2030)', background_image: null,
  },
  'data-scientist': {
    slug: 'data-scientist', name_en: 'Data Scientist', name_ru: 'Аналитик данных',
    emoji: '👨‍💼', category: 'technology',
    description_short: 'Анализируй данные и находи инсайты для бизнеса.',
    entry_salary_eu: '€45,000 – €100,000', entry_salary_cis: '$15,000 – $55,000',
    growth_outlook: 'Very High (28% by 2030)', background_image: null,
  },
  'energy': {
    slug: 'renewable-energy', name_en: 'Renewable Energy Tech', name_ru: 'Специалист по возобновляемой энергии',
    emoji: '⚡', category: 'engineering',
    description_short: 'Работай над решениями для устойчивого энергетического будущего.',
    entry_salary_eu: '€40,000 – €80,000', entry_salary_cis: '$10,000 – $35,000',
    growth_outlook: 'Very High (35% by 2030)', background_image: null,
  },
  'renewable-energy': {
    slug: 'renewable-energy', name_en: 'Renewable Energy Specialist', name_ru: 'Специалист по возобновляемой энергии',
    emoji: '⚡', category: 'engineering',
    description_short: 'Работай над решениями для устойчивого энергетического будущего.',
    entry_salary_eu: '€40,000 – €80,000', entry_salary_cis: '$10,000 – $35,000',
    growth_outlook: 'Very High (35% by 2030)', background_image: null,
  },
  'creator': {
    slug: 'content-creator', name_en: 'Content Creator', name_ru: 'Криэйтор / Контент-мейкер',
    emoji: '🎬', category: 'business',
    description_short: 'Создавай контент для соцсетей, YouTube, TikTok и других платформ.',
    entry_salary_eu: '€25,000 – €120,000', entry_salary_cis: '$5,000 – $60,000',
    growth_outlook: 'High (20% by 2030)', background_image: null,
  },
  'content-creator': {
    slug: 'content-creator', name_en: 'Content Creator', name_ru: 'Криэйтор / Контент-мейкер',
    emoji: '🎬', category: 'business',
    description_short: 'Создавай контент для соцсетей, YouTube, TikTok и других платформ.',
    entry_salary_eu: '€25,000 – €120,000', entry_salary_cis: '$5,000 – $60,000',
    growth_outlook: 'High (20% by 2030)', background_image: null,
  },
  'ai-ml-engineer': {
    slug: 'ai-ml-engineer', name_en: 'AI/ML Engineer', name_ru: 'AI/ML Инженер',
    emoji: '🤖', category: 'technology',
    description_short: 'Создавай нейросети, обучай модели и строй системы искусственного интеллекта.',
    entry_salary_eu: '€35k-50k/год', entry_salary_cis: '$1000-1500/мес',
    growth_outlook: 'Рост 35%+ в EU к 2028', background_image: null,
  },
  'project-manager': {
    slug: 'project-manager', name_en: 'Project Manager', name_ru: 'Project Manager',
    emoji: '📋', category: 'business',
    description_short: 'Управляй проектами, командами и сроками — делай сложное простым.',
    entry_salary_eu: '€25k-35k/год', entry_salary_cis: '$700-1200/мес',
    growth_outlook: 'Рост 15% в EU к 2027', background_image: null,
  },
  'psychologist': {
    slug: 'psychologist', name_en: 'Psychologist', name_ru: 'Психолог',
    emoji: '🧠', category: 'health',
    description_short: 'Помогай людям разбираться в себе, находить опору и менять жизнь к лучшему.',
    entry_salary_eu: '€20k-30k/год', entry_salary_cis: '$300-600/мес (на старте)',
    growth_outlook: 'Рост 20% в СНГ к 2027', background_image: null,
  },
  'cybersecurity': {
    slug: 'cybersecurity', name_en: 'Cybersecurity Specialist', name_ru: 'Специалист по кибербезопасности',
    emoji: '🛡️', category: 'technology',
    description_short: 'Защищай данные, системы и сети от хакеров и кибератак.',
    entry_salary_eu: '€30k-40k/год', entry_salary_cis: '$800-1500/мес',
    growth_outlook: 'Рост 30%+ в EU к 2028', background_image: null,
  },
  'devops': {
    slug: 'devops', name_en: 'DevOps Engineer', name_ru: 'DevOps Инженер',
    emoji: '⚡', category: 'technology',
    description_short: 'Строй инфраструктуру, автоматизируй процессы и делай релизы быстрыми.',
    entry_salary_eu: '€30k-45k/год', entry_salary_cis: '$1000-1800/мес',
    growth_outlook: 'Рост 25% в EU к 2027', background_image: null,
  },
  'product-manager': {
    slug: 'product-manager', name_en: 'Product Manager', name_ru: 'Product Manager',
    emoji: '📱', category: 'business',
    description_short: 'Создавай продукты от идеи до релиза — исследуй, приоритизируй, запускай.',
    entry_salary_eu: '€30k-45k/год', entry_salary_cis: '$1000-2000/мес',
    growth_outlook: 'Рост 20% в EU к 2027', background_image: null,
  },
  'data-analyst': {
    slug: 'data-analyst', name_en: 'Data Analyst', name_ru: 'Data Analyst',
    emoji: '📊', category: 'technology',
    description_short: 'Превращай сырые данные в понятные решения для бизнеса.',
    entry_salary_eu: '€25k-35k/год', entry_salary_cis: '$600-1200/мес',
    growth_outlook: 'Рост 20% в EU к 2027', background_image: null,
  },
  'smm-specialist': {
    slug: 'smm-specialist', name_en: 'SMM Specialist', name_ru: 'SMM-специалист',
    emoji: '📱', category: 'creative',
    description_short: 'Создавай контент, управляй сообществами и продвигай бренды в соцсетях.',
    entry_salary_eu: '€18k-28k/год', entry_salary_cis: '$400-800/мес',
    growth_outlook: 'Рост 15% в СНГ к 2027', background_image: null,
  },
};

const categoryColors: Record<string, string> = {
  technology: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  health: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  creative: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  engineering: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  business: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

// Map DB slugs to i18n key prefixes
const SLUG_TO_I18N: Record<string, string> = {
  'software-dev': 'dev',
  'doctor': 'doctor',
  'designer': 'designer',
  'engineer': 'engineer',
  'marketer': 'marketer',
  'data-scientist': 'analyst',
  'renewable-energy': 'energy',
  'content-creator': 'creator',
};

interface Props {
  slug: string;
}

export default function ProfessionPageContent({ slug }: Props) {
  const { t, uiLang } = useTranslation();
  const [profession, setProfession] = useState<ProfessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/professions/by-slug/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data: ProfessionData | null) => {
        setProfession(data);
      })
      .catch(() => {
        // Fallback to static data on any error (network or 404)
        const fallback = fallbackProfessions[slug];
        if (fallback) {
          setProfession({ id: 0, ...fallback, description_long: null, why_popular: null, what_to_study: null });
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profession) {
    return (
      <div className="min-h-screen bg-slate-950">
        <LandingNav />
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <p className="text-6xl mb-6">🔍</p>
          <h1 className="text-2xl font-bold text-white mb-4">{t('profession.not_found')}</h1>
          <Link href="/professions" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            {t('profession.back')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { name_en, emoji, category: categoryKey, entry_salary_eu, entry_salary_cis, growth_outlook, background_image, salary_data } = profession;

  return (
    <div className="min-h-screen bg-slate-950">
      <LandingNav />

      {/* Hero with background image */}
      <section className={`relative overflow-hidden ${background_image ? 'flex items-center py-40 pt-44 sm:py-56 sm:pt-60' : 'py-40 pt-44 sm:py-56 sm:pt-60'}`}>
        {background_image && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${background_image}?v=2)` }}
            />

          </>
        )}
        {!background_image && (
          <>
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)' }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16,185,129,0.15) 0%, transparent 60%)',
              }}
            />
          </>
        )}
        <div className="relative z-10 w-full px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/professions"
              className="inline-flex items-center text-slate-400 hover:text-white text-sm mb-6 transition-colors"
            >
              {t('profession.back')}
            </Link>
            <div className="flex items-start gap-6">
              <div className="text-6xl flex-shrink-0">{emoji}</div>
              <div>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mb-3 ${categoryColors[categoryKey] || 'bg-slate-600/20 text-slate-400 border-slate-600/30'}`}>
                  {t(`professions.${categoryKey}`)}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {uiLang === 'en' ? name_en : (profession.name_ru || name_en)}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">

        {/* Description */}
        <section className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-3">{t('profession.description')}</h2>
          <p className="text-slate-300 leading-relaxed">
            {uiLang === 'en'
              ? (
                  SLUG_TO_I18N[slug]
                    ? (t(`professions.${SLUG_TO_I18N[slug]}.desc`) || profession.description_short || profession.description_long || '')
                    : (t(`professions.${slug}.desc`) || profession.description_short || profession.description_long || '')
                )
              : (profession.description_short || profession.description_long || t(`professions.${slug}.desc`))}
          </p>
        </section>

        {/* Salary insights — локализовано */}
        <section className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">{t('profession.salary.title')}</h2>
          <SalaryLocalized
            entrySalaryEu={entry_salary_eu}
            entrySalaryCis={entry_salary_cis}
            salaryDataRaw={salary_data}
            locale={uiLang}
          />
        </section>

        {/* Growth outlook */}
        {growth_outlook && (
          <section className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-3">{t('profession.growth')}</h2>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📈</span>
              <p className="text-emerald-400 font-semibold text-lg">
                {uiLang === 'en'
                  ? (SLUG_TO_I18N[slug]
                      ? (t(`professions.${SLUG_TO_I18N[slug]}.growth`) || growth_outlook)
                      : (t(`professions.${slug}.growth`) || growth_outlook))
                  : growth_outlook}
              </p>
            </div>
          </section>
        )}

        {/* AI Test */}
        <section className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-3">{t('profession.test.title')}</h2>
          <p className="text-slate-300 leading-relaxed mb-5">{t('profession.test.desc')}</p>
          <a
            href={MINI_APP_WEB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-semibold transition-all duration-150 shadow-lg shadow-emerald-500/25"
          >
            {t('profession.start_test')}
            <span>→</span>
          </a>
        </section>

        {/* AI Roleplay */}
        <section className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-3">{t('profession.roleplay.title')}</h2>
          <p className="text-slate-300 leading-relaxed mb-5">{t('profession.roleplay.desc')}</p>
          <a
            href={MINI_APP_WEB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold hover:bg-emerald-500/20 hover:border-emerald-400 transition-all"
          >
            {t('profession.roleplay.title')}
            <span>→</span>
          </a>
        </section>

        {/* Affiliate platforms */}
        {profession && <AffiliatePlatforms locale={uiLang} limit={6} professionCategory={profession.category} />}

      </div>

      <Footer />
    </div>
  );
}
