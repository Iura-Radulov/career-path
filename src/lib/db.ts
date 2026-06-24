import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = '/home/hermes/projects/career-mini-app/data/career.db';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initDb(db);
  }
  return db;
}

function initDb(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_id INTEGER UNIQUE,
      username TEXT,
      first_name TEXT,
      language_code TEXT DEFAULT 'en',
      role TEXT DEFAULT 'user',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS professions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name_en TEXT NOT NULL,
      name_ru TEXT NOT NULL,
      emoji TEXT NOT NULL,
      category TEXT NOT NULL,
      description_short TEXT,
      description_full TEXT,
      entry_salary_eu TEXT,
      entry_salary_cis TEXT,
      growth_outlook TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_career_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      current_role TEXT,
      level TEXT,
      experience TEXT,
      skills TEXT,
      education TEXT,
      interests TEXT,
      salary_expectation TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS career_paths (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_profile_id INTEGER NOT NULL REFERENCES user_career_profiles(id) ON DELETE CASCADE,
      title TEXT,
      match_score REAL,
      ai_rank INTEGER DEFAULT 0,
      salary_ranges TEXT,
      demand TEXT,
      growth TEXT,
      roadmap TEXT,
      skills TEXT,
      resources TEXT,
      milestones TEXT,
      is_saved INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      profession_slug TEXT NOT NULL,
      score REAL,
      ai_explanation TEXT,
      answers TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pricing_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
  price TEXT NOT NULL,
  stars_price TEXT DEFAULT '',
  stripe_price_id TEXT DEFAULT '',
  currency TEXT DEFAULT 'USD',
  interval TEXT DEFAULT 'month',
  features TEXT DEFAULT '[]',
  is_popular INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      plan_id INTEGER NOT NULL REFERENCES pricing_plans(id),
      stripe_subscription_id TEXT,
      status TEXT DEFAULT 'active',
      start_date TEXT DEFAULT (datetime('now')),
      end_date TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      plan_id INTEGER NOT NULL REFERENCES pricing_plans(id),
      amount TEXT NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'completed',
      payment_method TEXT DEFAULT 'stripe',
      payment_id TEXT,
      paid_at TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    INSERT OR IGNORE INTO users (telegram_id, username, first_name)
    VALUES (1315197985, 'iura_radulov', 'Yuri');
  `);

  const existingPlans = db.prepare('SELECT COUNT(*) as c FROM pricing_plans').get() as { c: number };
  if (existingPlans.c === 0) {
    db.prepare(`INSERT INTO pricing_plans (slug, name, price, features, is_popular, sort_order)
      VALUES ('free', 'Free', '$0', '{"en":["1 profession test","AI compatibility score","Basic salary insights","AI roleplay (limited)"],"ru":["Тест 1 профессии","Оценка совместимости AI","Базовая информация о зарплатах","AI ролевая игра (ограниченно)"]}', 0, 0)
    `).run();
    db.prepare(`INSERT INTO pricing_plans (slug, name, price, features, is_popular, sort_order)
      VALUES ('premium', 'Premium', '$9.99', '{"en":["All 8 professions","Full AI explanations","Detailed salary comparisons","Unlimited AI roleplay","Personalized roadmap","Priority support"],"ru":["Все 8 профессий","Полные AI-объяснения","Детальные сравнения зарплат","Неограниченные AI ролевые игры","Персональный план развития","Приоритетная поддержка"]}', 1, 1)
    `).run();
  }

  // Migration: add columns that might not exist in existing DBs
  for (const col of ['role', 'password_hash']) {
    try {
      db.exec(`SELECT ${col} FROM users LIMIT 1`);
    } catch {
      try {
        db.exec(`ALTER TABLE users ADD COLUMN ${col} TEXT DEFAULT NULL;`);
      } catch {
        // ignore
      }
    }
  }

  // Migration: add pricing_plans columns
  for (const col of ['stars_price', 'stripe_price_id']) {
    try {
      db.exec(`SELECT ${col} FROM pricing_plans LIMIT 1`);
    } catch {
      try {
        db.exec(`ALTER TABLE pricing_plans ADD COLUMN ${col} TEXT DEFAULT '';`);
      } catch {
        // ignore
      }
    }
  }

  // Migration: add stripe columns to users
  for (const col of ['stripe_customer_id', 'stripe_subscription_id', 'subscription_status']) {
    try {
      db.exec(`SELECT ${col} FROM users LIMIT 1`);
    } catch {
      try {
        db.exec(`ALTER TABLE users ADD COLUMN ${col} TEXT DEFAULT NULL;`);
      } catch {
        // ignore
      }
    }
  }

  // Migration: add background_image to professions
  try {
    db.exec(`SELECT background_image FROM professions LIMIT 1`);
  } catch {
    try {
      db.exec(`ALTER TABLE professions ADD COLUMN background_image TEXT DEFAULT '';`);
    } catch {
      // ignore
    }
  }

  // Ensure admin user exists
  try {
    db.prepare("INSERT OR IGNORE INTO users (telegram_id, username, first_name, role) VALUES (1315197985, 'iura_radulov', 'Yuri', 'admin')").run();
  } catch {
    // table or column issue, ignore
  }
}

export interface User {
  id: number;
  telegram_id: number | null;
  username: string | null;
  first_name: string | null;
  language_code: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Profession {
  id: number;
  slug: string;
  name_en: string;
  name_ru: string;
  emoji: string;
  category: string;
  description_short: string | null;
  description_full: string | null;
  background_image: string;
  entry_salary_eu: string | null;
  entry_salary_cis: string | null;
  growth_outlook: string | null;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface UserCareerProfile {
  id: number;
  user_id: number;
  current_role: string | null;
  level: string | null;
  experience: string | null;
  skills: string | null;
  education: string | null;
  interests: string | null;
  salary_expectation: string | null;
  created_at: string;
}

export interface CareerPath {
  id: number;
  user_profile_id: number;
  title: string | null;
  match_score: number | null;
  ai_rank: number;
  salary_ranges: string | null;
  demand: string | null;
  growth: string | null;
  roadmap: string | null;
  skills: string | null;
  resources: string | null;
  milestones: string | null;
  is_saved: number;
  created_at: string;
}

export interface QuizResult {
  id: number;
  user_id: number | null;
  profession_slug: string;
  score: number | null;
  ai_explanation: string | null;
  answers: string | null;
  created_at: string;
}

export function getUserByTelegramId(telegramId: number): User | null {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramId) as User | null;
}

export function getUserByUsername(username: string): User | null {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | null;
}

export function updatePasswordHash(userId: number, passwordHash: string): void {
  const db = getDb();
  db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?').run(passwordHash, userId);
}

export function createUser(
  telegramId: number,
  username: string | null,
  firstName: string | null,
  lang: string
): User {
  const db = getDb();
  const result = db
    .prepare(
      "INSERT INTO users (telegram_id, username, first_name, language_code, role) VALUES (?, ?, ?, ?, 'user') RETURNING *"
    )
    .get(telegramId, username, firstName, lang) as User;
  return result;
}

export function getAllUsers(): User[] {
  const db = getDb();
  return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as User[];
}

export function getUserById(id: number): User | null {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | null;
}

export function deleteUser(id: number): void {
  const db = getDb();
  // Delete related records in FK-safe order (children first, then parents)
  // 1. career_path_chats references career_paths
  db.prepare('DELETE FROM career_path_chats WHERE path_id IN (SELECT id FROM career_paths WHERE user_profile_id IN (SELECT id FROM user_career_profiles WHERE user_id = ?))').run(id);
  // 2. career_paths references user_career_profiles
  db.prepare('DELETE FROM career_paths WHERE user_profile_id IN (SELECT id FROM user_career_profiles WHERE user_id = ?)').run(id);
  // 3. user_career_profiles references users
  db.prepare('DELETE FROM user_career_profiles WHERE user_id = ?').run(id);
  // 4. quiz_results may reference users
  db.prepare('DELETE FROM quiz_results WHERE user_id = ?').run(id);
  // 5. profession_roleplay_chats references users
  db.prepare('DELETE FROM profession_roleplay_chats WHERE user_id = ?').run(id);
  // 6. auth_tokens references telegram_id
  const user = db.prepare('SELECT telegram_id FROM users WHERE id = ?').get(id) as { telegram_id: number } | undefined;
  if (user) {
    db.prepare('DELETE FROM auth_tokens WHERE telegram_id = ?').run(user.telegram_id);
  }
  // 7. Finally delete the user
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
}

export interface UserStats {
  totalUsers: number;
  newUsersThisWeek: number;
}

export function getUserStats(): UserStats {
  const db = getDb();
  const totalUsers = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  const newUsersThisWeek = (
    db
      .prepare(
        "SELECT COUNT(*) as count FROM users WHERE created_at >= datetime('now', '-7 days')"
      )
      .get() as { count: number }
  ).count;
  return { totalUsers, newUsersThisWeek };
}

export function getAllProfessions(): Profession[] {
  const db = getDb();
  return db.prepare("SELECT id, slug, name_en, name_ru, emoji, category, description_short, description_long as description_full, background_image, entry_salary_eu, entry_salary_cis, growth_outlook, sort_order, CASE WHEN is_active = 1 THEN 1 ELSE 0 END as is_active, created_at, created_at as updated_at FROM professions ORDER BY sort_order ASC, id ASC").all() as Profession[];
}

export function getProfessionById(id: number): Profession | null {
  const db = getDb();
  return db.prepare("SELECT id, slug, name_en, name_ru, emoji, category, description_short, description_long as description_full, background_image, entry_salary_eu, entry_salary_cis, growth_outlook, sort_order, CASE WHEN is_active = 1 THEN 1 ELSE 0 END as is_active, created_at, created_at as updated_at FROM professions WHERE id = ?").get(id) as Profession | null;
}

export function getProfessionBySlug(slug: string): Profession | null {
  const db = getDb();
  return db.prepare("SELECT id, slug, name_en, name_ru, emoji, category, description_short, description_long as description_full, background_image, entry_salary_eu, entry_salary_cis, growth_outlook, sort_order, CASE WHEN is_active = 1 THEN 1 ELSE 0 END as is_active, created_at, created_at as updated_at FROM professions WHERE slug = ?").get(slug) as Profession | null;
}

export type ProfessionData = Omit<Profession, 'id' | 'created_at' | 'updated_at'>;

export function createProfession(data: ProfessionData): Profession {
  const db = getDb();
  return db
    .prepare(
      `INSERT INTO professions (slug, name_en, name_ru, emoji, category, description_short, description_long,
       entry_salary_eu, entry_salary_cis, growth_outlook, sort_order, is_active, background_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
    )
    .get(
      data.slug,
      data.name_en,
      data.name_ru,
      data.emoji,
      data.category,
      data.description_short,
      data.description_full,
      data.entry_salary_eu,
      data.entry_salary_cis,
      data.growth_outlook,
      data.sort_order,
      data.is_active,
      data.background_image
    ) as Profession;
}

export function updateProfession(id: number, data: Partial<ProfessionData>): Profession | null {
  const db = getDb();
  // Map description_full to description_long for Mini App schema
  const dbData: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    const dbKey = k === 'description_full' ? 'description_long' : k;
    dbData[dbKey] = v;
  }
  const fields = Object.keys(dbData)
    .map((k) => `${k} = ?`)
    .join(', ');
  const values = Object.values(dbData);
  return db
    .prepare(
      `UPDATE professions SET ${fields} WHERE id = ? RETURNING *`
    )
    .get(...values, id) as Profession | null;
}

