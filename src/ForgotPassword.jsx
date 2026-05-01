import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/change-password`
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Un email de reinitialisation a ete envoye.')
      setEmail('')
    }

    setLoading(false)
  }

  return (
    <main className="page page-auth">
      <section className="card auth-card page-animate">
        <header className="page-header">
          <h1>Mot de passe oublie</h1>
          <p className="page-lead">
            Entrez votre email. Vous recevrez un lien pour definir un nouveau mot de passe.
          </p>
        </header>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Envoi...' : 'Envoyer le lien'}
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
