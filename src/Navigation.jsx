import { Link, NavLink } from 'react-router-dom'

export default function Navigation({ session, onLogout, onToggleTheme, darkMode }) {
  const getLinkClassName = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')
  const fallbackName = session?.user?.email?.split('@')[0] || 'User'
  const avatarSrc =
    session?.user?.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=2563eb&color=ffffff`

  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-brand" title="Accueil">
        <span className="nav-logo-mark" aria-hidden="true">
          <span className="nav-logo-core">B</span>
          <span className="nav-logo-orbit"></span>
          <span className="nav-logo-spark"></span>
        </span>
        <span className="nav-brand-text">Batima-Gest</span>
      </Link>
      <div className="nav-links">
        <NavLink to="/" end className={getLinkClassName}>
          Tableau de bord
        </NavLink>
        <NavLink to="/report" className={getLinkClassName}>
          Déclarer un incident
        </NavLink>
        <NavLink to="/profile" className={getLinkClassName}>
          Mon profil
        </NavLink>
        <NavLink to="/settings" className={getLinkClassName}>
          Paramètres
        </NavLink>
      </div>
      <div className="nav-actions">
        <img src={avatarSrc} alt="" className="nav-user-avatar" width={36} height={36} />
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title={darkMode ? 'Mode clair' : 'Mode sombre'}
          aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button className="button button-ghost" onClick={onLogout}>
          Déconnexion
        </button>
      </div>
    </nav>
  )
}
