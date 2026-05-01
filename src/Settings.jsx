import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import BackButton from './BackButton'

export default function Settings({ session }) {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [buildingId, setBuildingId] = useState('')
  const [position, setPosition] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
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
        setFullName(data?.full_name || '')
        setPhone(data?.phone || '')
        setBuildingId(data?.building_id || '')
        setPosition(session.user.user_metadata?.position || '')
        setAvatarUrl(session.user.user_metadata?.avatar_url || '')
      }
    }

    fetchProfile()
  }, [session])

  const handleAvatarFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Veuillez choisir une image (JPG, PNG, etc.).')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setAvatarUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

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
        building_id: buildingId,
        avatar_url: avatarUrl
      }
    })

    if (error || userMetaError) {
      alert(`Erreur lors de la sauvegarde : ${(error || userMetaError).message}`)
    } else {
      alert('Profil mis à jour avec succès.')
    }

    setLoading(false)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== 'SUPPRIMER') {
      alert('Tapez SUPPRIMER pour confirmer la suppression.')
      return
    }
    if (!window.confirm('Supprimer vos données et vous déconnecter ?')) return

    setDeleteLoading(true)
    const userId = session.user.id
    const { error: incidentsError } = await supabase.from('incidents').delete().eq('user_id', userId)
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId)
    const { error: metadataError } = await supabase.auth.updateUser({
      data: { deleted_at: new Date().toISOString(), account_deleted: true }
    })

    if (incidentsError || profileError || metadataError) {
      alert(`Erreur : ${(incidentsError || profileError || metadataError).message}`)
      setDeleteLoading(false)
      return
    }

    await supabase.auth.signOut()
    setDeleteLoading(false)
    navigate('/auth')
  }

  const previewSrc =
    avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || session.user.email)}&background=334155&color=e2e8f0`

  return (
    <main className="page page-settings">
      <section className="card page-animate settings-page-card">
        <header className="settings-page-header">
          <BackButton />
          <div className="page-title-block">
            <p className="eyebrow">Compte</p>
            <h1>Paramètres</h1>
            <p className="page-lead">
              Mettez à jour votre profil, votre photo et la sécurité de votre compte — tout reste lisible et structuré.
            </p>
          </div>
        </header>

        <div className="settings-layout">
          <div className="settings-main">
            <form className="settings-panel" onSubmit={handleProfileSave}>
              <h2 className="settings-panel-title">Photo de profil</h2>
              <p className="settings-panel-hint">Visible sur le tableau de bord et dans la barre du haut après enregistrement.</p>
              <div className="settings-avatar-row">
                <img src={previewSrc} alt="" className="settings-avatar-preview" />
                <div className="settings-avatar-fields">
                  <label className="settings-file-label">
                    Choisir une image
                    <input type="file" accept="image/*" className="settings-file-input" onChange={handleAvatarFileChange} />
                  </label>
                  <label>
                    Ou coller une URL
                    <input
                      value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://…"
                    />
                  </label>
                  {(avatarUrl || session.user.user_metadata?.avatar_url) && (
                    <button type="button" className="button button-ghost button-compact" onClick={() => setAvatarUrl('')}>
                      Retirer la photo
                    </button>
                  )}
                </div>
              </div>

              <h2 className="settings-panel-title settings-panel-title--spaced">Informations</h2>
              <div className="settings-form-grid">
                <label>
                  Nom complet
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </label>
                <label>
                  Téléphone
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optionnel" />
                </label>
                <label className="settings-field-span2">
                  Email
                  <input value={session.user.email} disabled />
                </label>
                <label>
                  Immeuble
                  <input
                    value={buildingId}
                    onChange={(e) => setBuildingId(e.target.value)}
                    placeholder="Ex. BAT-A"
                  />
                </label>
                <label>
                  Position
                  <input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Ex. Étage 2, app. 21"
                  />
                </label>
              </div>

              <div className="settings-form-actions">
                <button className="button button-primary" type="submit" disabled={loading}>
                  {loading ? 'Enregistrement…' : 'Enregistrer le profil'}
                </button>
              </div>
            </form>
          </div>

          <aside className="settings-aside">
            <div className="settings-aside-card">
              <h3>Sécurité</h3>
              <p className="settings-aside-text">Modifiez votre mot de passe sur une page dédiée, avec confirmation.</p>
              <button type="button" className="button button-ghost button-compact" onClick={() => navigate('/change-password')}>
                Changer le mot de passe
              </button>
            </div>
            <div className="settings-aside-card settings-aside-card--muted">
              <h3>Mot de passe oublié ?</h3>
              <p className="settings-aside-text">Recevez un lien par e-mail pour en définir un nouveau.</p>
              <Link to="/forgot-password" className="button button-ghost button-compact">
                Réinitialiser par e-mail
              </Link>
            </div>
            <div className="settings-aside-card settings-aside-card--danger">
              <h3>Zone sensible</h3>
              <p className="settings-aside-text">Supprime profil, incidents liés et déconnecte la session.</p>
              <label className="settings-danger-label">
                Tapez SUPPRIMER
                <input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="SUPPRIMER"
                  autoComplete="off"
                />
              </label>
              <button
                type="button"
                className="button button-danger button-compact"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Suppression…' : 'Supprimer mon compte'}
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