export function deleteProfession(id: number): void {
  const db = getDb();
  db.prepare('DELETE FROM professions WHERE id = ?').run(id);
}

export interface QuizStats {
  totalQuizzes: number;
  avgQuizScore: number;
}

export function getQuizStats(): QuizStats {
  const db = getDb();
  const row = db
    .prepare("SELECT COUNT(*) as total, AVG(match_percent) as avg_score FROM quiz_results")
    .get() as { total: number; avg_score: number | null };
  return {
    totalQuizzes: row.total,
    avgQuizScore: row.avg_score ? Math.round(row.avg_score * 10) / 10 : 0,
  };
}

export interface RecentAnalysis {
  id: number;
  user_id: number;
  current_role: string | null;
  level: string | null;
  created_at: string;
  username: string | null;
  first_name: string | null;
  career_paths_count: number;
}

export function getRecentAnalyses(limit = 10): RecentAnalysis[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT ucp.id, ucp.user_id, ucp.current_role, ucp.current_level as level, ucp.created_at,
              u.username, u.first_name,
              (SELECT COUNT(*) FROM career_paths cp WHERE cp.user_profile_id = ucp.id) as career_paths_count
       FROM user_career_profiles ucp
       LEFT JOIN users u ON u.id = ucp.user_id
       ORDER BY ucp.created_at DESC
       LIMIT ?`
    )
    .all(limit) as RecentAnalysis[];
}

export function getRecentAnalysesPaginated(limit: number, offset: number, userId?: number): RecentAnalysis[] {
  const db = getDb();
  const base = `SELECT ucp.id, ucp.user_id, ucp.current_role, ucp.current_level as level, ucp.created_at,
         u.username, u.first_name,
         (SELECT COUNT(*) FROM career_paths cp WHERE cp.user_profile_id = ucp.id) as career_paths_count
  FROM user_career_profiles ucp
  LEFT JOIN users u ON u.id = ucp.user_id`;
  if (userId !== undefined) {
    return db.prepare(`${base} WHERE ucp.user_id = ? ORDER BY ucp.created_at DESC LIMIT ? OFFSET ?`)
      .all(userId, limit, offset) as RecentAnalysis[];
  }
  return db.prepare(`${base} ORDER BY ucp.created_at DESC LIMIT ? OFFSET ?`)
    .all(limit, offset) as RecentAnalysis[];
}

export function getAnalysesCount(userId?: number): number {
  const db = getDb();
  if (userId !== undefined) {
    return (db.prepare('SELECT COUNT(*) as count FROM user_career_profiles WHERE user_id = ?').get(userId) as { count: number }).count;
  }
  return (db.prepare('SELECT COUNT(*) as count FROM user_career_profiles').get() as { count: number }).count;
}

export interface QuizResultRow {
  id: number;
  user_id: number;
  username: string | null;
  first_name: string | null;
  profession_name: string | null;
  profession_slug: string | null;
  match_percent: number;
  details: string | null;
  created_at: string;
}

export function getAllQuizResults(limit: number, offset: number, userId?: number): QuizResultRow[] {
  const db = getDb();
  const base = `SELECT qr.id, qr.user_id, u.username, u.first_name,
         p.name_ru as profession_name, p.slug as profession_slug,
         qr.match_percent, qr.details, qr.created_at
  FROM quiz_results qr
  LEFT JOIN professions p ON p.id = qr.profession_id
  LEFT JOIN users u ON u.id = qr.user_id`;
  if (userId !== undefined) {
    return db.prepare(`${base} WHERE qr.user_id = ? ORDER BY qr.created_at DESC LIMIT ? OFFSET ?`)
      .all(userId, limit, offset) as QuizResultRow[];
  }
  return db.prepare(`${base} ORDER BY qr.created_at DESC LIMIT ? OFFSET ?`)
    .all(limit, offset) as QuizResultRow[];
}

export function getQuizResultsCount(userId?: number): number {
  const db = getDb();
  if (userId !== undefined) {
    return (db.prepare('SELECT COUNT(*) as count FROM quiz_results WHERE user_id = ?').get(userId) as { count: number }).count;
  }
  return (db.prepare('SELECT COUNT(*) as count FROM quiz_results').get() as { count: number }).count;
}

export function getUserAnalyses(userId: number): UserCareerProfile[] {
  const db = getDb();
  return db
    .prepare("SELECT id, user_id, current_role, current_level as level, years_experience as experience, tech_stack as skills, education, preferred_industries as interests, salary_expectation, created_at FROM user_career_profiles WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as UserCareerProfile[];
}

export function getUserQuizResults(userId: number): QuizResult[] {
  const db = getDb();
  return db
    .prepare("SELECT qr.id, qr.user_id, p.slug as profession_slug, qr.match_percent as score, qr.details as ai_explanation, qr.created_at FROM quiz_results qr LEFT JOIN professions p ON p.id = qr.profession_id WHERE qr.user_id = ? ORDER BY qr.created_at DESC")
    .all(userId) as QuizResult[];
}

export function getTotalAnalyses(): number {
  const db = getDb();
  return (db.prepare('SELECT COUNT(*) as count FROM user_career_profiles').get() as { count: number }).count;
}

export interface PricingPlan {
  id: number;
  slug: string;
  name: string;
  price: string;
  stars_price: string;
  stripe_price_id: string;
  currency: string;
  interval: string;
  features: string;
  is_popular: number;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export type PricingPlanData = Omit<PricingPlan, 'id' | 'created_at' | 'updated_at'>;

export function getAllPricingPlans(): PricingPlan[] {
  const db = getDb();
  return db.prepare('SELECT * FROM pricing_plans ORDER BY sort_order ASC, id ASC').all() as PricingPlan[];
}

export function getPricingPlanById(id: number): PricingPlan | null {
  const db = getDb();
  return db.prepare('SELECT * FROM pricing_plans WHERE id = ?').get(id) as PricingPlan | null;
}

export function getActivePricingPlans(): PricingPlan[] {
  const db = getDb();
  return db.prepare('SELECT * FROM pricing_plans WHERE is_active = 1 ORDER BY sort_order ASC').all() as PricingPlan[];
}

export function createPricingPlan(data: PricingPlanData): PricingPlan {
  const db = getDb();
  return db
    .prepare(
      `INSERT INTO pricing_plans (slug, name, price, stars_price, stripe_price_id, currency, interval, features, is_popular, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
    )
    .get(
      data.slug,
      data.name,
      data.price,
      data.stars_price || '',
      data.stripe_price_id || '',
      data.currency,
      data.interval,
      data.features,
      data.is_popular,
      data.sort_order,
      data.is_active
    ) as PricingPlan;
}

