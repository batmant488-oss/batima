import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

const FALLBACK_BUILDINGS = [
  {
    id: 'demo-1',
    title: 'Residence moderne',
    image:
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'demo-2',
    title: 'Facade urbaine',
    image:
      'https://images.unsplash.com/photo-1430285561322-7808604715df?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'demo-3',
    title: 'Immeuble residentiel',
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
  }
]

export default function Dashboard({ session }) {
  const [incidents, setIncidents] = useState([])
  const [profile, setProfile] = useState(null)
  const [buildings, setBuildings] = useState(FALLBACK_BUILDINGS)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const displayName =
    profile?.full_name ||
    session.user.user_metadata?.full_name ||
    session.user.user_metadata?.name ||
    session.user.email?.split('@')?.[0] ||
    'Utilisateur'

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    setLoading(true)

    const [{ data: profileData }, { data: incidentsData, error: incidentsError }, { data: buildingsData }] = await Promise.all([
      supabase.from('profiles').select('full_name,building_id').eq('id', session.user.id).single(),
      supabase.from('incidents').select('*').order('created_at', { ascending: false }),
      supabase.from('buildings').select('*').limit(3)
    ])

    if (profileData) setProfile(profileData)
    if (incidentsError) {
      console.error('Erreur chargement incidents :', incidentsError.message)
      setIncidents([])
    } else {
      setIncidents(incidentsData || [])
    }

    if (Array.isArray(buildingsData) && buildingsData.length > 0) {
      const mappedBuildings = buildingsData.map((item, index) => ({
        id: String(item.id ?? item.building_id ?? `building-${index}`),
        title: item.name || item.title || `Immeuble ${index + 1}`,
        image:
          item.image_url ||
          item.photo_url ||
          item.cover_url ||
          item.image ||
          FALLBACK_BUILDINGS[index % FALLBACK_BUILDINGS.length].image
      }))
      setBuildings(mappedBuildings)
    }

    setLoading(false)
  }

  return (
    <main className="page page-card">
      <section className="card page-animate">
        <header className="dashboard-header page-header">
          <div>
            <p className="eyebrow">Tableau de bord</p>
            <h1>Bienvenue, {displayName}</h1>
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

        <section className="dashboard-buildings page-section">
          <div className="section-title">
            <h2>Immeubles</h2>
          </div>
          <div className="dashboard-buildings-grid">
            {buildings.map((building) => (
              <article key={building.id} className="dashboard-building-card">
                <img src={building.image} alt={building.title} />
                <div className="dashboard-building-label">{building.title}</div>
              </article>
            ))}
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
