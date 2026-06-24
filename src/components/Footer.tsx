'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { MINI_APP_URL, MINI_APP_WEB_URL } from '@/lib/constants';
import Logo from './Logo';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              AI-powered career guidance for students and young professionals. Find your ideal career path with interactive tests and AI roleplay.
            </p>
            <a
              href={MINI_APP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-emerald-400 text-sm hover:text-emerald-300 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.012 9.483c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.11 14.4l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.706.186z" />
              </svg>
              Telegram
            </a>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('footer.product')}</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">{t('footer.home')}</Link></li>
              <li><Link href="/professions" className="text-slate-400 hover:text-white text-sm transition-colors">{t('nav.professions')}</Link></li>
              <li>
                <a href={MINI_APP_WEB_URL} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white text-sm transition-colors">
                  {t('footer.web_app')}
                </a>
              </li>
              <li><Link href="/pricing" className="text-slate-400 hover:text-white text-sm transition-colors">{t('footer.pricing')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('footer.company')}</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-slate-400 hover:text-white text-sm transition-colors">{t('footer.about')}</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">{t('footer.terms')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center">
          <p className="text-slate-500 text-sm">
            {t('footer.copyright', { year: String(year) })}
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Operated by PrepCraft LTD (Company No. 17249290) · 5 Brayford Square, London, E1 0SG, UK
          </p>
        </div>
      </div>
    </footer>
  );
}
