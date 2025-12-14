import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

type Record = {
  _id?: string
  username: string
  visitType: string
  diagnosis: string
  date: string
}

const PlayerPage = () => {
  const [medicalRecords, setMedicalRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { query } = useRouter()
  const username = Array.isArray(query.username) ? query.username[0] : query.username

  useEffect(() => {
    if (!username) return
    setLoading(true)
    setError(null)

    fetch(`/api/medical/history?username=${encodeURIComponent(username)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => setMedicalRecords(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || 'Errore'))
      .finally(() => setLoading(false))
  }, [username])

  return (
    <div style={{ padding: 20 }}>
      <h1>Cartella Clinica di {username}</h1>

      {loading && <p>Caricamento...</p>}
      {error && <p style={{ color: 'red' }}>Errore: {error}</p>}

      {!loading && medicalRecords.length === 0 && <p>Nessuna voce trovata.</p>}

      <ul>
        {medicalRecords.map((record) => (
          <li key={record._id ?? Math.random()}>
            <p><strong>Tipo visita:</strong> {record.visitType}</p>
            <p><strong>Diagnosi:</strong> {record.diagnosis}</p>
            <p><strong>Data:</strong> {record.date}</p>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PlayerPage
