
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const GITHUB_USERNAME = 'antonvice';
const GH_TOKEN = process.env.GH_TOKEN;

async function testFetch() {
  console.log('Username:', GITHUB_USERNAME);
  console.log('Token defined:', !!GH_TOKEN);
  if (GH_TOKEN) {
    console.log('Token starts with:', GH_TOKEN.substring(0, 10));
  }

  try {
    const response = await axios.get(`https://api.github.com/users/${GITHUB_USERNAME}/repos`, {
      params: {
        per_page: 10,
        page: 1,
        sort: 'updated',
        direction: 'desc'
      },
      headers: GH_TOKEN ? {
        Authorization: `token ${GH_TOKEN}`
      } : {}
    });

    console.log('Successfully fetched', response.data.length, 'repos');
    if (response.data.length > 0) {
      console.log('First repo:', response.data[0].name);
    }
  } catch (error) {
    console.error('Error fetching repos:', error.response?.data || error.message);
  }
}

testFetch();
