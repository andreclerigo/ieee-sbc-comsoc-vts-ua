import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Images,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Rss,
  X
} from 'lucide-react';
import enContent from './content/en.js';
import ptContent from './content/pt.js';
import { languageOptions, links, logoUrls, vtoolsConfig } from './content/shared.js';

const pageContent = {
  pt: ptContent,
  en: enContent
};

const vtoolsResultLimit = 10;
const isLocalDevHost =
  import.meta.env.DEV &&
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
}

function eventHosts(attributes = {}) {
  const primaryHost = attributes['primary-host'] ? [attributes['primary-host']] : [];
  const cohosts = Array.isArray(attributes.cohosts) ? attributes.cohosts : [];

  return [...primaryHost, ...cohosts];
}

function chapterSpoidsForEvent(attributes = {}) {
  const hosts = eventHosts(attributes);

  return vtoolsConfig.chapterSpoids.filter((spoid) => hosts.some((host) => host?.spoid === spoid));
}

function isChapterEvent(attributes = {}) {
  return chapterSpoidsForEvent(attributes).length > 0;
}

function sourceForEvent(attributes = {}, fallbackSource = 'vTools Portugal') {
  const sourceLabels = chapterSpoidsForEvent(attributes).map((spoid) => vtoolsConfig.sourceLabels[spoid]);

  return sourceLabels.length > 0 ? sourceLabels.join(' + ') : fallbackSource;
}

function textFromHtml(value = '') {
  if (!value) {
    return '';
  }

  if (typeof DOMParser !== 'undefined') {
    const parsed = new DOMParser().parseFromString(value, 'text/html');
    return parsed.body.textContent || '';
  }

  return value.replace(/<[^>]*>/g, ' ');
}

function compactText(value, maxLength = 280) {
  const normalized = textFromHtml(value).replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).replace(/\s+\S*$/, '')}...`;
}

function formatEventDate(value, language, timeZone = 'Europe/Lisbon') {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat(language === 'pt' ? 'pt-PT' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone
  }).format(new Date(value));
}

function eventPlace(attributes = {}, labels) {
  const physicalPlace = [attributes.building, attributes.city].filter(Boolean).join(' / ');

  if (attributes.virtual && physicalPlace) {
    return `${labels.online} / ${physicalPlace}`;
  }

  if (attributes.virtual) {
    return labels.online;
  }

  return physicalPlace || attributes['primary-host']?.name || labels.online;
}

function normalizeVtoolsEvent(event, language, labels, fallback = {}) {
  const attributes = event.attributes || {};
  const description = compactText(attributes.description || attributes.header || fallback.description || '');

  return {
    id: event.id || fallback.id,
    source: sourceForEvent(attributes, fallback.source),
    date: formatEventDate(attributes['start-time'], language, attributes['time-zone']?.name) || fallback.date,
    title: attributes.title || fallback.title,
    place: Object.keys(attributes).length > 0 ? eventPlace(attributes, labels) : fallback.place || labels.online,
    description: description || labels.noDescription,
    href: attributes.link || fallback.href || `https://events.vtools.ieee.org/m/${event.id || fallback.id}`
  };
}

function normalizeFallbackEvent(entry, labels) {
  return {
    id: entry.id,
    source: entry.source,
    date: entry.date,
    title: entry.title,
    place: labels.online,
    description: labels.noDescription,
    href: entry.href
  };
}

async function fetchVtoolsList(query) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, value);
    }
  });

  const load = async (endpoint) => {
    const response = await fetch(`${endpoint}?${params.toString()}`, {
      headers: {
        Accept: 'application/vnd.api+json, application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`vTools responded with ${response.status}`);
    }

    return response.json();
  };

  try {
    return await load(vtoolsConfig.endpoint);
  } catch (error) {
    if (isLocalDevHost) {
      return load(vtoolsConfig.directEndpoint);
    }

    throw error;
  }
}

async function fetchMeetingsFeed() {
  const load = async (endpoint) => {
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'text/html'
      }
    });

    if (!response.ok) {
      throw new Error(`vTools meetings feed responded with ${response.status}`);
    }

    return response.text();
  };

  try {
    return await load(vtoolsConfig.meetingsEndpoint);
  } catch (error) {
    if (isLocalDevHost) {
      return load(vtoolsConfig.directMeetingsEndpoint);
    }

    throw error;
  }
}

