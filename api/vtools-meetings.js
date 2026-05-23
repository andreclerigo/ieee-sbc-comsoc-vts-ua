const upstreamUrl = 'https://events.vtools.ieee.org/meetings/R80045/-0/365';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  try {
    const response = await fetch(upstreamUrl, {
      headers: {
        Accept: 'text/html'
      }
    });
    const body = await response.text();

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'text/html');
    res.status(response.status).send(body);
  } catch {
    res.status(502).send('Unable to load vTools meetings feed');
  }
}
