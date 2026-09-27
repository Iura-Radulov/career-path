'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LandingNav from '@/components/LandingNav';
import Footer from '@/components/Footer';
import { useTranslation } from '@/lib/i18n';

interface ArticleData {
  id: number;
  slug: string;
  title_en: string;
  title_ru: string;
  content_en: string;
  content_ru: string;
  excerpt_en: string | null;
  excerpt_ru: string | null;
  image_url: string;
  category: string;
  author: string;
  published_at: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  technology:  '#3b82f6',
  health:      '#f43f5e',
  creative:    '#a855f7',
  engineering: '#f59e0b',
  business:    '#06b6d4',
  media:       '#d946ef',
  science:     '#14b8a6',
  education:   '#6366f1',
  general:     '#10b981',
};

interface Props {
  slug: string;
}

export default function BlogArticleContent({ slug }: Props) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isRu = pathname.startsWith('/ru');
  const prefix = isRu ? '/ru' : '';
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [related, setRelated] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/articles?slug=${slug}`)
      .then(r => r.json())
      .then((data: ArticleData | null) => {
        setArticle(data);
        if (data?.category) {
          fetch(`/api/blog/articles?category=${data.category}&limit=4`)
            .then(r => r.json())
            .then((arr: ArticleData[]) => {
              setRelated(arr.filter(a => a.slug !== data.slug).slice(0, 3));
            })
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950">
        <LandingNav />
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <p className="text-6xl mb-6">📝</p>
          <h1 className="text-2xl font-bold text-white mb-4">{t('blog.not_found')}</h1>
          <Link href={`${prefix}/blog`} className="text-emerald-400 hover:text-emerald-300 transition-colors">
            {t('blog.back')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const title = isRu ? article.title_ru : article.title_en;
  const content = isRu ? article.content_ru : article.content_en;
  const excerpt = isRu ? (article.excerpt_ru || '') : (article.excerpt_en || '');

  return (
    <div className="min-h-screen bg-slate-950">
      <LandingNav />

      {/* Hero */}
      <section
        className="relative px-4 py-32 pt-44 sm:py-40 sm:pt-56 overflow-hidden bg-slate-950"
        style={article.image_url ? {
          backgroundImage: `url(${article.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `linear-gradient(180deg, rgba(2,6,23,0.65) 0%, rgba(2,6,23,0.2) 50%, rgba(2,6,23,0.6) 100%)`,
        }} />
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${CATEGORY_COLORS[article.category] || '#10b981'}22 0%, transparent 60%)`,
        }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <Link href={`${prefix}/blog`} className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
            <span>←</span> {t('blog.back')}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-900/50 text-emerald-400 border border-emerald-700/40">
              {t(`blog.category.${article.category}`)}
            </span>
            {article.published_at && (
              <span className="text-xs text-slate-500">
                {t('blog.published')}: {new Date(article.published_at).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">{title}</h1>
          {excerpt && (
            <p className="text-lg text-slate-300 leading-relaxed">{excerpt}</p>
          )}
          <div className="flex items-center gap-2 mt-6 text-sm text-slate-500">
            <span>{t('blog.by')} {article.author}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700/30">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="py-16 px-4 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">{isRu ? 'Читайте также' : 'Related Articles'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => {
                const relTitle = isRu ? rel.title_ru : rel.title_en;
                const relExcerpt = isRu ? (rel.excerpt_ru || '') : (rel.excerpt_en || '');
                return (
                  <Link
                    key={rel.id}
                    href={`${prefix}/blog/${rel.slug}`}
                    className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-emerald-600/30 hover:bg-slate-800 transition-all group"
                  >
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-900/40 text-emerald-400 border border-emerald-700/30 mb-2">
                      {t(`blog.category.${rel.category}`)}
                    </span>
                    <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-emerald-300 transition-colors">{relTitle}</h3>
                    {relExcerpt && (
                      <p className="text-slate-400 text-xs line-clamp-2">{relExcerpt}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
