import { D1Database } from '@cloudflare/workers-types';

export interface Prospect {
  id?: number;
  name: string;
  category_id: number;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id?: number;
  name: string;
  sales_script?: string;
  created_at?: string;
}

export interface Call {
  id?: number;
  prospect_id: number;
  call_date?: string;
  notes?: string;
  outcome?: string;
  follow_up_date?: string;
  follow_up_notes?: string;
  completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Prospect CRUD operations
export async function getProspects(db: D1Database) {
  const { results } = await db
    .prepare('SELECT p.*, c.name as category_name FROM prospects p JOIN categories c ON p.category_id = c.id ORDER BY p.name')
    .all();
  return results;
}

export async function getProspectById(db: D1Database, id: number) {
  const prospect = await db
    .prepare('SELECT p.*, c.name as category_name FROM prospects p JOIN categories c ON p.category_id = c.id WHERE p.id = ?')
    .bind(id)
    .first();
  return prospect;
}

export async function createProspect(db: D1Database, prospect: Prospect) {
  const { name, category_id, location, phone, email, website, notes } = prospect;
  const result = await db
    .prepare(
      'INSERT INTO prospects (name, category_id, location, phone, email, website, notes) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id'
    )
    .bind(name, category_id, location, phone, email, website, notes)
    .first();
  return result;
}

export async function updateProspect(db: D1Database, id: number, prospect: Prospect) {
  const { name, category_id, location, phone, email, website, notes } = prospect;
  await db
    .prepare(
      'UPDATE prospects SET name = ?, category_id = ?, location = ?, phone = ?, email = ?, website = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
    .bind(name, category_id, location, phone, email, website, notes, id)
    .run();
  return getProspectById(db, id);
}

export async function deleteProspect(db: D1Database, id: number) {
  // First delete all calls associated with this prospect
  await db.prepare('DELETE FROM calls WHERE prospect_id = ?').bind(id).run();
  // Then delete the prospect
  const result = await db.prepare('DELETE FROM prospects WHERE id = ?').bind(id).run();
  return result;
}

// Category CRUD operations
export async function getCategories(db: D1Database) {
  const { results } = await db.prepare('SELECT * FROM categories ORDER BY name').all();
  return results;
}

export async function getCategoryById(db: D1Database, id: number) {
  const category = await db.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first();
  return category;
}

// Call CRUD operations
export async function getCalls(db: D1Database) {
  const { results } = await db
    .prepare(
      'SELECT c.*, p.name as prospect_name FROM calls c JOIN prospects p ON c.prospect_id = p.id ORDER BY c.call_date DESC'
    )
    .all();
  return results;
}

export async function getCallsByProspectId(db: D1Database, prospect_id: number) {
  const { results } = await db
    .prepare('SELECT * FROM calls WHERE prospect_id = ? ORDER BY call_date DESC')
    .bind(prospect_id)
    .all();
  return results;
}

export async function getCallById(db: D1Database, id: number) {
  const call = await db.prepare('SELECT * FROM calls WHERE id = ?').bind(id).first();
  return call;
}

export async function createCall(db: D1Database, call: Call) {
  const { prospect_id, notes, outcome, follow_up_date, follow_up_notes } = call;
  const result = await db
    .prepare(
      'INSERT INTO calls (prospect_id, notes, outcome, follow_up_date, follow_up_notes) VALUES (?, ?, ?, ?, ?) RETURNING id'
    )
    .bind(prospect_id, notes, outcome, follow_up_date, follow_up_notes)
    .first();
  return result;
}

export async function updateCall(db: D1Database, id: number, call: Call) {
  const { notes, outcome, follow_up_date, follow_up_notes, completed } = call;
  await db
    .prepare(
      'UPDATE calls SET notes = ?, outcome = ?, follow_up_date = ?, follow_up_notes = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
    .bind(notes, outcome, follow_up_date, follow_up_notes, completed ? 1 : 0, id)
    .run();
  return getCallById(db, id);
}

export async function deleteCall(db: D1Database, id: number) {
  const result = await db.prepare('DELETE FROM calls WHERE id = ?').bind(id).run();
  return result;
}

// Dashboard queries
export async function getUpcomingFollowUps(db: D1Database, limit = 5) {
  const { results } = await db
    .prepare(
      `SELECT c.*, p.name as prospect_name 
       FROM calls c 
       JOIN prospects p ON c.prospect_id = p.id 
       WHERE c.follow_up_date IS NOT NULL 
       AND c.follow_up_date >= date('now') 
       AND c.completed = 0 
       ORDER BY c.follow_up_date ASC 
       LIMIT ?`
    )
    .bind(limit)
    .all();
  return results;
}

export async function getRecentCalls(db: D1Database, limit = 5) {
  const { results } = await db
    .prepare(
      `SELECT c.*, p.name as prospect_name 
       FROM calls c 
       JOIN prospects p ON c.prospect_id = p.id 
       ORDER BY c.call_date DESC 
       LIMIT ?`
    )
    .bind(limit)
    .all();
  return results;
}

export async function getProspectCountByCategory(db: D1Database) {
  const { results } = await db
    .prepare(
      `SELECT c.name as category, COUNT(p.id) as count 
       FROM categories c 
       LEFT JOIN prospects p ON c.id = p.category_id 
       GROUP BY c.id 
       ORDER BY c.name`
    )
    .all();
  return results;
}
