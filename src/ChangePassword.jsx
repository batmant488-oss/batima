import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function ChangePassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      alert(error.message)
    } else {
      alert('Mot de passe mis a jour avec succes.')
      navigate('/auth')
    }

    setLoading(false)
  }

  return (
    <main className="page page-auth">
      <section className="card auth-card page-animate">
        <header className="page-header">
          <h1>Changer le mot de passe</h1>
          <p className="page-lead">Definissez un nouveau mot de passe pour votre compte.</p>
        </header>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Nouveau mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label>
            Confirmer le mot de passe
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Mettre a jour'}
          </button>
        </form>

        <div style={{ marginTop: '16px' }}>
          <Link to="/auth" className="button button-ghost">
            Retour a la connexion
          </Link>
        </div>
      </section>
    </main>
  )
}
