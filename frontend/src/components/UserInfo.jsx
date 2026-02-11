export default function UserInfo({ user, onLogout }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-5xl">{user.avatar}</div>
          <div>
            <p className="text-sm text-gray-500">Connecté en tant que</p>
            <p className="text-xl font-bold text-gray-800">{user.pseudo}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
