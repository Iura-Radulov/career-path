'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { MINI_APP_WEB_URL } from '@/lib/constants';
import Logo from './Logo';

export default function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, uiLang, setUiLang } = useTranslation();

  const navLinks = [
    { href: '/about', label: t('nav.about') },
    { href: '/professions', label: t('nav.professions') },
    { href: '/pricing', label: t('nav.pricing') },
  ];

  function handleSetLang(lang: 'en' | 'ru') {
    setUiLang(lang);
    setLangOpen(false);
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 pt-[5px] pb-[5px]"
      style={{ background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-xs text-slate-300 hover:text-white hover:bg-white/10 px-2 py-1 rounded-lg transition-colors"
                aria-label="Switch language"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="font-medium">{uiLang === 'en' ? 'EN' : 'RU'}</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-20 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                    <button
                      onClick={() => handleSetLang('en')}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${uiLang === 'en' ? 'text-emerald-600 font-medium bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {t('lang.en')}
                    </button>
                    <button
                      onClick={() => handleSetLang('ru')}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${uiLang === 'ru' ? 'text-emerald-600 font-medium bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {t('lang.ru')}
                    </button>
                  </div>
                </>
              )}
            </div>

            <a
              href={MINI_APP_WEB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 hover:border-emerald-400 transition-all"
            >
              {t('nav.web_app')}
            </a>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white hover:bg-white/10 px-2 py-1 rounded-lg transition-colors"
              aria-label="Switch language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-medium">{uiLang === 'en' ? 'EN' : 'RU'}</span>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white/70 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Language dropdown mobile */}
      {langOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
          <div className="fixed right-4 top-14 z-20 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
            <button
              onClick={() => handleSetLang('en')}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${uiLang === 'en' ? 'text-emerald-600 font-medium bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {t('lang.en')}
            </button>
            <button
              onClick={() => handleSetLang('ru')}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${uiLang === 'ru' ? 'text-emerald-600 font-medium bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {t('lang.ru')}
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-900">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 px-4">
              <a
                href={MINI_APP_WEB_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-4 py-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-sm font-medium"
              >
                {t('nav.web_app')}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