async function fetchStaticVtoolsSnapshot() {
  const response = await fetch(vtoolsConfig.snapshotEndpoint, {
    headers: {
      Accept: 'application/json'
    },
    cache: 'no-cache'
  });

  if (!response.ok) {
    throw new Error(`vTools snapshot responded with ${response.status}`);
  }

  return response.json();
}

function parseMeetingsFeed(html) {
  if (!html || typeof DOMParser === 'undefined') {
    return [];
  }

  const document = new DOMParser().parseFromString(html, 'text/html');
  return Array.from(document.querySelectorAll('tr'))
    .map((row) => {
      const link = row.querySelector('a[href*="/m/"]');
      const dateNode = row.querySelector('span[title]');

      if (!link || !dateNode) {
        return null;
      }

      const id = link.href.match(/\/m\/(\d+)/)?.[1];

      if (!id) {
        return null;
      }

      return {
        id,
        source: 'vTools Portugal',
        date: dateNode.textContent.replace(/\s+/g, ' ').trim(),
        title: link.textContent.replace(/\s+/g, ' ').trim(),
        href: link.href
      };
    })
    .filter(Boolean);
}

async function fetchEventDetail(id) {
  const detail = await fetchVtoolsList({ id, limit: '1' });
  return detail.data?.[0] || null;
}

async function fetchChapterEvents() {
  const results = await Promise.all(
    vtoolsConfig.chapterSpoids.map((spoid) => fetchVtoolsList({
      limit: '1000',
      sort: 'start-time',
      span: 'now~',
      spoids: spoid
    }).catch(() => ({ data: [] })))
  );

  return results.flatMap((result) => result.data || []);
}

function mergeEventSources(feedEntries, chapterEvents) {
  const byId = new Map();

  feedEntries.forEach((entry) => {
    byId.set(entry.id, { id: entry.id, fallback: entry });
  });

  chapterEvents.forEach((event) => {
    const current = byId.get(event.id) || { id: event.id };
    byId.set(event.id, {
      ...current,
      event
    });
  });

  return Array.from(byId.values()).slice(0, vtoolsResultLimit);
}

async function normalizeEventRefs(eventRefs, language, labels, options = {}) {
  const { fetchMissingDetails = false } = options;

  return Promise.all(
    eventRefs.map(async (eventRef) => {
      if (eventRef.event) {
        return normalizeVtoolsEvent(eventRef.event, language, labels, eventRef.fallback);
      }

      if (fetchMissingDetails) {
        try {
          const detail = await fetchEventDetail(eventRef.id);
          return detail
            ? normalizeVtoolsEvent(detail, language, labels, eventRef.fallback)
            : normalizeFallbackEvent(eventRef.fallback, labels);
        } catch {
          return normalizeFallbackEvent(eventRef.fallback, labels);
        }
      }

      return normalizeFallbackEvent(eventRef.fallback, labels);
    })
  );
}

async function loadRuntimeEvents(language, labels) {
  const [meetingsHtml, chapterEvents] = await Promise.all([
    fetchMeetingsFeed(),
    fetchChapterEvents()
  ]);
  const feedEntries = parseMeetingsFeed(meetingsHtml);
  let status = 'ready';
  let eventRefs = mergeEventSources(feedEntries, chapterEvents);

  if (eventRefs.length === 0) {
    const recent = await fetchVtoolsList({
      limit: '1000',
      span: '~now',
      sort: '-start-time',
      spoids: vtoolsConfig.sectionSpoid
    });
    const recentEvents = (recent.data || []).filter((event) => isChapterEvent(event.attributes)).slice(0, vtoolsResultLimit);
    eventRefs = recentEvents.map((event) => ({ id: event.id, event }));
    status = eventRefs.length > 0 ? 'recent' : 'empty';
  }

  return {
    status,
    events: await normalizeEventRefs(eventRefs, language, labels, { fetchMissingDetails: true })
  };
}

