'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LandingNav from '@/components/LandingNav';
import Footer from '@/components/Footer';
import { useTranslation } from '@/lib/i18n';

interface ArticleSummary {
  slug: string;
  title_en: string;
  title_ru: string;
  excerpt_en: string | null;
  excerpt_ru: string | null;
  image_url: string;
  category: string;
  author: string;
  published_at: string | null;
}

const CATEGORIES = ['general', 'technology', 'health', 'creative', 'engineering', 'business', 'media', 'science', 'education'];

const CATEGORY_EMOJIS: Record<string, string> = {
  technology: '💻',
  health: '🏥',
  creative: '🎨',
  engineering: '⚙️',
  business: '💼',
  media: '📱',
  science: '🔬',
  education: '📚',
  general: '📰',
};

export default function BlogContent() {
  const { t, uiLang } = useTranslation();
  const pathname = usePathname();
  const isRu = pathname.startsWith('/ru');
  const prefix = isRu ? '/ru' : '';

  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    const url = activeCategory ? `/api/blog/articles?category=${activeCategory}` : '/api/blog/articles';
    fetch(url)
      .then((r) => r.json())
      .then((data) => setArticles(Array.isArray(data) ? data : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  function getTitle(a: ArticleSummary) {
    return uiLang === 'ru' ? a.title_ru : a.title_en;
  }

  function getExcerpt(a: ArticleSummary) {
    return uiLang === 'ru' ? (a.excerpt_ru || a.excerpt_en) : (a.excerpt_en || a.excerpt_ru);
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString(uiLang === 'ru' ? 'ru-RU' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <LandingNav />

      {/* Hero */}
      <section
        className="relative px-4 py-40 pt-44 sm:py-48 sm:pt-52 text-center overflow-hidden bg-slate-950"
        style={{
          backgroundImage: 'url(/blog/general.svg?v=2)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(2,6,23,0.65) 0%, rgba(2,6,23,0.2) 50%, rgba(2,6,23,0.6) 100%)',
        }} />
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16,185,129,0.15) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">{t('blog.title')}</h1>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">{t('blog.subtitle')}</p>
        </div>
      </section>

      {/* Category filters */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === ''
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t('blog.all')}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {CATEGORY_EMOJIS[cat]} {t(`blog.category.${cat}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-8 px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              No articles yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`${prefix}/blog/${article.slug}`}
                  className="group bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/40 hover:bg-slate-800 transition-all"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-slate-700 overflow-hidden">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={getTitle(article)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).parentElement!.innerHTML =
                            `<div class="w-full h-full flex items-center justify-center text-5xl">${CATEGORY_EMOJIS[article.category] || '📰'}</div>`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        {CATEGORY_EMOJIS[article.category] || '📰'}
                      </div>
                    )}
                    {/* Category badge */}
                    <span className="absolute top-3 left-3 px-2 py-1 bg-slate-900/80 text-emerald-400 text-xs font-medium rounded-full backdrop-blur">
                      {t(`blog.category.${article.category}`)}
                    </span>
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                      {getTitle(article)}
                    </h2>
                    {getExcerpt(article) && (
                      <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                        {getExcerpt(article)}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-slate-500 text-xs">
                        {article.published_at ? formatDate(article.published_at) : ''}
                      </span>
                      <span className="text-emerald-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        {t('blog.read_more')} →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
