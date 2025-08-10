import type { NextApiRequest, NextApiResponse } from 'next';
import { createAuthenticatedClient, getStandardHeaders } from '../../src/utils/moutamadrisAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password, year } = req.body;
  if (!username || !password || !year) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { client } = await createAuthenticatedClient(username, password);

    // Try to get attendance information
    const attendancePayload = new URLSearchParams({
      Annee: year.split('/')[0]
    }).toString();

    const attendanceRes = await client.post(
      'https://massarservice.men.gov.ma/moutamadris/TuteurEleves/GetAbsences',
      attendancePayload,
      {
        headers: getStandardHeaders()
      }
    );

    if (!attendanceRes.data) {
      return res.status(500).json({ error: 'Could not fetch attendance data' });
    }

    res.json({ rawHTML: attendanceRes.data });
  } catch (error: any) {
    console.error('API error:', error);
    if (error.message === 'Login failed') {
      res.status(401).json({ error: 'Login failed' });
    } else {
      res.status(500).json({ error: 'Something went wrong', details: error?.message });
    }
  }
}