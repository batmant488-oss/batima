import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function Dashboard({ session }) {
  const [incidents, setIncidents] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    setLoading(true)

    const [{ data: profileData }, { data: incidentsData, error: incidentsError }] = await Promise.all([
      supabase.from('profiles').select('full_name,building_id').eq('id', session.user.id).single(),
      supabase.from('incidents').select('*').order('created_at', { ascending: false })
    ])

    if (profileData) setProfile(profileData)
    if (incidentsError) {
      console.error('Erreur chargement incidents :', incidentsError.message)
      setIncidents([])
    } else {
      setIncidents(incidentsData || [])
    }

    setLoading(false)
  }

  return (
    <main className="page page-card">
      <section className="card page-animate">
        <header className="dashboard-header page-header">
          <div>
            <p className="eyebrow">Tableau de bord</p>
            <h1>Bienvenue, {profile?.full_name || session.user.email}</h1>
            <p className="subtitle page-lead">
              Vous suivez les incidents de l'immeuble {profile?.building_id || 'non défini'}.
            </p>
          </div>
          <button className="button" onClick={() => navigate('/report')}>
            Déclarer un incident
          </button>
        </header>

        <section className="overview-grid page-section">
          <div className="stat-card">
            <span>Incidents</span>
            <strong>{incidents.length}</strong>
          </div>
          <div className="stat-card">
            <span>Statut</span>
            <strong>{profile?.building_id ? 'RLS activée' : 'Profil à vérifier'}</strong>
          </div>
        </section>

        <div className="section-title page-section-title">
          <h2>Derniers incidents</h2>
        </div>

        {loading ? (
          <p>Chargement des incidents...</p>
        ) : incidents.length === 0 ? (
          <p>Aucun incident signalé pour l'instant.</p>
        ) : (
          <div className="incident-list">
            {incidents.map((incident) => (
              <article key={incident.id} className="incident-card">
                <div>
                  <h3>{incident.title || 'Sans titre'}</h3>
                  <p>{incident.description || 'Pas de description fournie.'}</p>
                </div>
                <span className="status-pill">{incident.status || 'Nouveau'}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
