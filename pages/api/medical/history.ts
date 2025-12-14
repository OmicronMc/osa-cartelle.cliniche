import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-10-01',
  useCdn: true, // letture possono usare CDN
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const username = Array.isArray(req.query.username) ? req.query.username[0] : req.query.username

  if (!username) {
    return res.status(400).json({ error: 'username query mancante' })
  }

  try {
    const records = await client.fetch(
      `*[_type == "medicalRecord" && username == $username] | order(date desc)`,
      { username }
    )
    return res.status(200).json(records)
  } catch (err: any) {
    console.error('Sanity fetch error:', err)
    return res.status(500).json({ error: 'Errore nel recupero dei dati', details: err?.message || String(err) })
  }
}
