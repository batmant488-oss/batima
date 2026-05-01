import { NavLink } from 'react-router-dom'

export default function Navigation({ onLogout, onToggleTheme, darkMode }) {
  const getLinkClassName = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')

  return (
    <nav className="nav-bar">
      <div className="nav-brand">Batima-Gest</div>
      <div className="nav-links">
        <NavLink to="/" end className={getLinkClassName}>
          Tableau de bord
        </NavLink>
        <NavLink to="/report" className={getLinkClassName}>Déclarer un incident</NavLink>
        <NavLink to="/profile" className={getLinkClassName}>Mon profil</NavLink>
        <NavLink to="/settings" className={getLinkClassName}>Paramètres</NavLink>
      </div>
      <div className="nav-actions">
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
