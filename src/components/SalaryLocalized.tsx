'use client';

import { useState, useEffect } from 'react';

const COUNTRIES: Record<string, { flag: string; nameRU: string; nameEN: string; currency: string }> = {
  MD: { flag: '🇲🇩', nameRU: 'Молдова', nameEN: 'Moldova', currency: 'USD' },
  RO: { flag: '🇷🇴', nameRU: 'Румыния', nameEN: 'Romania', currency: 'USD' },
  KZ: { flag: '🇰🇿', nameRU: 'Казахстан', nameEN: 'Kazakhstan', currency: 'USD' },
  RU: { flag: '🇷🇺', nameRU: 'Россия', nameEN: 'Russia', currency: 'USD' },
  UZ: { flag: '🇺🇿', nameRU: 'Узбекистан', nameEN: 'Uzbekistan', currency: 'USD' },
  GE: { flag: '🇬🇪', nameRU: 'Грузия', nameEN: 'Georgia', currency: 'USD' },
  DE: { flag: '🇩🇪', nameRU: 'Германия', nameEN: 'Germany', currency: 'USD' },
  PL: { flag: '🇵🇱', nameRU: 'Польша', nameEN: 'Poland', currency: 'USD' },
};

const SUPPORTED_COUNTRIES = ['MD', 'RO', 'KZ', 'RU', 'UZ', 'GE', 'DE', 'PL'];
const DEFAULT_COUNTRY = 'DE';

interface Props {
  entrySalaryEu: string | null;
  entrySalaryCis: string | null;
  salaryDataRaw: string | null;
  locale?: 'en' | 'ru';
}

export default function SalaryLocalized({
  entrySalaryEu,
  entrySalaryCis,
  salaryDataRaw,
  locale = 'ru',
}: Props) {
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [showPicker, setShowPicker] = useState(false);
  const [parsedData, setParsedData] = useState<Record<string, any> | null>(null);

  const isEn = locale === 'en';

  // Auto-detect country via geolocation
  useEffect(() => {
    const stored = localStorage.getItem('career-path-country');
    if (stored && SUPPORTED_COUNTRIES.includes(stored)) {
      setSelectedCountry(stored);
      return;
    }

    fetch('https://ip-api.com/json/?fields=countryCode')
      .then(r => r.json())
      .then(data => {
        const code = data?.countryCode;
        if (code && SUPPORTED_COUNTRIES.includes(code)) {
          setSelectedCountry(code);
          localStorage.setItem('career-path-country', code);
        } else {
          setSelectedCountry(DEFAULT_COUNTRY);
          localStorage.setItem('career-path-country', DEFAULT_COUNTRY);
        }
      })
      .catch(() => {
        setSelectedCountry(DEFAULT_COUNTRY);
        localStorage.setItem('career-path-country', DEFAULT_COUNTRY);
      });
  }, []);

  useEffect(() => {
    if (salaryDataRaw) {
      try {
        setParsedData(JSON.parse(salaryDataRaw));
      } catch {}
    }
  }, [salaryDataRaw]);

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    localStorage.setItem('career-path-country', code);
    setShowPicker(false);
  };

  const countrySalaries = parsedData?.[selectedCountry];
  const ci = COUNTRIES[selectedCountry];

  // Fallback: show old static data
  if (!countrySalaries && (entrySalaryEu || entrySalaryCis)) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {entrySalaryEu && (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/40">
            <p className="text-slate-400 text-sm mb-1">💶 {isEn ? 'Europe (entry)' : 'Европа (вход)'}</p>
            <p className="text-white font-semibold text-lg">{entrySalaryEu}</p>
          </div>
        )}
        {entrySalaryCis && (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/40">
            <p className="text-slate-400 text-sm mb-1">💵 {isEn ? 'CIS (entry)' : 'СНГ (вход)'}</p>
            <p className="text-white font-semibold text-lg">{entrySalaryCis}</p>
          </div>
        )}
      </div>
    );
  }

  if (!countrySalaries) return null;

  const levelLabels: Record<string, Record<string, string>> = {
    junior: { ru: 'Junior', en: 'Junior' },
    middle: { ru: 'Middle', en: 'Middle' },
    senior: { ru: 'Senior', en: 'Senior' },
  };

  return (
    <div className="space-y-4">
      {/* Country picker */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700/40"
        >
          <span className="text-sm text-white">
            {ci?.flag} {isEn ? ci?.nameEN : ci?.nameRU} — {isEn ? 'monthly salary (USD)' : 'зарплаты в месяц (USD)'}
          </span>
          <span className={`text-slate-500 text-xs transition-transform ${showPicker ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {showPicker && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 p-2 rounded-xl bg-slate-800 border border-slate-700 shadow-xl max-h-60 overflow-y-auto">
            {Object.entries(parsedData || {}).map(([code]) => {
              const c = COUNTRIES[code];
              if (!c) return null;
              return (
                <button
                  key={code}
                  onClick={() => handleCountryChange(code)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    code === selectedCountry ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {c.flag} {isEn ? c.nameEN : c.nameRU}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Salary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['junior', 'middle', 'senior'] as const).map((level) => {
          const lvl = countrySalaries[level];
          if (!lvl) return null;
          return (
            <div key={level} className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/40 text-center">
              <p className="text-slate-400 text-xs mb-1 font-medium">{levelLabels[level][locale]}</p>
              <p className="text-emerald-400 font-bold text-2xl">${lvl.avg?.toLocaleString() || '—'}</p>
              <p className="text-slate-500 text-xs mt-1">${lvl.min?.toLocaleString()} – ${lvl.max?.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Demand & vacancies */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-slate-400">
          📈 {isEn ? 'Demand: ' : 'Спрос: '}<span className="text-slate-300 font-medium">{'⭐'.repeat(Math.min(countrySalaries.demand || 0, 10))}{'☆'.repeat(10 - Math.min(countrySalaries.demand || 0, 10))}</span>
        </span>
        <span className="text-sm text-slate-400">
          💼 {isEn ? 'Vacancies: ' : 'Вакансий: '}<span className="text-slate-300 font-medium">{countrySalaries.vacancies?.toLocaleString() || '—'}</span>
        </span>
      </div>
    </div>
  );
}
