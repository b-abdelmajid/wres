import { useState, useEffect } from 'react';
import socket from './utils/socket';
import { celebrateRelease } from './utils/confetti';
import UserSetup from './components/UserSetup';
import UserInfo from './components/UserInfo';
import WCStatus from './components/WCStatus';
import History from './components/History';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [wcStatus, setWCStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [notification, setNotification] = useState(null);

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('wcReservationUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'utilisateur:', err);
        localStorage.removeItem('wcReservationUser');
      }
    }
  }, []);

  // Gérer les événements Socket.io
  useEffect(() => {
    // Connexion/déconnexion
    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('wc:get-status');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Statut du WC
    socket.on('wc:status', (data) => {
      setWCStatus(data.status);
      setHistory(data.history || []);
    });

    // Erreurs
    socket.on('wc:error', (data) => {
      showNotification(data.message, 'error');
    });

    // WC libéré
    socket.on('wc:released', (data) => {
      celebrateRelease();
      showNotification(
        `${data.pseudo} a libéré le WC après ${data.duration} min ! 🎉`,
        'success'
      );
    });

    // WC libéré automatiquement
    socket.on('wc:auto-released', (data) => {
      showNotification(
        'Le WC a été libéré automatiquement (timeout) ⏰',
        'warning'
      );
    });

    // Demander le statut initial
    socket.emit('wc:get-status');

    // Cleanup
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('wc:status');
      socket.off('wc:error');
      socket.off('wc:released');
      socket.off('wc:auto-released');
    };
  }, []);

  // Afficher une notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('wcReservationUser');
    setCurrentUser(null);
  };

  // Réserver le WC
  const handleReserve = () => {
    if (!currentUser) return;
    socket.emit('wc:reserve', { userId: currentUser.id });
  };

  // Libérer le WC
  const handleRelease = () => {
    if (!currentUser) return;
    socket.emit('wc:release', { userId: currentUser.id });
  };

  // Si pas d'utilisateur, afficher le setup
  if (!currentUser) {
    return <UserSetup onUserCreated={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
            <span className="text-6xl">🚽</span>
            <span>WC Reservation</span>
          </h1>
          <p className="text-gray-600">
            Ne te déplace plus pour rien !
          </p>
          
          {/* Indicateur de connexion */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-500">
              {isConnected ? 'Connecté en temps réel' : 'Déconnecté'}
            </span>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`
            mb-6 p-4 rounded-xl shadow-lg animate-slide-up
            ${notification.type === 'success' ? 'bg-green-50 border-2 border-green-200 text-green-800' : ''}
            ${notification.type === 'error' ? 'bg-red-50 border-2 border-red-200 text-red-800' : ''}
            ${notification.type === 'warning' ? 'bg-orange-50 border-2 border-orange-200 text-orange-800' : ''}
            ${notification.type === 'info' ? 'bg-blue-50 border-2 border-blue-200 text-blue-800' : ''}
          `}>
            <p className="font-medium text-center">{notification.message}</p>
          </div>
        )}

        {/* Info utilisateur */}
        <div className="mb-6">
          <UserInfo user={currentUser} onLogout={handleLogout} />
        </div>

        {/* Statut du WC */}
        <div className="mb-6">
          <WCStatus
            status={wcStatus}
            currentUser={currentUser}
            onReserve={handleReserve}
            onRelease={handleRelease}
          />
        </div>

        {/* Historique */}
        <History history={history} />

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Fait avec ❤️ pour éviter les déplacements inutiles</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

export default App;
