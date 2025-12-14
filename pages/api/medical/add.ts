import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-10-01',
  token: process.env.SANITY_TOKEN, // serve write access
  useCdn: false,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Autenticazione tramite API Key (header: Authorization: Bearer <token>)
  const auth = req.headers['authorization'] || ''
  if (!auth || !auth.toString().startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Accesso non autorizzato' })
  }
  const token = auth.toString().slice('Bearer '.length).trim()
  if (token !== process.env.MEDICAL_API_KEY) {
    return res.status(403).json({ error: 'Accesso non autorizzato' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' })
  }

  const { username, visitType, diagnosis, date } = req.body ?? {}

  if (!username || !visitType || !diagnosis || !date) {
    return res.status(400).json({ error: 'Dati mancanti' })
  }

  try {
    const created = await client.create({
      _type: 'medicalRecord',
      username,
      visitType,
      diagnosis,
      date,
    })

    return res.status(200).json({ success: true, id: created._id })
  } catch (err: any) {
    console.error('Sanity create error:', err)
    return res.status(500).json({ error: 'Errore Sanity', details: err?.message || String(err) })
  }
}