async function loadSnapshotEvents(language, labels) {
  const snapshot = await fetchStaticVtoolsSnapshot();
  const feedEntries = parseMeetingsFeed(snapshot.meetingsHtml);
  const detailedEvents = [
    ...(Array.isArray(snapshot.meetingEvents) ? snapshot.meetingEvents : []),
    ...(Array.isArray(snapshot.chapterEvents) ? snapshot.chapterEvents : [])
  ];
  let status = 'ready';
  let eventRefs = mergeEventSources(feedEntries, detailedEvents);

  if (eventRefs.length === 0 && detailedEvents.length > 0) {
    eventRefs = detailedEvents.slice(0, vtoolsResultLimit).map((event) => ({ id: event.id, event }));
  }

  if (eventRefs.length === 0) {
    const recentEvents = (Array.isArray(snapshot.recentEvents) ? snapshot.recentEvents : [])
      .filter((event) => isChapterEvent(event.attributes))
      .slice(0, vtoolsResultLimit);

    eventRefs = recentEvents.map((event) => ({ id: event.id, event }));
    status = eventRefs.length > 0 ? 'recent' : 'empty';
  }

  return {
    status,
    events: await normalizeEventRefs(eventRefs, language, labels)
  };
}

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="mb-2 text-sm font-bold uppercase text-[#00629B]">{eyebrow}</p>
      <h2 className="text-3xl font-bold text-[#1f2937] md:text-4xl">{title}</h2>
      {children ? <p className="mt-4 text-base leading-7 text-slate-600">{children}</p> : null}
    </div>
  );
}

