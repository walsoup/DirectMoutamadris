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
    } else if (error.message.includes('Cannot connect to MoutaMadris service')) {
      res.status(503).json({ error: 'Service unavailable: This application only works from Morocco due to geo-restrictions.' });
    } else if (error.code === 'ENOTFOUND') {
      res.status(503).json({ error: 'Network error: Cannot connect to MoutaMadris service. Please check your internet connection or try again later.' });
    } else {
      res.status(500).json({ error: 'Something went wrong', details: error?.message });
    }
  }
}