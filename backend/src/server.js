import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import { 
  initDatabase, 
  createUser, 
  getUserByPseudo,
  getAllUsers,
  getWCStatus,
  getRecentReservations,
  getUserStats
} from './database.js';
import { setupSocketHandlers } from './socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? (process.env.CORS_ORIGIN || '*')
      : ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '../uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + uniqueSuffix + ext);
  }
});

// Filtrer les fichiers - seulement PNG et JPG
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Utilisez PNG ou JPG uniquement.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 // 1Mo max
  }
});

// Middleware
app.use(cors());
app.use(express.json());
// Servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static(uploadsDir));

// Initialiser la base de données
initDatabase();

// Routes API

/**
 * GET /api/health
 * Vérifier que le serveur fonctionne
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Le serveur fonctionne correctement' });
});

/**
 * POST /api/users
 * Créer un nouvel utilisateur
 * Body: { pseudo: string, avatar: string }
 */
app.post('/api/users', (req, res) => {
  try {
    const { pseudo, avatar } = req.body;
    
    if (!pseudo || !avatar) {
      return res.status(400).json({ error: 'Pseudo et avatar requis' });
    }

    const user = createUser(pseudo, avatar);
    res.status(201).json(user);
  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/upload-avatar
 * Upload d'une image avatar
 * Multipart form-data avec fichier 'avatar'
 */
app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    // Retourner l'URL de l'image uploadée
    const avatarUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ 
      success: true, 
      avatarUrl: avatarUrl,
      message: 'Avatar uploadé avec succès'
    });
  } catch (error) {
    console.error('Erreur upload avatar:', error);
    res.status(500).json({ error: error.message });
  }
});

// Gestion des erreurs multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Fichier trop volumineux. Taille maximale : 1Mo' });
    }
    return res.status(400).json({ error: `Erreur d'upload: ${error.message}` });
  }
  next(error);
});

/**
 * GET /api/users/:pseudo
 * Récupérer un utilisateur par pseudo
 */
app.get('/api/users/:pseudo', (req, res) => {
  try {
    const user = getUserByPseudo(req.params.pseudo);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/users
 * Récupérer tous les utilisateurs
 */
app.get('/api/users', (req, res) => {
  try {
    const users = getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/wc/status
 * Récupérer le statut actuel du WC
 */
app.get('/api/wc/status', (req, res) => {
  try {
    const status = getWCStatus();
    const history = getRecentReservations(5);
    
    res.json({ status, history });
  } catch (error) {
    console.error('Erreur récupération statut:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/history
 * Récupérer l'historique des réservations
 */
app.get('/api/history', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const history = getRecentReservations(limit);
    res.json(history);
  } catch (error) {
    console.error('Erreur récupération historique:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/users/:userId/stats
 * Récupérer les statistiques d'un utilisateur
 */
app.get('/api/users/:userId/stats', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const stats = getUserStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Configuration Socket.io
setupSocketHandlers(io);

// Démarrer le serveur
httpServer.listen(PORT, () => {
  console.log(`
  🚀 Serveur démarré sur le port ${PORT}
  🌐 API: http://localhost:${PORT}
  🔌 WebSocket: connecté
  💾 Base de données: SQLite initialisée
  `);
});

// Gestion des erreurs
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non gérée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejetée non gérée:', reason);
});
