import { useNavigate } from 'react-router-dom'

export default function BackButton({ fallbackPath = '/' }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate(fallbackPath)
  }

  return (
    <button type="button" className="button button-ghost button-back" onClick={handleBack}>
      ← Retour
    </button>
  )
}
