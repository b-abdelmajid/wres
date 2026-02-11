import { useState, useEffect } from 'react';

export default function WCStatus({ status, currentUser, onReserve, onRelease }) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes en secondes

  useEffect(() => {
    if (!status?.is_occupied || !status?.occupied_since) {
      setTimeElapsed(0);
      setTimeRemaining(600);
      return;
    }

    const interval = setInterval(() => {
      const occupiedSince = new Date(status.occupied_since);
      const now = new Date();
      const elapsed = Math.floor((now - occupiedSince) / 1000);
      const remaining = Math.max(0, 600 - elapsed);

      setTimeElapsed(elapsed);
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [status?.is_occupied, status?.occupied_since]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((600 - timeRemaining) / 600) * 100;
  };

  if (!status) {
    return (
      <div className="card text-center">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Chargement du statut...</p>
      </div>
    );
  }

  // WC Disponible
  if (!status.is_occupied) {
    return (
      <div className="card text-center">
        <div className="text-9xl mb-6 animate-float">🚽</div>
        <h2 className="text-3xl font-bold text-green-600 mb-2">
          WC Disponible
        </h2>
        <p className="text-gray-600 mb-6">
          Les toilettes sont libres, fonce !
        </p>
        <button
          onClick={onReserve}
          className="btn-primary text-xl py-4"
        >
          🚽 Réserver maintenant
        </button>
      </div>
    );
  }

  // WC Occupé par l'utilisateur actuel
  const isCurrentUser = status.current_user_id === currentUser?.id;

  if (isCurrentUser) {
    return (
      <div className="card text-center">
        <div className="text-9xl mb-6 animate-bounce-slow">🚽</div>
        <h2 className="text-3xl font-bold text-indigo-600 mb-2">
          Tu occupes le WC
        </h2>
        <p className="text-gray-600 mb-4">
          {status.fun_message || 'Prends ton temps !'}
        </p>
        
        {/* Timer */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Temps écoulé : {formatTime(timeElapsed)}</span>
            <span>Temps restant : {formatTime(timeRemaining)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-1000 rounded-full"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          {timeRemaining === 0 && (
            <p className="text-red-600 text-sm mt-2 font-semibold">
              ⏰ Libération automatique imminente !
            </p>
          )}
        </div>

        <button
          onClick={onRelease}
          className="btn-success text-xl py-4"
        >
          ✅ Libérer le WC
        </button>
      </div>
    );
  }

  // WC Occupé par quelqu'un d'autre
  return (
    <div className="card text-center">
      <div className="text-9xl mb-6 pulse-red">🚽</div>
      <h2 className="text-3xl font-bold text-red-600 mb-4">
        WC Occupé
      </h2>
      
      {/* Info utilisateur */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="text-5xl">{status.avatar}</div>
        <div className="text-left">
          <p className="text-xl font-semibold text-gray-800">
            {status.pseudo}
          </p>
          <p className="text-sm text-gray-600">
            Depuis {formatTime(timeElapsed)}
          </p>
        </div>
      </div>

      {/* Message fun */}
      <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 mb-6">
        <p className="text-lg text-indigo-700 font-medium">
          {status.fun_message || 'En cours...'}
        </p>
      </div>

      {/* Temps restant */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Libération automatique dans
        </p>
        <p className="text-4xl font-bold text-indigo-600 font-mono">
          {formatTime(timeRemaining)}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-3">
          <div
            className="bg-gradient-to-r from-red-500 to-orange-500 h-full transition-all duration-1000 rounded-full"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      <p className="text-gray-500 text-sm italic">
        Patience, ça ne devrait plus tarder... 😌
      </p>
    </div>
  );
}
