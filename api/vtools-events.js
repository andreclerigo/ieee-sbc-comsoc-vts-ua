const upstreamUrl = 'https://events.vtools.ieee.org/RST/events/api/public/v7/events/list';

function appendQuery(params, query = {}) {
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (value !== undefined && value !== null) {
      params.set(key, value);
    }
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const params = new URLSearchParams();
  appendQuery(params, req.query);

  if (!params.has('limit')) {
    params.set('limit', '1000');
  }

  if (!params.has('spoids') && !params.has('id')) {
    params.set('spoids', 'R80045');
  }

  try {
    const response = await fetch(`${upstreamUrl}?${params.toString()}`, {
      headers: {
        Accept: 'application/vnd.api+json, application/json'
      }
    });
    const body = await response.text();

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.status(response.status).send(body);
  } catch {
    res.status(502).json({ error: 'Unable to load vTools events' });
  }
}
