import { useState } from 'react';

// Liste d'avatars emoji
const AVATARS = [
  '😀', '😎', '🤓', '😇', '🥳', '🤩', '😺', '🦊', '🐻', '🐼',
  '🦁', '🐯', '🦄', '🐨', '🐸', '🦉', '🐧', '🦖', '🚀', '⭐'
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function UserSetup({ onUserCreated }) {
  const [pseudo, setPseudo] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!pseudo.trim()) {
      setError('Le pseudo est obligatoire');
      setLoading(false);
      return;
    }

    if (pseudo.length < 2) {
      setError('Le pseudo doit contenir au moins 2 caractères');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pseudo: pseudo.trim(),
          avatar: selectedAvatar
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création de l\'utilisateur');
      }

      const user = await response.json();
      
      // Sauvegarder l'utilisateur dans le localStorage
      localStorage.setItem('wcReservationUser', JSON.stringify(user));
      
      onUserCreated(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-float">🚽</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            WC Reservation
          </h1>
          <p className="text-gray-600">
            Bienvenue ! Créez votre profil pour commencer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pseudo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ton pseudo
            </label>
            <input
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Ex: SuperDev"
              className="input"
              maxLength={20}
              autoFocus
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choisis ton avatar
            </label>
            <div className="grid grid-cols-10 gap-2">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`
                    text-3xl p-2 rounded-lg transition-all transform hover:scale-110
                    ${selectedAvatar === avatar 
                      ? 'bg-indigo-100 ring-2 ring-indigo-500 scale-110' 
                      : 'hover:bg-gray-100'
                    }
                  `}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Création en cours...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>✨</span>
                C'est parti !
              </span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Pas d'authentification complexe, juste du fun ! 🎉
        </div>
      </div>
    </div>
  );
}
