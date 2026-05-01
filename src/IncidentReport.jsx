import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function IncidentReport({ session }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [buildingId, setBuildingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('building_id')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.warn('Impossible de charger le profil :', error.message)
      } else {
        setBuildingId(data?.building_id || null)
      }
    }

    fetchProfile()
  }, [session])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      title,
      description,
      status: 'Nouveau',
      user_id: session.user.id,
      building_id: buildingId
    }

    const { error } = await supabase.from('incidents').insert(payload)
    if (error) {
      alert(`Erreur : ${error.message}`)
    } else {
      alert('Incident déclaré avec succès !')
      navigate('/')
    }

    setLoading(false)
  }

  return (
    <main className="page page-form">
      <section className="card page-animate">
        <header className="page-header">
          <h1>Déclarer un incident</h1>
          <p className="page-lead">
          Remplissez ce formulaire pour signaler un incident. Si votre profil n'est pas
          encore lié à un immeuble, vérifiez votre table `profiles` dans Supabase.
          </p>
        </header>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Titre de l'incident
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} />
          </label>
          <label>
            Immeuble
            <input value={buildingId ?? ''} disabled placeholder="ID immeuble lié" />
          </label>
          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Envoyer l’incident'}
          </button>
        </form>
      </section>
    </main>
  )
}
