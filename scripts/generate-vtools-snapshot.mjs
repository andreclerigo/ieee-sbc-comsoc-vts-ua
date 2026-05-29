import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { vtoolsConfig } from '../src/content/shared.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const snapshotPath = resolve(__dirname, '../public/data/vtools-snapshot.json');
const meetingDetailLimit = 20;
const eventSnapshotLimit = 50;
const requestTimeoutMs = 25_000;

const errors = [];

function appendQuery(url, query = {}) {
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, item));
    } else if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function capture(label, task, fallback) {
  try {
    return await task();
  } catch (error) {
    errors.push({
      label,
      message: error instanceof Error ? error.message : String(error)
    });
    return fallback;
  }
}

async function fetchJson(query, label) {
  const url = new URL(vtoolsConfig.directEndpoint);
  appendQuery(url, query);

  const response = await fetchWithTimeout(url, {
    headers: {
      Accept: 'application/vnd.api+json, application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`${label} responded with ${response.status}`);
  }

  return response.json();
}

async function fetchText(url, label) {
  const response = await fetchWithTimeout(url, {
    headers: {
      Accept: 'text/html'
    }
  });

  if (!response.ok) {
    throw new Error(`${label} responded with ${response.status}`);
  }

  return response.text();
}

function eventStartTime(event = {}) {
  return event.attributes?.['start-time'] || '';
}

function uniqueEvents(events = [], sortDirection = 'asc') {
  const byId = new Map();

  events.forEach((event) => {
    if (event?.id) {
      byId.set(String(event.id), event);
    }
  });

  return Array.from(byId.values()).sort((first, second) => {
    const firstTime = eventStartTime(first);
    const secondTime = eventStartTime(second);

    return sortDirection === 'desc'
      ? secondTime.localeCompare(firstTime)
      : firstTime.localeCompare(secondTime);
  });
}

function parseMeetingIds(html = '') {
  const ids = new Set();
  const pattern = /href=["'][^"']*\/m\/(\d+)/g;
  let match = pattern.exec(html);

  while (match) {
    ids.add(match[1]);
    match = pattern.exec(html);
  }

  return Array.from(ids).slice(0, meetingDetailLimit);
}

async function fetchEventDetail(id) {
  const detail = await fetchJson({ id, limit: '1' }, `vTools event ${id}`);
  return detail.data?.[0] || null;
}

async function main() {
  const meetingsHtml = await capture(
    'meetings feed',
    () => fetchText(vtoolsConfig.directMeetingsEndpoint, 'vTools meetings feed'),
    ''
  );

  const meetingIds = parseMeetingIds(meetingsHtml);
  const meetingEvents = await capture(
    'meeting event details',
    async () => {
      const details = [];

      for (const id of meetingIds) {
        const event = await capture(`meeting event ${id}`, () => fetchEventDetail(id), null);
        if (event) {
          details.push(event);
        }
      }

      return uniqueEvents(details).slice(0, eventSnapshotLimit);
    },
    []
  );

  const chapterEventResults = await Promise.all(
    vtoolsConfig.chapterSpoids.map((spoid) => capture(
      `chapter events ${spoid}`,
      () => fetchJson({
        limit: '1000',
        sort: 'start-time',
        span: 'now~',
        spoids: spoid
      }, `vTools chapter events ${spoid}`),
      { data: [] }
    ))
  );

  const chapterEvents = uniqueEvents(
    chapterEventResults.flatMap((result) => result.data || [])
  ).slice(0, eventSnapshotLimit);

  const recent = await capture(
    'recent section events',
    () => fetchJson({
      limit: '1000',
      span: '~now',
      sort: '-start-time',
      spoids: vtoolsConfig.sectionSpoid
    }, 'vTools recent section events'),
    { data: [] }
  );

  const snapshot = {
    generatedAt: new Date().toISOString(),
    sources: {
      meetings: vtoolsConfig.directMeetingsEndpoint,
      events: vtoolsConfig.directEndpoint,
      sectionSpoid: vtoolsConfig.sectionSpoid,
      chapterSpoids: vtoolsConfig.chapterSpoids
    },
    meetingsHtml,
    meetingEvents,
    chapterEvents,
    recentEvents: uniqueEvents(recent.data || [], 'desc').slice(0, eventSnapshotLimit),
    errors
  };

  await mkdir(dirname(snapshotPath), { recursive: true });
  await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`);

  const summary = [
    `${meetingEvents.length} meeting event details`,
    `${chapterEvents.length} chapter events`,
    `${snapshot.recentEvents.length} recent events`
  ].join(', ');

  console.log(`Generated ${snapshotPath} (${summary}).`);

  if (errors.length > 0) {
    console.warn(`vTools snapshot generated with ${errors.length} warning(s).`);
  }
}

main().catch(async (error) => {
  errors.push({
    label: 'snapshot',
    message: error instanceof Error ? error.message : String(error)
  });

  await mkdir(dirname(snapshotPath), { recursive: true });
  await writeFile(snapshotPath, `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    sources: {
      meetings: vtoolsConfig.directMeetingsEndpoint,
      events: vtoolsConfig.directEndpoint,
      sectionSpoid: vtoolsConfig.sectionSpoid,
      chapterSpoids: vtoolsConfig.chapterSpoids
    },
    meetingsHtml: '',
    meetingEvents: [],
    chapterEvents: [],
    recentEvents: [],
    errors
  }, null, 2)}\n`);

  console.warn(`Generated empty vTools snapshot after error: ${errors.at(-1).message}`);
});
