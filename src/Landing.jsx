import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabaseClient'

const FALLBACK_BUILDINGS = [
  {
    id: 'demo-1',
    title: 'Résidence moderne',
    image:
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'demo-2',
    title: 'Façade urbaine',
    image:
      'https://images.unsplash.com/photo-1430285561322-7808604715df?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'demo-3',
    title: 'Immeuble résidentiel',
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80'
  }
]

function mapBuildingRow(row, index) {
  const image =
    row.image_url ||
    row.photo_url ||
    row.cover_url ||
    row.image ||
    FALLBACK_BUILDINGS[index % FALLBACK_BUILDINGS.length].image

  const title =
    row.name ||
    row.title ||
    row.label ||
    (row.building_id != null ? String(row.building_id) : null) ||
    `Immeuble ${index + 1}`

  return {
    id: String(row.id ?? row.building_id ?? `building-${index}`),
    title,
    image
  }
}

export default function Landing() {
  const [buildings, setBuildings] = useState(FALLBACK_BUILDINGS)
  const [buildingsSource, setBuildingsSource] = useState('demo')

  useEffect(() => {
    let cancelled = false

    const loadBuildings = async () => {
      const { data, error } = await supabase.from('buildings').select('*').limit(9)

      if (cancelled) return

      if (error) {
        console.warn('Table buildings indisponible ou RLS :', error.message)
        setBuildings(FALLBACK_BUILDINGS)
        setBuildingsSource('demo')
        return
      }

      if (data?.length) {
        setBuildings(data.map((row, i) => mapBuildingRow(row, i)))
        setBuildingsSource('supabase')
      } else {
        setBuildings(FALLBACK_BUILDINGS)
        setBuildingsSource('demo')
      }
    }

    loadBuildings()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="page page-landing">
      <section className="hero-section landing-hero-animate">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenue sur Batima-Gest</h1>
          <p className="hero-subtitle">
            Gérez vos incidents et suivez vos demandes en quelques clics. Connectez-vous ou créez un compte
            pour commencer.
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
            <p>Suivez l&apos;évolution de vos demandes.</p>
          </div>
        </div>
      </section>

      <section className="home-buildings page-animate">
        <div className="home-buildings-header">
          <h2>Quelques immeubles</h2>
          <p>
            {buildingsSource === 'supabase'
              ? 'Immeubles issus de votre base Supabase.'
              : 'Exemples visuels — créez une table buildings dans Supabase pour afficher vos vrais immeubles.'}
          </p>
        </div>
        <div className="building-photo-grid">
          {buildings.map((photo) => (
            <article key={photo.id} className="building-photo-card">
              <img src={photo.image} alt={photo.title} loading="lazy" />
              <div className="building-photo-overlay">
                <strong>{photo.title}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
