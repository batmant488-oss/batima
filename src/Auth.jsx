import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('choice')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [buildingId, setBuildingId] = useState('')
  const [position, setPosition] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        alert(error.message)
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            building_id: buildingId,
            position
          }
        }
      })
      if (error) {
        alert(error.message)
      } else {
        const {
          data: { user }
        } = await supabase.auth.getUser()

        if (user?.id && buildingId) {
          await supabase
            .from('profiles')
            .upsert({ id: user.id, building_id: buildingId, full_name: fullName }, { onConflict: 'id' })
        }

        alert('Inscription réussie ! Vous pouvez vous connecter.')
        setMode('login')
      }
    }

    setLoading(false)
  }

  const renderChoice = () => (
    <div className="choice-grid">
      <button className="button" onClick={() => setMode('login')}>
        J'ai déjà un compte
      </button>
      <button className="button button-ghost" onClick={() => setMode('register')}>
        Créer un compte
      </button>
    </div>
  )

  const renderForm = () => (
    <form className="form-grid" onSubmit={handleAuth}>
      {mode === 'register' && (
        <>
          <label>
            Nom et Prénom
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </label>
          <label>
            Immeuble
            <input
              type="text"
              value={buildingId}
              onChange={(e) => setBuildingId(e.target.value)}
              placeholder="Ex: BAT-A"
              required
            />
          </label>
          <label>
            Position
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Ex: Etage 2, Appartement 21"
            />
          </label>
        </>
      )}

      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>

      <label>
        Mot de passe
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>

      <button className="button" type="submit" disabled={loading}>
        {loading
          ? 'Chargement...'
          : mode === 'login'
          ? 'Se connecter'
          : "S'inscrire"}
      </button>
    </form>
  )

  return (
    <main className="page page-auth">
      <section className="card auth-card page-animate">
        <header className="page-header">
          <h1>Batima-Gest</h1>
        </header>
        {mode === 'choice' ? (
          <>
            <p>Choisissez si vous avez déjà un compte ou si vous souhaitez en créer un.</p>
            {renderChoice()}
          </>
        ) : (
          <>
            <p>
              {mode === 'login'
                ? 'Connectez-vous pour accéder à votre extranet.'
                : "Créez un compte résident et renseignez l'immeuble ainsi que votre position."}
            </p>
            {renderForm()}
            <div style={{ display: 'grid', gap: '12px', marginTop: '18px' }}>
              {mode === 'login' && (
                <Link to="/forgot-password" className="button button-ghost">
                  Mot de passe oublié ?
                </Link>
              )}
              <button
                type="button"
                className="button button-ghost"
                onClick={() => {
                  setMode('choice')
                }}
              >
                Retour au choix
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