function CardLink({ href, children, className = '' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-[#00629B] transition hover:border-[#00629B] hover:bg-[#00629B] hover:text-white ${className}`}
    >
      {children}
    </a>
  );
}

function LanguageToggle({ currentLanguage, label, onChange, tone = 'dark' }) {
  const wrapperClass = tone === 'light'
    ? 'border-slate-300 bg-slate-100'
    : 'border-white/35 bg-white/10';

  return (
    <div className={`flex shrink-0 rounded-md border p-0.5 ${wrapperClass}`} aria-label={label} role="group">
      {languageOptions.map((option) => {
        const active = currentLanguage === option.code;
        const buttonClass = active
          ? tone === 'light'
            ? 'bg-[#00629B] text-white shadow-sm'
            : 'bg-white text-[#00629B] shadow-sm'
          : tone === 'light'
            ? 'text-slate-700 hover:bg-white'
            : 'text-white hover:bg-white/15';

        return (
          <button
            key={option.code}
            type="button"
            onClick={() => onChange(option.code)}
            className={`min-w-8 rounded px-2 py-1.5 text-xs font-bold uppercase leading-none transition ${buttonClass}`}
            aria-pressed={active}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function PartnerLogo({ src, alt }) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  if (!currentSrc) {
    return null;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className="h-full w-full object-contain object-center"
      loading="lazy"
      decoding="async"
      onError={() => setCurrentSrc('')}
    />
  );
}

function PersonPhoto({ person }) {
  const [currentSrc, setCurrentSrc] = useState(person.photoUrl);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (person.photoUrl) {
      setCurrentSrc(person.photoUrl);
      return;
    }

    const linkedinUsername = person.linkedin ? person.linkedin.match(/\/in\/([^/?]+)/)?.[1] : null;
    if (!linkedinUsername) {
      setFailed(true);
      return;
    }

    fetch(`https://unavatar.io/linkedin/${linkedinUsername}?json`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data?.url && !data.url.includes('static.licdn.com/aero-v1/sc/h/')) {
          setCurrentSrc(data.url);
        } else {
          setFailed(true);
        }
      })
      .catch(() => {
        if (mounted) setFailed(true);
      });

    return () => {
      mounted = false;
    };
  }, [person.photoUrl, person.linkedin]);

  if (failed || !currentSrc) {
    return (
      <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
        {initials(person.name)}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={person.name}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export default function App() {
  const [language, setLanguage] = useState('pt');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [vtoolsState, setVtoolsState] = useState({ status: 'loading', events: [] });
  const content = pageContent[language];
  const currentPhoto = content.eventPhotos[activePhoto];
  const highlightedEventIds = new Set(
    content.chapterEvents
      .map((event) => event.vtoolsId)
      .filter(Boolean)
      .map(String)
  );
  const networkEvents = vtoolsState.events.filter((event) => !highlightedEventIds.has(String(event.id || '')));

  useEffect(() => {
    document.documentElement.lang = content.htmlLang;
    document.title = content.metaTitle;
  }, [content]);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setVtoolsState({ status: 'loading', events: [] });

      try {
        let nextState;

        try {
          nextState = isLocalDevHost
            ? await loadRuntimeEvents(language, content.events)
            : await loadSnapshotEvents(language, content.events);
        } catch (error) {
          if (isLocalDevHost) {
            throw error;
          }

          nextState = await loadRuntimeEvents(language, content.events);
        }

        if (!cancelled) {
          setVtoolsState(nextState);
        }
      } catch {
        if (!cancelled) {
          setVtoolsState({ status: 'error', events: [] });
        }
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, [content.events, language]);

  const nextPhoto = () => setActivePhoto((value) => (value + 1) % content.eventPhotos.length);
  const previousPhoto = () => setActivePhoto((value) => (value - 1 + content.eventPhotos.length) % content.eventPhotos.length);

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="hidden bg-[#111827] text-xs text-slate-200 lg:block">
          <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-5 lg:px-8">
            <nav className="flex h-full items-center gap-6">
              <a href={links.ieeeOrg} target="_blank" rel="noreferrer" className="hover:text-white">IEEE.org</a>
              <a href={links.xplore} target="_blank" rel="noreferrer" className="hover:text-white">IEEE Xplore Digital Library</a>
              <a href={links.standards} target="_blank" rel="noreferrer" className="hover:text-white">IEEE Standards</a>
              <a href={links.spectrum} target="_blank" rel="noreferrer" className="hover:text-white">IEEE Spectrum</a>
              <a href={links.moreSites} target="_blank" rel="noreferrer" className="hover:text-white">More Sites</a>
            </nav>
            <a href={links.ieeeOrg} target="_blank" rel="noreferrer" aria-label="IEEE">
              <img src={logoUrls.ieee} alt="IEEE" className="h-7 w-auto" />
            </a>
          </div>
        </div>

        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-2 px-4 sm:px-5 lg:px-8">
            <a href="#topo" className="flex min-w-0 items-center gap-3" onClick={() => setMobileOpen(false)}>
              <img src={logoUrls.chapter} alt={content.header.logoAlt} className="h-11 w-auto max-w-[170px] object-contain sm:h-14 sm:max-w-[245px]" />
              <span className="sr-only">{content.header.logoAlt}</span>
            </a>

            <nav className="hidden items-center gap-1 md:flex">
              {content.navItems.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#00629B]">
                  {label}
                </a>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <LanguageToggle currentLanguage={language} label={content.header.languageLabel} onChange={setLanguage} tone="light" />
              <a href={links.email} className="hidden items-center gap-2 rounded-md bg-[#00629B] px-4 py-2 text-sm font-bold text-white hover:bg-[#005587] sm:inline-flex">
                <Mail className="h-4 w-4" /> {content.header.contact}
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                className="rounded-md border border-slate-300 p-2 text-slate-700 md:hidden"
                aria-label={mobileOpen ? content.header.closeMenu : content.header.openMenu}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen ? (
          <nav className="border-b border-slate-200 bg-white px-5 py-4 text-slate-800 md:hidden">
            <div className="mx-auto grid max-w-7xl gap-1">
              {content.navItems.map(([id, label]) => (
                <a key={id} href={`#${id}`} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-3 font-semibold hover:bg-slate-100 hover:text-[#00629B]">
                  {label}
                </a>
              ))}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-200 pt-3 text-xs font-semibold text-slate-500">
                <a href={links.ieeeOrg} target="_blank" rel="noreferrer" className="hover:text-[#00629B]">IEEE.org</a>
                <a href={links.xplore} target="_blank" rel="noreferrer" className="hover:text-[#00629B]">IEEE Xplore</a>
                <a href={links.standards} target="_blank" rel="noreferrer" className="hover:text-[#00629B]">IEEE Standards</a>
                <a href={links.spectrum} target="_blank" rel="noreferrer" className="hover:text-[#00629B]">IEEE Spectrum</a>
                <a href={links.moreSites} target="_blank" rel="noreferrer" className="hover:text-[#00629B]">More Sites</a>
              </div>
            </div>
          </nav>
        ) : null}
      </header>

      <section id="topo" className="border-b border-slate-200 bg-[#f5f7fa]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-bold uppercase text-[#00629B]">{content.hero.eyebrow}</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-[#1f2937] md:text-5xl">
              {content.hero.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              {content.hero.text}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#eventos" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#00629B] px-5 py-3 font-bold text-white hover:bg-[#005587]">
                {content.hero.eventsCta} <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#galeria" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 font-bold text-slate-800 hover:border-[#00629B] hover:text-[#00629B]">
                {content.hero.galleryCta} <Images className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="relative min-h-[340px] overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
            <img src={currentPhoto.image} alt={currentPhoto.title} className="h-full min-h-[340px] w-full object-cover opacity-85" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-6 text-white">
              <p className="text-sm font-bold uppercase">{currentPhoto.label}</p>
              <h2 className="mt-1 text-2xl font-bold">{currentPhoto.title}</h2>
            </div>
            <div className="absolute right-4 top-4 flex gap-2">
              <button type="button" onClick={previousPhoto} className="rounded-md bg-white/90 p-2 text-slate-900 hover:bg-white" aria-label={content.hero.previousPhoto}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={nextPhoto} className="rounded-md bg-white/90 p-2 text-slate-900 hover:bg-white" aria-label={content.hero.nextPhoto}>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="mb-2 text-sm font-bold uppercase text-[#00629B]">{content.about.eyebrow}</p>
            <h2 className="text-3xl font-bold text-[#1f2937] md:text-4xl">{content.about.title}</h2>
            <p className="mt-5 leading-8 text-slate-700">
              {content.about.text}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {content.stats.map(([value, label]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-2xl font-bold text-[#00629B]">{value}</p>
                <p className="mt-2 text-sm text-slate-600">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {content.partners.map((partner) => (
            <a key={partner.name} href={partner.href} target="_blank" rel="noreferrer" className="rounded-md border border-slate-200 bg-white p-5 transition hover:border-[#00629B] hover:shadow-sm">
              <div className="mb-5 flex h-20 items-center border-b border-slate-200 pb-4">
                <PartnerLogo src={partner.logo} alt={partner.logoAlt} />
              </div>
              <h3 className="font-bold text-[#1f2937]">{partner.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{partner.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#00629B]">
                {content.about.openLabel} <ExternalLink className="h-4 w-4" />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section id="eventos" className="border-y border-slate-200 bg-slate-50 px-5 py-14 lg:px-8">
        <SectionHeading eyebrow={content.events.eyebrow} title={content.events.title}>
          {content.events.text}
        </SectionHeading>

        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {content.chapterEvents.map((event) => (
            <article key={event.title} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <img src={event.image} alt={event.title} className="h-44 w-full object-cover" />
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded bg-[#00629B]/10 px-2 py-1 text-xs font-bold uppercase text-[#00629B]">{event.source}</span>
                  <span className="text-sm font-semibold text-slate-500">{event.date}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1f2937]">{event.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{event.text}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <MapPin className="h-4 w-4 text-[#00629B]" /> {event.place}
                </p>
                {event.href ? (
                  <a href={event.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-[#00629B] hover:border-[#00629B] hover:bg-[#00629B] hover:text-white">
                    <ExternalLink className="h-4 w-4" /> {content.events.openEvent}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-7xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase text-[#00629B]">{content.events.networkEyebrow}</p>
              <h3 className="mt-1 text-2xl font-bold text-[#1f2937]">{content.events.networkTitle}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{content.events.networkText}</p>
            </div>
            <CalendarDays className="h-8 w-8 shrink-0 text-[#00629B]" />
          </div>

          <div className="divide-y divide-slate-200">
            {vtoolsState.status === 'loading' ? (
              <p className="py-5 text-sm font-semibold text-slate-600">{content.events.loading}</p>
            ) : null}
            {vtoolsState.status === 'error' ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{content.events.error}</p>
            ) : null}
            {vtoolsState.status === 'empty' ? (
              <p className="py-5 text-sm font-semibold text-slate-600">{content.events.empty}</p>
            ) : null}
            {vtoolsState.status === 'recent' ? (
              <p className="py-4 text-sm font-semibold text-slate-600">{content.events.recentNotice}</p>
            ) : null}
            {!['loading', 'error', 'empty'].includes(vtoolsState.status) && networkEvents.length === 0 ? (
              <p className="py-5 text-sm font-semibold text-slate-600">{content.events.networkEmpty}</p>
            ) : null}
            {networkEvents.map((event) => (
              <a key={event.href} href={event.href} target="_blank" rel="noreferrer" className="grid gap-3 py-5 transition hover:bg-slate-50 md:grid-cols-[8rem_1fr_auto] md:px-2">
                <div>
                  <p className="text-sm font-bold text-[#00629B]">{event.date}</p>
                  <p className="text-xs text-slate-500">{event.source}</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#1f2937]">{event.title}</h4>
                  <p className="mt-1 text-sm text-slate-500">{event.place}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{event.description}</p>
                </div>
                <ExternalLink className="h-5 w-5 self-center text-slate-400" />
              </a>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <CardLink href={links.comsocCalendar}>
              <CalendarDays className="h-4 w-4" /> {content.events.openComsocCalendar}
            </CardLink>
            <CardLink href={links.vtsCalendar}>
              <CalendarDays className="h-4 w-4" /> {content.events.openVtsCalendar}
            </CardLink>
            <CardLink href={links.vtoolsApi}>
              <Rss className="h-4 w-4" /> {content.events.openApi}
            </CardLink>
          </div>
        </div>
      </section>

      <section id="galeria" className="px-5 py-14 lg:px-8">
        <SectionHeading eyebrow={content.gallery.eyebrow} title={content.gallery.title}>
          {content.gallery.text}
        </SectionHeading>
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {content.eventPhotos.map((photo, index) => (
            <button
              key={photo.title}
              type="button"
              onClick={() => setActivePhoto(index)}
              className={`group overflow-hidden rounded-lg border bg-white text-left shadow-sm transition ${activePhoto === index ? 'border-[#00629B]' : 'border-slate-200 hover:border-[#00629B]'}`}
            >
              <img src={photo.image} alt={photo.title} className="h-48 w-full object-cover transition group-hover:scale-[1.03]" />
              <div className="p-4">
                <p className="text-xs font-bold uppercase text-[#00629B]">{photo.label}</p>
                <h3 className="mt-1 font-bold text-[#1f2937]">{photo.title}</h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="equipa" className="border-y border-slate-200 bg-slate-50 px-5 py-14 lg:px-8">
        <SectionHeading eyebrow={content.team.eyebrow} title={content.team.title}>
          {content.team.text}
        </SectionHeading>
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {content.team.people.map((person) => (
            <article key={person.name} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="h-24 w-24 overflow-hidden rounded-lg bg-[#00629B]">
                <PersonPhoto person={person} />
              </div>
              <p className="mt-5 text-sm font-bold uppercase text-[#00629B]">{person.role}</p>
              <h3 className="mt-1 text-xl font-bold text-[#1f2937]">{person.name}</h3>
              <p className="mt-2 text-sm font-semibold text-slate-600">{person.area}</p>
              <p className="mt-4 min-h-24 text-sm leading-6 text-slate-600">{person.focus}</p>
              {person.linkedin ? (
                <a href={person.linkedin} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-[#00629B] hover:border-[#00629B] hover:bg-[#00629B] hover:text-white">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section id="contactos" className="px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-lg border border-slate-200 bg-[#00629B] p-8 text-white md:grid-cols-[1fr_auto] md:p-10">
          <div>
            <p className="text-sm font-bold uppercase">{content.contacts.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-bold">{content.contacts.title}</h2>
            <p className="mt-4 max-w-3xl leading-7 text-white/85">
              {content.contacts.text}
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row md:flex-col">
            <a href={links.email} className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 font-bold text-[#00629B] hover:bg-slate-100">
              <Mail className="h-4 w-4" /> Email
            </a>
            <a href={links.linkedinChapter} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-5 py-3 font-bold text-white hover:bg-white/10">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>{content.footer.copyright}</p>
          <div className="flex flex-wrap gap-4 font-semibold">
            <a href={links.ieeeUaAlt} target="_blank" rel="noreferrer" className="hover:text-[#00629B]">IEEE UA SB</a>
            <a href={links.comsocPt} target="_blank" rel="noreferrer" className="hover:text-[#00629B]">ComSoc PT</a>
            <a href={links.vtsPt} target="_blank" rel="noreferrer" className="hover:text-[#00629B]">VTS PT</a>
            <a href={links.it} target="_blank" rel="noreferrer" className="hover:text-[#00629B]">IT-Aveiro</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
