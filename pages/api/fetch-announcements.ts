import type { NextApiRequest, NextApiResponse } from 'next';
import { createAuthenticatedClient, getStandardHeaders } from '../../src/utils/moutamadrisAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { client } = await createAuthenticatedClient(username, password);

    // Try to get announcements
    const announcementsRes = await client.get(
      'https://massarservice.men.gov.ma/moutamadris/TuteurEleves/GetAnnonces',
      {
        headers: getStandardHeaders()
      }
    );

    if (!announcementsRes.data) {
      return res.status(500).json({ error: 'Could not fetch announcements' });
    }

    res.json({ rawHTML: announcementsRes.data });
  } catch (error: any) {
    console.error('API error:', error);
    if (error.message === 'Login failed') {
      res.status(401).json({ error: 'Login failed' });
    } else {
      res.status(500).json({ error: 'Something went wrong', details: error?.message });
    }
  }
}