import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Créer le dossier database s'il n'existe pas
const dbDir = join(__dirname, '../database');
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const dbPath = join(dbDir, 'wc-reservation.db');
const db = new Database(dbPath);

// Activer les clés étrangères
db.pragma('foreign_keys = ON');

/**
 * Initialisation de la base de données
 * Crée les tables si elles n'existent pas
 */
export function initDatabase() {
  // Table des utilisateurs
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pseudo TEXT UNIQUE NOT NULL,
      avatar TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table de l'historique des réservations
  db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      started_at DATETIME NOT NULL,
      ended_at DATETIME,
      duration_minutes INTEGER,
      auto_released BOOLEAN DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Table pour le statut actuel du WC (une seule ligne)
  db.exec(`
    CREATE TABLE IF NOT EXISTS wc_status (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      is_occupied BOOLEAN DEFAULT 0,
      current_user_id INTEGER,
      occupied_since DATETIME,
      fun_message TEXT,
      FOREIGN KEY (current_user_id) REFERENCES users (id)
    )
  `);

  // Initialiser le statut du WC si vide
  const statusExists = db.prepare('SELECT COUNT(*) as count FROM wc_status').get();
  if (statusExists.count === 0) {
    db.prepare(`
      INSERT INTO wc_status (id, is_occupied, current_user_id, occupied_since, fun_message)
      VALUES (1, 0, NULL, NULL, NULL)
    `).run();
  }

  console.log('✅ Base de données initialisée');
}

/**
 * CRUD Utilisateurs
 */

// Créer un utilisateur
export function createUser(pseudo, avatar) {
  try {
    const stmt = db.prepare('INSERT INTO users (pseudo, avatar) VALUES (?, ?)');
    const result = stmt.run(pseudo, avatar);
    return { id: result.lastInsertRowid, pseudo, avatar };
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Ce pseudo existe déjà');
    }
    throw error;
  }
}

// Récupérer un utilisateur par ID
export function getUserById(userId) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
}

// Récupérer un utilisateur par pseudo
export function getUserByPseudo(pseudo) {
  return db.prepare('SELECT * FROM users WHERE pseudo = ?').get(pseudo);
}

// Récupérer tous les utilisateurs
export function getAllUsers() {
  return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
}

/**
 * Gestion du statut du WC
 */

// Récupérer le statut actuel du WC
export function getWCStatus() {
  const status = db.prepare(`
    SELECT 
      ws.*,
      u.pseudo,
      u.avatar
    FROM wc_status ws
    LEFT JOIN users u ON ws.current_user_id = u.id
    WHERE ws.id = 1
  `).get();

  return status;
}

// Réserver le WC
export function reserveWC(userId, funMessage) {
  const now = new Date().toISOString();
  
  // Vérifier que le WC est disponible
  const status = getWCStatus();
  if (status.is_occupied) {
    throw new Error('Le WC est déjà occupé');
  }

  // Mettre à jour le statut
  db.prepare(`
    UPDATE wc_status 
    SET is_occupied = 1, 
        current_user_id = ?, 
        occupied_since = ?,
        fun_message = ?
    WHERE id = 1
  `).run(userId, now, funMessage);

  // Créer une nouvelle réservation dans l'historique
  const result = db.prepare(`
    INSERT INTO reservations (user_id, started_at)
    VALUES (?, ?)
  `).run(userId, now);

  return { reservationId: result.lastInsertRowid };
}

// Libérer le WC
export function releaseWC(userId, autoReleased = false) {
  const now = new Date().toISOString();
  const status = getWCStatus();

  // Vérifier que c'est bien l'utilisateur qui a réservé
  if (!autoReleased && status.current_user_id !== userId) {
    throw new Error('Vous ne pouvez pas libérer ce WC');
  }

  // Calculer la durée
  const startTime = new Date(status.occupied_since);
  const endTime = new Date(now);
  const durationMinutes = Math.round((endTime - startTime) / 60000);

  // Mettre à jour la réservation en cours dans l'historique
  db.prepare(`
    UPDATE reservations 
    SET ended_at = ?,
        duration_minutes = ?,
        auto_released = ?
    WHERE user_id = ? AND ended_at IS NULL
  `).run(now, durationMinutes, autoReleased ? 1 : 0, status.current_user_id);

  // Libérer le WC
  db.prepare(`
    UPDATE wc_status 
    SET is_occupied = 0, 
        current_user_id = NULL, 
        occupied_since = NULL,
        fun_message = NULL
    WHERE id = 1
  `).run();

  return { durationMinutes };
}

/**
 * Historique
 */

// Récupérer les dernières réservations
export function getRecentReservations(limit = 5) {
  return db.prepare(`
    SELECT 
      r.*,
      u.pseudo,
      u.avatar
    FROM reservations r
    JOIN users u ON r.user_id = u.id
    WHERE r.ended_at IS NOT NULL
    ORDER BY r.started_at DESC
    LIMIT ?
  `).all(limit);
}

// Récupérer les statistiques d'un utilisateur
export function getUserStats(userId) {
  return db.prepare(`
    SELECT 
      COUNT(*) as total_visits,
      AVG(duration_minutes) as avg_duration,
      SUM(duration_minutes) as total_duration
    FROM reservations
    WHERE user_id = ? AND ended_at IS NOT NULL
  `).get(userId);
}

export default db;
