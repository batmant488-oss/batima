import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function Settings({ session }) {
  const [profile, setProfile] = useState(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [buildingId, setBuildingId] = useState('')
  const [position, setPosition] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name,phone,building_id')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.warn('Impossible de charger le profil :', error.message)
      } else {
        setProfile(data)
        setFullName(data?.full_name || '')
        setPhone(data?.phone || '')
        setBuildingId(data?.building_id || '')
        setPosition(session.user.user_metadata?.position || '')
      }
    }

    fetchProfile()
  }, [session])

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone, building_id: buildingId })
      .eq('id', session.user.id)

    const { error: userMetaError } = await supabase.auth.updateUser({
      data: {
        position,
        building_id: buildingId
      }
    })

    if (error || userMetaError) {
      alert(`Erreur lors de la sauvegarde : ${(error || userMetaError).message}`)
    } else {
      setProfile((prev) => ({ ...prev, building_id: buildingId }))
      alert('Profil mis à jour avec succès.')
    }

    setLoading(false)
  }

  return (
    <main className="page page-card">
      <section className="card page-animate">
        <header className="page-header">
          <h1>Paramètres</h1>
          <p className="page-lead">Gérez votre profil et changez votre mot de passe ici.</p>
        </header>

        <div className="settings-grid">
          <form className="form-grid" onSubmit={handleProfileSave}>
            <h2>Informations du profil</h2>
            <label>
              Nom complet
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </label>
            <label>
              Téléphone
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label>
              Email
              <input value={session.user.email} disabled />
            </label>
            <label>
              Immeuble
              <input
                value={buildingId}
                onChange={(e) => setBuildingId(e.target.value)}
                placeholder="Ex: BAT-A"
              />
            </label>
            <label>
              Position
              <input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Ex: Etage 2, Appartement 21"
              />
            </label>
            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer le profil'}
            </button>
          </form>

          <div className="form-grid">
            <h2>Changer le mot de passe</h2>
            <p>Utilisez la page dediee pour securiser votre mot de passe.</p>
            <button className="button" type="button" onClick={() => navigate('/change-password')}>
              Aller a la page de changement
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
