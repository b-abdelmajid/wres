export default function History({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          📊 Historique
        </h3>
        <p className="text-gray-500 text-center py-8">
          Aucune utilisation récente
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>📊</span>
        <span>Historique récent</span>
      </h3>
      
      <div className="space-y-3">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {/* Avatar et Pseudo */}
            <div className="flex items-center gap-3 flex-1">
              <div className="text-3xl">{entry.avatar}</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {entry.pseudo}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(entry.started_at)}
                </p>
              </div>
            </div>

            {/* Durée */}
            <div className="text-right">
              <p className="text-lg font-bold text-indigo-600">
                {formatDuration(entry.duration_minutes)}
              </p>
              {entry.auto_released === 1 && (
                <p className="text-xs text-orange-600">
                  ⏰ Auto
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {history.length >= 5 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Affichage des 5 dernières utilisations
          </p>
        </div>
      )}
    </div>
  );
}
