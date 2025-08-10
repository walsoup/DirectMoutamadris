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

    // Try to get homework/assignments
    const homeworkPayload = new URLSearchParams({
      Annee: year.split('/')[0]
    }).toString();

    const homeworkRes = await client.post(
      'https://massarservice.men.gov.ma/moutamadris/TuteurEleves/GetDevoirs',
      homeworkPayload,
      {
        headers: getStandardHeaders()
      }
    );

    if (!homeworkRes.data) {
      return res.status(500).json({ error: 'Could not fetch homework data' });
    }

    res.json({ rawHTML: homeworkRes.data });
  } catch (error: any) {
    console.error('API error:', error);
    if (error.message === 'Login failed') {
      res.status(401).json({ error: 'Login failed' });
    } else {
      res.status(500).json({ error: 'Something went wrong', details: error?.message });
    }
  }
}