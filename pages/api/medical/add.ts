import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-10-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' })
  }

  const { username, visitType, diagnosis, date } = req.body

  if (!username || !visitType || !diagnosis || !date) {
    return res.status(400).json({ error: 'Dati mancanti' })
  }

  try {
    await client.create({
      _type: 'medicalRecord',
      username,
      visitType,
      diagnosis,
      date,
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Errore Sanity' })
  }
}
