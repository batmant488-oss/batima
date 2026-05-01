import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <main className="page page-landing">
      <section className="hero-section page-animate">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenue sur Batima-Gest</h1>
          <p className="hero-subtitle">
            Gérez vos incidents et suivez vos demandes en quelques clics. Connectez-vous ou créez un compte pour commencer.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/auth">
              Se connecter
            </Link>
            <Link className="button button-secondary" to="/auth">
              Créer un compte
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card">
            <h3>Signalement rapide</h3>
            <p>Déclarez un incident en quelques secondes.</p>
          </div>
          <div className="floating-card floating-card-delay">
            <h3>Suivi en temps réel</h3>
            <p>Suivez l'évolution de vos demandes.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
