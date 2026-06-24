'use client';

import * as React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const translations: Record<string, Record<string, string>> = {
  en: {
    /* Nav */
    'nav.professions': 'Professions',
    'nav.about': 'About',
    'nav.sign_in': 'Sign In →',
    'nav.dashboard': 'Dashboard →',
    'nav.lang_en': 'EN',
    'nav.lang_ru': 'RU',
    'nav.web_app': 'Web App',

    /* Hero */
    'hero.badge': 'AI career guidance · Interactive tests · Roleplay · 8 professions · EN / RU',
    'hero.title': 'Discover Your Ideal {path}',
    'hero.title_highlight': 'Career Path',
    'hero.subtitle': 'Not sure what career suits you? Take a 10-minute AI-powered test. Explore 8 professions through interactive roleplay, get a personalized roadmap, and find your path with confidence.',
    'hero.cta_start': 'Start Free Test',
    'hero.cta_professions': 'Explore Professions',
    'hero.footnote': 'Free · No registration required · 10 minutes',

    /* Features */
    'features.title': 'Why Career Path Simulator?',
    'features.subtitle': 'Everything you need to discover the career that truly fits you.',
    'features.quiz.title': 'AI-Powered Test',
    'features.quiz.desc': 'Answer 10 questions per profession. Our AI analyzes your compatibility and explains why each profession fits (or doesn\'t fit) your profile.',
    'features.roleplay.title': 'AI Roleplay',
    'features.roleplay.desc': 'Talk to a virtual professional — ask about their day, challenges, and career path. Experience a profession before committing.',
    'features.roadmap.title': 'Personal Roadmap',
    'features.roadmap.desc': 'Get a step-by-step learning plan: what subjects to study, which courses to take, which universities to consider, and how to land your first job.',
    'features.salary.title': 'Salary Insights',
    'features.salary.desc': 'See real salary ranges for EU and CIS markets. Compare earning potential across 8 professions and understand growth outlook.',
    'features.test.title': 'Quick Test (10 min)',
    'features.test.desc': 'No long surveys. Answer 10 focused questions per profession and get instant results with detailed AI explanation.',
    'features.platform.title': 'Works in Telegram & Browser',
    'features.platform.desc': 'Use the Mini App inside Telegram on mobile, or open mini.careerpathsim.com in any browser — same experience, zero install.',

    /* How It Works */
    'how.title': 'How It Works',
    'how.subtitle': 'Discover your ideal career path in three simple steps.',
    'how.step1.title': 'Choose a Profession',
    'how.step1.desc': 'Browse 8 professions across tech, health, engineering, creative, and business fields. See salaries, descriptions, and growth outlook.',
    'how.step2.title': 'Take the Test',
    'how.step2.desc': 'Answer 10 AI-crafted questions per profession. Get a compatibility score with detailed explanation of your strengths and fit.',
    'how.step3.title': 'Chat & Explore',
    'how.step3.desc': 'Talk to an AI professional in an interactive roleplay. Ask real questions about their daily life, challenges, and career path.',

    /* Professions */
    'professions.title': 'Explore 8 Professions',
    'professions.subtitle': 'Each with AI-powered test, interactive roleplay, and personalized roadmap.',
    'professions.cta': 'Learn More →',
    'professions.technology': 'Technology',
    'professions.health': 'Health',
    'professions.engineering': 'Engineering',
    'professions.creative': 'Creative',
    'professions.business': 'Business/Media',
    'professions.media': 'Media',
    'professions.science': 'Science',
    'professions.education': 'Education',
    'professions.dev.name': 'Software Developer',
    'professions.dev.desc': 'Build apps, websites, and systems. High demand, remote-friendly, strong salary growth.',
    'professions.doctor.name': 'Doctor',
    'professions.doctor.desc': 'Diagnose and treat patients. Meaningful work with lifelong learning and strong job security.',
    'professions.designer.name': 'UX/UI Designer',
    'professions.designer.desc': 'Design intuitive digital experiences. Blend creativity with user psychology and business goals.',
    'professions.engineer.name': 'Civil Engineer',
    'professions.engineer.desc': 'Design and build infrastructure — bridges, roads, buildings. Shape the physical world.',
    'professions.marketer.name': 'Digital Marketer',
    'professions.marketer.desc': 'Drive growth through SEO, ads, and content. Data-driven creativity in a fast-moving field.',
    'professions.analyst.name': 'Data Analyst / Scientist',
    'professions.analyst.desc': 'Turn raw data into business insights. Python, SQL, ML — high demand across every industry.',
    'professions.energy.name': 'Renewable Energy Tech',
    'professions.energy.desc': 'Work on solar, wind, and energy systems. Future-proof career in the green economy.',
    'professions.creator.name': 'Content Creator',
    'professions.creator.desc': 'Build audiences on YouTube, TikTok, or podcasts. Turn creativity into a scalable career.',

    /* CTA */
    'cta.title': 'Ready to Find Your Path?',
    'cta.subtitle': 'Take the first step toward a career you\'ll love. Free, no registration required, 10 minutes.',
    'cta.button': 'Start Free Test →',
    'cta.telegram': 'Open in Telegram',

    /* Footer */
    'footer.product': 'Product',
    'footer.home': 'Home',
    'footer.pricing': 'Pricing',
    'footer.platform': 'Platform',
    'footer.web_app': 'Web App',
    'footer.company': 'Company',
    'footer.about': 'About',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.copyright': '© {year} Career Path Simulator. All rights reserved.',

    /* Language */
    'lang.en': '🇬🇧 English',
    'lang.ru': '🇷🇺 Русский',

    /* Nav (additional) */
    'nav.pricing': 'Pricing',

    /* About page */
    'about.title': 'About Career Path Simulator',
    'about.subtitle': 'AI-powered career guidance for students and young professionals',
    'about.mission.title': 'Our Mission',
    'about.mission.desc': 'We believe everyone deserves to find a career they love. Career Path Simulator helps students and young professionals explore professions through AI-powered tests, interactive roleplay, and personalized roadmaps.',
    'about.how.title': 'How It Works',
    'about.how.desc': 'Choose a profession → Take a 10-minute AI compatibility test → Chat with an AI professional → Get a personalized roadmap with salary insights, learning paths, and career growth tips.',
    'about.team.title': 'Built by PrepCraft LTD',
    'about.team.desc': 'Career Path Simulator is developed by PrepCraft LTD, a UK-based company dedicated to building AI-powered educational tools. We combine cutting-edge AI technology with career development expertise to help people make informed career decisions.',
    'about.cta': 'Start Your Free Test',

    /* Professions page */
    'professions.page.title': 'Explore 8 Professions',
    'professions.page.subtitle': 'Each with AI-powered compatibility test, interactive roleplay, and personalized roadmap. Discover which career fits you best.',
    'professions.page.cta': 'Take the Test →',

    /* Individual profession page */
    'profession.not_found': 'Profession not found',
    'profession.back': '← All Professions',
    'profession.test.title': 'AI Compatibility Test',
    'profession.test.desc': 'Answer 10 questions to see how well this profession matches your profile.',
    'profession.roleplay.title': 'AI Roleplay',
    'profession.roleplay.desc': 'Talk to an AI professional and experience the day-to-day life of this career.',
    'profession.salary.title': 'Salary Insights',
    'profession.salary.eu': 'EU Market',
    'profession.salary.cis': 'CIS Market',
    'profession.growth': 'Growth Outlook',
    'profession.description': 'About this Profession',
    'profession.start_test': 'Start Compatibility Test',

    /* Pricing page */
    'pricing.title': 'Choose Your Plan',
    'pricing.subtitle': 'Start free, upgrade when you\'re ready for more.',
    'pricing.free.name': 'Free',
    'pricing.free.price': '$0',
    'pricing.free.perk1': '1 profession test',
    'pricing.free.perk2': 'AI compatibility score',
    'pricing.free.perk3': 'Basic salary insights',
    'pricing.free.perk4': 'AI roleplay (limited)',
    'pricing.free.cta': 'Get Started Free',
    'pricing.premium.name': 'Premium',
    'pricing.premium.price': '$9.99',
    'pricing.premium.perk1': 'All 8 professions',
    'pricing.premium.perk2': 'Full AI explanations',
    'pricing.premium.perk3': 'Detailed salary comparisons',
    'pricing.premium.perk4': 'Unlimited AI roleplay',
    'pricing.premium.perk5': 'Personalized roadmap',
    'pricing.premium.perk6': 'Priority support',
    'pricing.premium.cta': 'Upgrade to Premium',
    'pricing.note': 'All plans include no-registration access. Premium billed monthly.',

    /* Privacy page */
    'privacy.title': 'Privacy Policy',
    'privacy.last_updated': 'Last updated: June 2026',
    'privacy.intro': 'This Privacy Policy explains how PrepCraft LTD ("we", "us", or "our") collects, uses, and protects your personal information when you use Career Path Simulator ("the Service").',
    'privacy.info.title': 'Information We Collect',
    'privacy.info.desc': 'We collect minimal data necessary to provide the Service: Telegram user ID and username (if you sign in via Telegram), quiz responses (anonymized, used only to calculate compatibility scores), and basic usage analytics (page views, feature usage) to improve the Service. We do NOT collect your real name, email, phone number, or location.',
    'privacy.use.title': 'How We Use Your Information',
    'privacy.use.desc': 'To provide and improve the Service, to calculate career compatibility scores, to generate personalized career roadmaps, and to analyze usage patterns. We do NOT sell your data to third parties.',
    'privacy.storage.title': 'Data Storage & Security',
    'privacy.storage.desc': 'Your data is stored securely on our servers in the EU. We implement industry-standard security measures including encryption at rest and in transit. You may request deletion of your data at any time by contacting us.',
    'privacy.contact.title': 'Contact Us',
    'privacy.contact.desc': 'For any questions about this Privacy Policy, please contact: PrepCraft LTD, 5 Brayford Square, London, E1 0SG, United Kingdom, or via our Telegram bot @CareerPathSimulatorBot.',

    /* Terms page */
    'terms.title': 'Terms of Service',
    'terms.last_updated': 'Last updated: June 2026',
    'terms.intro': 'These Terms of Service ("Terms") govern your use of Career Path Simulator ("the Service"), operated by PrepCraft LTD (Company No. 17249290, registered address: 5 Brayford Square, London, E1 0SG, United Kingdom).',
    'terms.accept.title': 'Acceptance of Terms',
    'terms.accept.desc': 'By using the Service, you agree to these Terms. If you do not agree, please do not use the Service.',
    'terms.usage.title': 'Use of Service',
    'terms.usage.desc': 'The Service is intended for personal, non-commercial use. You agree not to misuse the Service, including attempting to access it via automated means or interfering with its operation. Career guidance results are AI-generated suggestions and should not be the sole basis for career decisions.',
    'terms.liability.title': 'Limitation of Liability',
    'terms.liability.desc': 'The Service is provided "as is" without warranties of any kind. PrepCraft LTD shall not be liable for any damages arising from your use of the Service. AI-generated career suggestions are for informational purposes only.',
    'terms.changes.title': 'Changes to Terms',
    'terms.changes.desc': 'We reserve the right to modify these Terms at any time. Changes will be posted on this page. Continued use of the Service after changes constitutes acceptance.',
    'terms.contact.title': 'Contact',
    'terms.contact.desc': 'PrepCraft LTD, 5 Brayford Square, London, E1 0SG, UK. Company No. 17249290.',
  },

  ru: {
    /* Nav */
    'nav.professions': 'Профессии',
    'nav.about': 'О нас',
    'nav.sign_in': 'Войти →',
    'nav.dashboard': 'Панель →',
    'nav.lang_en': 'EN',
    'nav.lang_ru': 'RU',
    'nav.web_app': 'Web App',

    /* Hero */
    'hero.badge': 'AI ориентация · Интерактивные тесты · Ролевые игры · 8 профессий · EN / RU',
    'hero.title': 'Найди свой идеальный {path}',
    'hero.title_highlight': 'Карьерный путь',
    'hero.subtitle': 'Не знаешь, какая карьера тебе подойдёт? Пройди 10-минутный AI-тест. Исследуй 8 профессий через интерактивные ролевые игры, получи персональный план и найди свой путь с уверенностью.',
    'hero.cta_start': 'Начать бесплатный тест',
    'hero.cta_professions': 'Изучить профессии',
    'hero.footnote': 'Бесплатно · Без регистрации · 10 минут',

    /* Features */
    'features.title': 'Почему Career Path Simulator?',
    'features.subtitle': 'Всё необходимое, чтобы найти карьеру, которая действительно подходит тебе.',
    'features.quiz.title': 'AI-тест совместимости',
    'features.quiz.desc': 'Ответь на 10 вопросов для каждой профессии. AI анализирует совместимость и объясняет, почему профессия подходит (или не подходит) твоему профилю.',
    'features.roleplay.title': 'AI ролевая игра',
    'features.roleplay.desc': 'Поговори с виртуальным специалистом — спроси о его рабочем дне, сложностях и карьерном пути. Попробуй профессию до того, как выберешь её.',
    'features.roadmap.title': 'Личный план развития',
    'features.roadmap.desc': 'Получи пошаговый план обучения: какие предметы изучать, какие курсы пройти, в какие вузы поступить и как устроиться на первую работу.',
    'features.salary.title': 'Данные о зарплатах',
    'features.salary.desc': 'Посмотри реальные диапазоны зарплат в странах ЕС и СНГ. Сравни потенциальный доход по 8 профессиям и оцени перспективы роста.',
    'features.test.title': 'Быстрый тест (10 мин)',
    'features.test.desc': 'Никаких длинных анкет. Ответь на 10 сфокусированных вопросов и получи мгновенные результаты с детальным объяснением AI.',
    'features.platform.title': 'Работает в Telegram и браузере',
    'features.platform.desc': 'Используй Mini App в Telegram на мобильном или открой mini.careerpathsim.com в браузере — тот же опыт, без установки.',

    /* How It Works */
    'how.title': 'Как это работает',
    'how.subtitle': 'Открой свой идеальный карьерный путь за три простых шага.',
    'how.step1.title': 'Выбери профессию',
    'how.step1.desc': 'Просмотри 8 профессий в сферах технологий, медицины, инженерии, творчества и бизнеса. Узнай о зарплатах, описаниях и перспективах роста.',
    'how.step2.title': 'Пройди тест',
    'how.step2.desc': 'Ответь на 10 вопросов, составленных AI для каждой профессии. Получи оценку совместимости с детальным объяснением твоих сильных сторон.',
    'how.step3.title': 'Общайся и исследуй',
    'how.step3.desc': 'Поговори с AI-специалистом в интерактивной ролевой игре. Задавай реальные вопросы о ежедневной работе, сложностях и карьерном пути.',

    /* Professions */
    'professions.title': 'Изучи 8 профессий',
    'professions.subtitle': 'Каждая с AI-тестом, интерактивной ролевой игрой и персональным планом.',
    'professions.cta': 'Подробнее →',
    'professions.technology': 'Технологии',
    'professions.health': 'Медицина',
    'professions.engineering': 'Инженерия',
    'professions.creative': 'Творчество',
    'professions.business': 'Бизнес/Медиа',
    'professions.media': 'Медиа',
    'professions.science': 'Наука',
    'professions.education': 'Образование',
    'professions.dev.name': 'Разработчик ПО',
    'professions.dev.desc': 'Создавай приложения, сайты и системы. Высокий спрос, удалённая работа, сильный рост зарплат.',
    'professions.doctor.name': 'Врач',
    'professions.doctor.desc': 'Диагностируй и лечи пациентов. Значимая работа с обучением на протяжении всей жизни и высокой стабильностью.',
    'professions.designer.name': 'UX/UI Дизайнер',
    'professions.designer.desc': 'Проектируй интуитивные цифровые интерфейсы. Сочетай творчество с психологией пользователей и бизнес-целями.',
    'professions.engineer.name': 'Гражданский инженер',
    'professions.engineer.desc': 'Проектируй и строй инфраструктуру — мосты, дороги, здания. Формируй физический мир.',
    'professions.marketer.name': 'Digital-маркетолог',
    'professions.marketer.desc': 'Обеспечивай рост через SEO, рекламу и контент. Аналитическое творчество в быстро меняющейся сфере.',
    'professions.analyst.name': 'Аналитик / Data Scientist',
    'professions.analyst.desc': 'Превращай сырые данные в бизнес-инсайты. Python, SQL, ML — высокий спрос во всех отраслях.',
    'professions.energy.name': 'Специалист по ВИЭ',
    'professions.energy.desc': 'Работай с солнечными, ветряными и энергетическими системами. Перспективная карьера в зелёной экономике.',
    'professions.creator.name': 'Контент-криейтор',
    'professions.creator.desc': 'Строй аудиторию на YouTube, TikTok или подкастах. Превращай творчество в масштабируемую карьеру.',

    /* CTA */
    'cta.title': 'Готов найти свой путь?',
    'cta.subtitle': 'Сделай первый шаг к карьере, которую полюбишь. Бесплатно, без регистрации, 10 минут.',
    'cta.button': 'Начать бесплатный тест →',
    'cta.telegram': 'Открыть в Telegram',

    /* Footer */
    'footer.product': 'Продукт',
    'footer.home': 'Главная',
    'footer.pricing': 'Тарифы',
    'footer.platform': 'Платформа',
    'footer.web_app': 'Web App',
    'footer.company': 'Компания',
    'footer.about': 'О нас',
    'footer.privacy': 'Конфиденциальность',
    'footer.terms': 'Условия использования',
    'footer.copyright': '© {year} Career Path Simulator. Все права защищены.',

    /* Language */
    'lang.en': '🇬🇧 English',
    'lang.ru': '🇷🇺 Русский',

    /* Nav (additional) */
    'nav.pricing': 'Тарифы',

    /* About page */
    'about.title': 'О Career Path Simulator',
    'about.subtitle': 'AI-ориентация для студентов и молодых специалистов',
    'about.mission.title': 'Наша миссия',
    'about.mission.desc': 'Мы верим, что каждый заслуживает найти карьеру, которую полюбит. Career Path Simulator помогает студентам и молодым специалистам исследовать профессии через AI-тесты, ролевые игры и персональные планы развития.',
    'about.how.title': 'Как это работает',
    'about.how.desc': 'Выбери профессию → Пройди 10-минутный AI-тест → Поговори с AI-специалистом → Получи персональный план с зарплатами, обучением и советами по росту.',
    'about.team.title': 'Создано PrepCraft LTD',
    'about.team.desc': 'Career Path Simulator разработан компанией PrepCraft LTD, зарегистрированной в Великобритании. Мы сочетаем передовые AI-технологии с экспертизой в развитии карьеры, чтобы помочь людям принимать осознанные карьерные решения.',
    'about.cta': 'Начать бесплатный тест',

    /* Professions page */
    'professions.page.title': 'Изучи 8 профессий',
    'professions.page.subtitle': 'Каждая с AI-тестом совместимости, ролевой игрой и персональным планом развития. Узнай, какая карьера подходит тебе больше всего.',
    'professions.page.cta': 'Пройти тест →',

    /* Individual profession page */
    'profession.not_found': 'Профессия не найдена',
    'profession.back': '← Все профессии',
    'profession.test.title': 'Тест совместимости AI',
    'profession.test.desc': 'Ответь на 10 вопросов, чтобы узнать, насколько эта профессия подходит твоему профилю.',
    'profession.roleplay.title': 'AI Ролевая игра',
    'profession.roleplay.desc': 'Поговори с AI-специалистом и попробуй повседневную жизнь этой профессии.',
    'profession.salary.title': 'Зарплаты',
    'profession.salary.eu': 'Рынок ЕС',
    'profession.salary.cis': 'Рынок СНГ',
    'profession.growth': 'Перспективы роста',
    'profession.description': 'О профессии',
    'profession.start_test': 'Начать тест',

    /* Pricing page */
    'pricing.title': 'Выбери тариф',
    'pricing.subtitle': 'Начни бесплатно, переходи на расширенный тариф когда будешь готов.',
    'pricing.free.name': 'Бесплатно',
    'pricing.free.price': '0',
    'pricing.free.perk1': 'Тест 1 профессии',
    'pricing.free.perk2': 'Оценка совместимости AI',
    'pricing.free.perk3': 'Базовая информация о зарплатах',
    'pricing.free.perk4': 'AI ролевая игра (ограниченно)',
    'pricing.free.cta': 'Начать бесплатно',
    'pricing.premium.name': 'Премиум',
    'pricing.premium.price': '$9.99',
    'pricing.premium.perk1': 'Все 8 профессий',
    'pricing.premium.perk2': 'Полные AI-объяснения',
    'pricing.premium.perk3': 'Детальные сравнения зарплат',
    'pricing.premium.perk4': 'Неограниченные AI ролевые игры',
    'pricing.premium.perk5': 'Персональный план развития',
    'pricing.premium.perk6': 'Приоритетная поддержка',
    'pricing.premium.cta': 'Перейти на Премиум',
    'pricing.note': 'Все тарифы без регистрации. Премиум оплачивается ежемесячно.',

    /* Privacy page */
    'privacy.title': 'Политика конфиденциальности',
    'privacy.last_updated': 'Последнее обновление: июнь 2026',
    'privacy.intro': 'Настоящая Политика конфиденциальности объясняет, как PrepCraft LTD ("мы", "нас" или "наш") собирает, использует и защищает вашу личную информацию при использовании Career Path Simulator ("Сервис").',
    'privacy.info.title': 'Информация, которую мы собираем',
    'privacy.info.desc': 'Мы собираем минимальные данные, необходимые для предоставления Сервиса: ID и username Telegram (если вы входите через Telegram), ответы на тесты (анонимизированы, используются только для расчёта совместимости) и базовую аналитику использования для улучшения Сервиса. Мы НЕ собираем ваши реальные имя, email, номер телефона или местоположение.',
    'privacy.use.title': 'Как мы используем вашу информацию',
    'privacy.use.desc': 'Для предоставления и улучшения Сервиса, расчёта совместимости, генерации персональных карьерных планов и анализа использования. Мы НЕ продаём ваши данные третьим лицам.',
    'privacy.storage.title': 'Хранение и безопасность данных',
    'privacy.storage.desc': 'Ваши данные хранятся на наших серверах в ЕС. Мы применяем стандартные меры безопасности, включая шифрование при хранении и передаче. Вы можете запросить удаление ваших данных в любое время.',
    'privacy.contact.title': 'Свяжитесь с нами',
    'privacy.contact.desc': 'По вопросам, связанным с Политикой конфиденциальности: PrepCraft LTD, 5 Brayford Square, London, E1 0SG, United Kingdom, или через Telegram-бота @CareerPathSimulatorBot.',

    /* Terms page */
    'terms.title': 'Условия использования',
    'terms.last_updated': 'Последнее обновление: июнь 2026',
    'terms.intro': 'Настоящие Условия использования регулируют ваше использование Career Path Simulator ("Сервис"), управляемого PrepCraft LTD (номер компании 17249290, зарегистрированный адрес: 5 Brayford Square, London, E1 0SG, United Kingdom).',
    'terms.accept.title': 'Принятие условий',
    'terms.accept.desc': 'Используя Сервис, вы соглашаетесь с данными Условиями. Если вы не согласны, пожалуйста, не используйте Сервис.',
    'terms.usage.title': 'Использование Сервиса',
    'terms.usage.desc': 'Сервис предназначен для личного некоммерческого использования. Вы соглашаетесь не использовать Сервис ненадлежащим образом, включая попытки автоматизированного доступа или вмешательства в его работу. Результаты карьерной ориентации — это AI-рекомендации и не должны быть единственным основанием для карьерных решений.',
    'terms.liability.title': 'Ограничение ответственности',
    'terms.liability.desc': 'Сервис предоставляется "как есть" без каких-либо гарантий. PrepCraft LTD не несёт ответственности за любые убытки, возникшие в результате использования Сервиса. AI-рекомендации предоставляются только в информационных целях.',
    'terms.changes.title': 'Изменение условий',
    'terms.changes.desc': 'Мы оставляем за собой право изменять настоящие Условия в любое время. Изменения будут опубликованы на этой странице. Продолжение использования Сервиса после изменений означает принятие условий.',
    'terms.contact.title': 'Контакты',
    'terms.contact.desc': 'PrepCraft LTD, 5 Brayford Square, London, E1 0SG, UK. Компания № 17249290.',
  },
};

export type UILanguage = 'en' | 'ru';

interface I18nContextType {
  uiLang: UILanguage;
  setUiLang: (lang: UILanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  loading: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [uiLang, setUiLangState] = useState<UILanguage>('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ui_lang') as UILanguage | null;
      if (saved === 'en' || saved === 'ru') {
        setUiLangState(saved);
        document.documentElement.setAttribute('lang', saved);
      }
    } catch {
      // localStorage not available
    }
    setLoading(false);
  }, []);

  const setUiLang = useCallback((lang: UILanguage) => {
    setUiLangState(lang);
    document.documentElement.setAttribute('lang', lang);
    try {
      localStorage.setItem('ui_lang', lang);
    } catch {
      // localStorage not available
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = translations[uiLang];
      let template = dict?.[key] ?? key;

      if (!template || template === key) {
        template = translations.en?.[key] ?? key;
      }

      if (!params) return template;

      let result = template;
      for (const [k, v] of Object.entries(params)) {
        result = result.replace(`{${k}}`, String(v));
      }
      return result;
    },
    [uiLang],
  );

  const value: I18nContextType = { uiLang, setUiLang, t, loading };

  return React.createElement(I18nContext.Provider, { value }, children);
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return ctx;
}
