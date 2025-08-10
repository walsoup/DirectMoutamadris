import axios from 'axios';
import { load } from 'cheerio';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

export interface AuthenticatedClient {
  client: import('axios').AxiosInstance;
  authenticated: boolean;
}

export async function createAuthenticatedClient(username: string, password: string): Promise<AuthenticatedClient> {
  const jar = new CookieJar();
  // Use proxy only on Vercel (production)
  const isVercel = !!process.env.VERCEL;
  const axiosConfig: import('axios').AxiosRequestConfig = { jar, timeout: 15000 };
  if (isVercel) {
    axiosConfig.proxy = {
      host: '196.115.252.173',
      port: 3000,
    };
  }
  const client = wrapper(axios.create(axiosConfig));

  try {
    // Get CSRF token
    const tokenPage = await client.get('https://massarservice.men.gov.ma/moutamadris/Account');
    const $ = load(tokenPage.data);
    const token = $('input[name="__RequestVerificationToken"]').val();

    if (!token) {
      throw new Error('Failed to retrieve CSRF token');
    }

    // Login
    const loginPayload = new URLSearchParams({
      UserName: username,
      Password: password,
      __RequestVerificationToken: token as string
    }).toString();

    const loginRes = await client.post(
      'https://massarservice.men.gov.ma/moutamadris/Account',
      loginPayload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': 'https://massarservice.men.gov.ma/moutamadris/Account',
          'Origin': 'https://massarservice.men.gov.ma',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    if (!loginRes.data.includes('ChangePassword')) {
      throw new Error('Login failed');
    }

    // Set culture to English
    await client.post('https://massarservice.men.gov.ma/moutamadris/General/SetCulture?culture=en', null);

    return { client, authenticated: true };
  } catch (error: any) {
    if (error.code === 'ENOTFOUND' && error.hostname === 'massarservice.men.gov.ma') {
      throw new Error('Cannot connect to MoutaMadris service. This application only works from Morocco due to geo-restrictions.');
    }
    throw error;
  }
}

export function getStandardHeaders() {
  return {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': 'https://massarservice.men.gov.ma/moutamadris/TuteurEleves',
    'Origin': 'https://massarservice.men.gov.ma',
    'User-Agent': 'Mozilla/5.0'
  };
}