export function updatePricingPlan(id: number, data: Partial<PricingPlanData>): PricingPlan | null {
  const db = getDb();
  const fields = Object.keys(data)
    .map((k) => `${k} = ?`)
    .join(', ');
  const values = Object.values(data);
  return db
    .prepare(`UPDATE pricing_plans SET ${fields}, updated_at = datetime('now') WHERE id = ? RETURNING *`)
    .get(...values, id) as PricingPlan | null;
}

export function deletePricingPlan(id: number): void {
  const db = getDb();
  db.prepare('DELETE FROM pricing_plans WHERE id = ?').run(id);
}

export function getDbInfo(): { size: number; tables: string[] } {
  const db = getDb();
  const tables = (
    db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      .all() as { name: string }[]
  ).map((r) => r.name);

  const fs = require('fs');
  let size = 0;
  try {
    size = fs.statSync(DB_PATH).size;
  } catch {
    size = 0;
  }

  return { size, tables };
}

// --- Subscription & Payment types ---

export interface SubscriptionRow {
  id: number;
  user_id: number;
  plan_id: number;
  stripe_subscription_id: string | null;
  status: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionWithUser {
  id: number;
  user_id: number;
  username: string | null;
  first_name: string | null;
  plan_id: number;
  plan_name: string;
  plan_slug: string;
  plan_price: string;
  stripe_subscription_id: string | null;
  status: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export interface PaymentWithUser {
  id: number;
  user_id: number;
  username: string | null;
  first_name: string | null;
  plan_id: number;
  plan_name: string;
  plan_slug: string;
  amount: string;
  currency: string;
  status: string;
  payment_method: string;
  payment_id: string | null;
  paid_at: string;
  created_at: string;
}

export interface UserSubscriptionInfo {
  plan: { id: number; name: string; slug: string; price: string } | null;
  status: string | null;
  start_date: string | null;
  end_date: string | null;
  auto_renew: number;
}

// --- Migration: add subscription columns to users ---

export function migrateUserSubscriptionColumns(): void {
  const db = getDb();
  for (const col of ['subscription_plan_id', 'subscription_start_date', 'subscription_end_date', 'subscription_auto_renew']) {
    try {
      db.exec(`SELECT ${col} FROM users LIMIT 1`);
    } catch {
      try {
        if (col === 'subscription_auto_renew') {
          db.exec(`ALTER TABLE users ADD COLUMN ${col} INTEGER DEFAULT 1;`);
        } else if (col === 'subscription_plan_id') {
          db.exec(`ALTER TABLE users ADD COLUMN ${col} INTEGER REFERENCES pricing_plans(id);`);
        } else {
          db.exec(`ALTER TABLE users ADD COLUMN ${col} TEXT;`);
        }
      } catch {
        // ignore
      }
    }
  }
}

// Run migration on init
try {
  const db_local = getDb();
  migrateUserSubscriptionColumns();
} catch {}

// --- Subscription DB functions ---

export function getAllSubscriptions(limit: number, offset: number, statusFilter?: string): SubscriptionWithUser[] {
  const db = getDb();
  let query = `
    SELECT s.id, s.user_id, u.username, u.first_name,
           s.plan_id, p.name as plan_name, p.slug as plan_slug, p.price as plan_price,
           s.stripe_subscription_id, s.status, s.start_date, s.end_date, s.created_at
    FROM subscriptions s
    LEFT JOIN users u ON u.id = s.user_id
    LEFT JOIN pricing_plans p ON p.id = s.plan_id
  `;
  if (statusFilter) {
    query += ` WHERE s.status = ?`;
    return db.prepare(`${query} ORDER BY s.created_at DESC LIMIT ? OFFSET ?`).all(statusFilter, limit, offset) as SubscriptionWithUser[];
  }
  return db.prepare(`${query} ORDER BY s.created_at DESC LIMIT ? OFFSET ?`).all(limit, offset) as SubscriptionWithUser[];
}

export function getSubscriptionsCount(statusFilter?: string): number {
  const db = getDb();
  if (statusFilter) {
    return (db.prepare('SELECT COUNT(*) as count FROM subscriptions WHERE status = ?').get(statusFilter) as { count: number }).count;
  }
  return (db.prepare('SELECT COUNT(*) as count FROM subscriptions').get() as { count: number }).count;
}

export function getUserSubscriptionInfo(userId: number): UserSubscriptionInfo | null {
  const db = getDb();
  const user = db.prepare(
    `SELECT u.subscription_plan_id, u.subscription_status as status,
            u.subscription_start_date as start_date, u.subscription_end_date as end_date,
            u.subscription_auto_renew
     FROM users u WHERE u.id = ?`
  ).get(userId) as { subscription_plan_id: number | null; status: string | null; start_date: string | null; end_date: string | null; subscription_auto_renew: number } | undefined;
  if (!user || !user.subscription_plan_id) return null;

  const plan = db.prepare('SELECT id, name, slug, price FROM pricing_plans WHERE id = ?').get(user.subscription_plan_id) as { id: number; name: string; slug: string; price: string } | undefined;
  if (!plan) return null;

  return {
    plan: { id: plan.id, name: plan.name, slug: plan.slug, price: plan.price },
    status: user.status,
    start_date: user.start_date,
    end_date: user.end_date,
    auto_renew: user.subscription_auto_renew,
  };
}

export function updateUserSubscriptionPlan(userId: number, planId: number | null, endDate?: string): void {
  const db = getDb();
  if (planId === null) {
    db.prepare(`
      UPDATE users SET subscription_plan_id = NULL, subscription_status = NULL,
        subscription_start_date = NULL, subscription_end_date = NULL,
        subscription_auto_renew = 0, updated_at = datetime('now')
      WHERE id = ?
    `).run(userId);
  } else if (endDate) {
    db.prepare(`
      UPDATE users SET subscription_plan_id = ?, subscription_status = 'active',
        subscription_start_date = datetime('now'), subscription_end_date = ?,
        subscription_auto_renew = 1, updated_at = datetime('now')
      WHERE id = ?
    `).run(planId, endDate, userId);
  } else {
    db.prepare(`
      UPDATE users SET subscription_plan_id = ?, subscription_status = 'active',
        subscription_start_date = datetime('now'),
        subscription_auto_renew = 1, updated_at = datetime('now')
      WHERE id = ?
    `).run(planId, userId);
  }
}

export function cancelUserSubscription(userId: number): void {
  const db = getDb();
  db.prepare(`UPDATE users SET subscription_auto_renew = 0, updated_at = datetime('now') WHERE id = ?`).run(userId);
  db.prepare(`UPDATE subscriptions SET status = 'cancelled' WHERE user_id = ? AND status = 'active'`).run(userId);
}

export function cancelSubscriptionById(subscriptionId: number): void {
  const db = getDb();
  const sub = db.prepare('SELECT user_id FROM subscriptions WHERE id = ?').get(subscriptionId) as { user_id: number } | undefined;
  if (!sub) return;
  db.prepare(`UPDATE subscriptions SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?`).run(subscriptionId);
  db.prepare(`UPDATE users SET subscription_auto_renew = 0, updated_at = datetime('now') WHERE id = ?`).run(sub.user_id);
}

// --- Payment DB functions ---

export function getAllPayments(limit: number, offset: number): PaymentWithUser[] {
  const db = getDb();
  return db.prepare(`
    SELECT pm.id, pm.user_id, u.username, u.first_name,
           pm.plan_id, p.name as plan_name, p.slug as plan_slug,
           pm.amount, pm.currency, pm.status, pm.payment_method, pm.payment_id,
           pm.paid_at, pm.created_at
    FROM payments pm
    LEFT JOIN users u ON u.id = pm.user_id
    LEFT JOIN pricing_plans p ON p.id = pm.plan_id
    ORDER BY pm.created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset) as PaymentWithUser[];
}

export function getPaymentsCount(): number {
  const db = getDb();
  return (db.prepare('SELECT COUNT(*) as count FROM payments').get() as { count: number }).count;
}

export function getSubscriptionsStats(): { activeCount: number; totalRevenue: string } {
  const db = getDb();
  const activeCount = (db.prepare("SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'").get() as { count: number }).count;
  const totalRevenue = (db.prepare("SELECT COALESCE(SUM(CAST(amount AS REAL)), 0) as total FROM payments WHERE status = 'completed'").get() as { total: number }).total;
  return { activeCount, totalRevenue: totalRevenue.toFixed(2) };
}
