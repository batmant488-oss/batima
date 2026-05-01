import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function Profile({ session }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const profilePhoto =
    session.user.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile?.full_name || session.user.email
    )}&background=2563eb&color=ffffff`

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name,building_id,phone')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.warn('Erreur profil :', error.message)
      } else {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [session])

  return (
    <main className="page page-card">
      <section className="card page-animate">
        <header className="page-header">
          <h1>Mon profil</h1>
        </header>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <>
            <p className="page-lead">Vous pouvez modifier vos informations et changer votre mot de passe depuis la page Paramètres.</p>
            <div className="profile-photo-wrap">
              <img src={profilePhoto} alt="Photo de profil" className="profile-photo" />
            </div>
            <div className="profile-grid">
              <div>
                <strong>Nom</strong>
                <p>{profile?.full_name || 'Non renseigné'}</p>
              </div>
              <div>
                <strong>Email</strong>
                <p>{session.user.email}</p>
              </div>
              <div>
                <strong>Immeuble</strong>
                <p>{profile?.building_id || 'Non lié'}</p>
              </div>
              <div>
                <strong>Téléphone</strong>
                <p>{profile?.phone || 'Non renseigné'}</p>
              </div>
              <div>
                <strong>Position</strong>
                <p>{session.user.user_metadata?.position || 'Non renseignee'}</p>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
