export const links = {
  email: 'mailto:comsoc.vts@ieee.ua.pt',
  ieeeOrg: 'https://www.ieee.org/',
  xplore: 'https://ieeexplore.ieee.org/Xplore/home.jsp',
  standards: 'https://standards.ieee.org/',
  spectrum: 'https://spectrum.ieee.org/',
  moreSites: 'https://www.ieee.org/sitemap.html',
  ieeeUa: 'https://ieee.web.ua.pt/',
  ieeeUaAlt: 'https://ua.ieee-pt.org/',
  instagram: 'https://www.instagram.com/ieeeuasbpt/',
  facebook: 'https://www.facebook.com/ieeeuasbpt/',
  linkedinChapter: 'https://www.linkedin.com/in/sbc-comsoc-vts-ua-2a2391416/',
  linkedinSb: 'https://pt.linkedin.com/company/ieeeuasbpt',
  youtube: 'https://www.youtube.com/@ieeeuasbpt',
  comsocPt: 'https://webinabox.vtools.ieee.org/wibp_home/index/CH08445',
  comsocCalendar: 'https://webinabox.vtools.ieee.org/wibp_calendar/index/CH08445',
  vtsPt: 'https://webinabox.vtools.ieee.org/wibp_home/index/CH08471',
  vtsCalendar: 'https://webinabox.vtools.ieee.org/wibp_calendar/index/CH08471',
  portugalMeetings: 'https://events.vtools.ieee.org/meetings/R80045/-0/365',
  vtoolsApi: 'https://events.vtools.ieee.org/api/doc/events',
  ua: 'https://www.ua.pt/',
  it: 'https://www.it.pt/ITSites/Index/3'
};

const publicBaseUrl = import.meta.env?.BASE_URL || '/';
const publicUrl = (path) => `${publicBaseUrl}${path.replace(/^\/+/, '')}`;

export const logoUrls = {
    chapter: publicUrl("assets/logos/chapter-logo.png"),
    chapterWhite: publicUrl("assets/logos/chapter-logo-white.png"),
    sbAveiro: "https://ua.ieee-pt.org/logos/full_white_logo.png",
    ieee: "https://vtsociety.org/themes/custom/catalyze_tw/ieee-logo.png",
    ua: publicUrl("assets/logos/ua.png"),
    it: publicUrl("assets/logos/it.png"),
    comsoc: publicUrl("assets/logos/comsoc.png"),
    vts: publicUrl("assets/logos/vts.png"),
    fernandoVelez: publicUrl("assets/fernando-velez.jpg"),
    favicon: "https://ua.ieee-pt.org/logos/favicon.png",
    uaCarousel1:
        "https://ehprysebdahhtcqlszez.supabase.co/storage/v1/object/public/uploads/carousel/1760352376997-101154350.png",
    uaCarousel2:
        "https://ehprysebdahhtcqlszez.supabase.co/storage/v1/object/public/uploads/carousel/1760352392493-290159118.png",
    shareToy:
        "https://ehprysebdahhtcqlszez.supabase.co/storage/v1/object/public/uploads/events/1761591441841-851709320.jpg",
    thinkTank:
        "https://ehprysebdahhtcqlszez.supabase.co/storage/v1/object/public/uploads/events/1761566537683-219762464.png",
    microRato:
        "https://ehprysebdahhtcqlszez.supabase.co/storage/v1/object/public/uploads/events/1761591460823-396042426.png",
    leadershipCamp:
        "https://ehprysebdahhtcqlszez.supabase.co/storage/v1/object/public/uploads/events/1761566591924-356583323.jpg",
};

export const photoAlbums = {
  openNetworking: {
    href: 'https://photos.andreclerigo.com/share/3jYpcz-O5GFljeb_FfDGWjLRDg2VrBRkA2LR6CXBhBlZW3UtICQjkLoRb_7QLZ5Vka0',
    thumbnail: 'https://photos.andreclerigo.com/api/assets/9812f983-fc5b-4662-8609-1b35c8db3440/thumbnail?key=3jYpcz-O5GFljeb_FfDGWjLRDg2VrBRkA2LR6CXBhBlZW3UtICQjkLoRb_7QLZ5Vka0'
  },
  e2eSlicing: {
    href: 'https://photos.andreclerigo.com/share/PemSVSCWbqWnucLhBYh6mdJnyBVPnwte4OP1pRBX1m5XD5f7z3i3cyWgOEgwDzuyHlo',
    thumbnail: 'https://photos.andreclerigo.com/api/assets/4f122e36-b15e-448f-b3d5-27179e0deeeb/thumbnail?key=PemSVSCWbqWnucLhBYh6mdJnyBVPnwte4OP1pRBX1m5XD5f7z3i3cyWgOEgwDzuyHlo'
  }
};

export const languageOptions = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' }
];

export const vtoolsConfig = {
  snapshotEndpoint: publicUrl('data/vtools-snapshot.json'),
  endpoint: '/vtools-events-list',
  directEndpoint: 'https://events.vtools.ieee.org/RST/events/api/public/v7/events/list',
  meetingsEndpoint: '/api/vtools-meetings',
  directMeetingsEndpoint: 'https://events.vtools.ieee.org/meetings/R80045/-0/365',
  sectionSpoid: 'R80045',
  chapterSpoids: ['CH08445', 'CH08471'],
  sourceLabels: {
    CH08445: 'ComSoc Portugal',
    CH08471: 'VTS Portugal'
  }
};
