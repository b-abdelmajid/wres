import { 
  getWCStatus, 
  reserveWC, 
  releaseWC, 
  getRecentReservations,
  getUserById 
} from './database.js';

// Messages fun aléatoires
const FUN_MESSAGES = [
  "Fais comme chez toi 🧻",
  "Réunion stratégique en cours 🚀",
  "Moment de réflexion intense 🤔",
  "Ça médite sévère là-dedans 🧘",
  "Patience est mère de toutes les vertus 😌",
  "Zone de créativité activée 💡",
  "En pleine session de brainstorming 🌊",
  "Chargement en cours... 📥",
  "Pause philosophique ☁️",
  "Occupé à changer le monde 🌍"
];

// Timeout automatique : 10 minutes (en millisecondes)
const AUTO_RELEASE_TIMEOUT = 10 * 60 * 1000;

// Stocker le timer actuel
let currentTimeoutId = null;

/**
 * Choisir un message fun aléatoire
 */
function getRandomFunMessage() {
  return FUN_MESSAGES[Math.floor(Math.random() * FUN_MESSAGES.length)];
}

/**
 * Émettre le statut du WC à tous les clients
 */
function emitWCStatus(io) {
  const status = getWCStatus();
  const history = getRecentReservations(5);
  
  io.emit('wc:status', {
    status,
    history
  });
}

/**
 * Démarrer le timeout automatique
 */
function startAutoReleaseTimeout(io, userId) {
  // Annuler le timeout précédent s'il existe
  if (currentTimeoutId) {
    clearTimeout(currentTimeoutId);
  }

  // Créer un nouveau timeout
  currentTimeoutId = setTimeout(() => {
    console.log(`⏰ Libération automatique pour l'utilisateur ${userId}`);
    
    try {
      const result = releaseWC(userId, true);
      console.log(`✅ WC libéré automatiquement après ${result.durationMinutes} minutes`);
      
      // Émettre le nouveau statut
      emitWCStatus(io);
      
      // Émettre un événement spécial pour la libération automatique
      io.emit('wc:auto-released', {
        userId,
        duration: result.durationMinutes
      });
    } catch (error) {
      console.error('Erreur lors de la libération automatique:', error);
    }
    
    currentTimeoutId = null;
  }, AUTO_RELEASE_TIMEOUT);
}

/**
 * Annuler le timeout automatique
 */
function cancelAutoReleaseTimeout() {
  if (currentTimeoutId) {
    clearTimeout(currentTimeoutId);
    currentTimeoutId = null;
  }
}

/**
 * Configuration des événements Socket.io
 */
export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Nouvelle connexion: ${socket.id}`);

    // Envoyer le statut actuel au nouveau client
    socket.on('wc:get-status', () => {
      emitWCStatus(io);
    });

    // Réserver le WC
    socket.on('wc:reserve', ({ userId }) => {
      try {
        const user = getUserById(userId);
        if (!user) {
          socket.emit('wc:error', { message: 'Utilisateur non trouvé' });
          return;
        }

        const funMessage = getRandomFunMessage();
        reserveWC(userId, funMessage);
        
        console.log(`🚽 ${user.pseudo} a réservé le WC`);
        
        // Démarrer le timeout automatique
        startAutoReleaseTimeout(io, userId);
        
        // Émettre le nouveau statut à tous
        emitWCStatus(io);
        
        socket.emit('wc:reserved', { success: true });
      } catch (error) {
        console.error('Erreur lors de la réservation:', error);
        socket.emit('wc:error', { message: error.message });
      }
    });

    // Libérer le WC
    socket.on('wc:release', ({ userId }) => {
      try {
        const user = getUserById(userId);
        if (!user) {
          socket.emit('wc:error', { message: 'Utilisateur non trouvé' });
          return;
        }

        const result = releaseWC(userId, false);
        
        console.log(`✅ ${user.pseudo} a libéré le WC après ${result.durationMinutes} minutes`);
        
        // Annuler le timeout automatique
        cancelAutoReleaseTimeout();
        
        // Émettre le nouveau statut à tous
        emitWCStatus(io);
        
        // Émettre un événement spécial pour célébrer la libération
        io.emit('wc:released', {
          userId,
          pseudo: user.pseudo,
          duration: result.durationMinutes
        });
        
        socket.emit('wc:released-success', { success: true });
      } catch (error) {
        console.error('Erreur lors de la libération:', error);
        socket.emit('wc:error', { message: error.message });
      }
    });

    // Déconnexion
    socket.on('disconnect', () => {
      console.log(`🔌 Déconnexion: ${socket.id}`);
    });
  });

  // Vérifier au démarrage s'il y a une réservation en cours et démarrer le timeout
  const currentStatus = getWCStatus();
  if (currentStatus.is_occupied && currentStatus.current_user_id) {
    const occupiedSince = new Date(currentStatus.occupied_since);
    const now = new Date();
    const elapsedTime = now - occupiedSince;
    
    if (elapsedTime >= AUTO_RELEASE_TIMEOUT) {
      // Si déjà expiré, libérer immédiatement
      console.log('⏰ Réservation expirée détectée au démarrage, libération...');
      releaseWC(currentStatus.current_user_id, true);
      emitWCStatus(io);
    } else {
      // Sinon, créer un timeout pour le temps restant
      const remainingTime = AUTO_RELEASE_TIMEOUT - elapsedTime;
      console.log(`⏰ Réservation en cours détectée, libération dans ${Math.round(remainingTime / 60000)} minutes`);
      
      currentTimeoutId = setTimeout(() => {
        console.log(`⏰ Libération automatique pour l'utilisateur ${currentStatus.current_user_id}`);
        releaseWC(currentStatus.current_user_id, true);
        emitWCStatus(io);
        io.emit('wc:auto-released', {
          userId: currentStatus.current_user_id
        });
        currentTimeoutId = null;
      }, remainingTime);
    }
  }
}

export { AUTO_RELEASE_TIMEOUT };
