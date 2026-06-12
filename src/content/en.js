import { links, logoUrls } from './shared.js';

const en = {
    htmlLang: "en",
    metaTitle: "IEEE ComSoc/VTS UA",
    header: {
        logoAlt: "IEEE ComSoc/VTS UA",
        contact: "Contact",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        languageLabel: "Select language",
    },
    navItems: [
        ["sobre", "About"],
        ["eventos", "Events"],
        ["galeria", "Gallery"],
        ["equipa", "Team"],
        ["contactos", "Contacts"],
    ],
    hero: {
        eyebrow: "IEEE Student Branch Chapter",
        title: "IEEE ComSoc/VTS at the University of Aveiro",
        text: "A student chapter connecting students, researchers, and professionals in communications, networking, radio, intelligent mobility, and connected vehicles.",
        eventsCta: "View events",
        galleryCta: "View gallery",
        previousPhoto: "Previous image",
        nextPhoto: "Next image",
    },
    eventPhotos: [
        {
            title: "IEEE UA Student Branch",
            label: "Community",
            image: logoUrls.uaCarousel1,
        },
        {
            title: "Student activities",
            label: "Campus",
            image: logoUrls.uaCarousel2,
        },
        {
            title: "ShareToy",
            label: "Technical volunteering",
            image: logoUrls.shareToy,
        },
        {
            title: "MicroRato",
            label: "Competition",
            image: logoUrls.microRato,
        },
    ],
    about: {
        eyebrow: "About",
        title: "A clear IEEE presence on campus.",
        text: "The chapter combines the University of Aveiro student community with the technical expertise of IT-Aveiro and the IEEE Communications Society and Vehicular Technology Society. The page now works as an editorial space for chapter activities, network events, and photo records.",
        openLabel: "Open",
    },
    stats: [
        ["ComSoc + VTS", "IEEE societies"],
        ["UA + IT-Aveiro", "Academic context"],
        ["4", "Founding doctoral students"],
    ],
    partners: [
        {
            name: "University of Aveiro",
            text: "Academic ecosystem that hosts the Student Branch and connects the chapter to students, faculty, and researchers.",
            href: links.ua,
            logo: logoUrls.ua,
            logoAlt: "University of Aveiro logo",
        },
        {
            name: "IT-Aveiro",
            text: "Research unit that supports the chapter's technical critical mass in telecommunications and networks.",
            href: links.it,
            logo: logoUrls.it,
            logoAlt: "IT-Aveiro logo",
        },
        {
            name: "IEEE ComSoc Portugal",
            text: "National technical community focused on networks, communications, and digital services.",
            href: links.comsocPt,
            logo: logoUrls.comsoc,
            logoAlt: "IEEE Communications Society logo",
        },
        {
            name: "IEEE VTS Portugal",
            text: "National technical community connected to mobile radio, vehicles, and land transportation.",
            href: links.vtsPt,
            logo: logoUrls.vts,
            logoAlt: "IEEE Vehicular Technology Society logo",
        },
    ],
    events: {
        eyebrow: "Events",
        title: "Chapter activities and IEEE network",
        networkEyebrow: "vTools Portugal",
        networkTitle: "ComSoc and VTS Portugal events",
        networkText:
            "This list is loaded automatically from the public vTools API and filters events where ComSoc Portugal or VTS Portugal are listed as host or co-host.",
        loading: "Loading vTools events...",
        error: "Unable to load vTools events right now.",
        empty: "There are no ComSoc/VTS Portugal events published for the queried period.",
        recentNotice:
            "No future events are published right now; showing the most recent ComSoc/VTS Portugal events instead.",
        networkEmpty: "Chapter activities already highlighted above are not repeated in this feed.",
        online: "Online",
        noDescription: "No description is available in vTools.",
        openEvent: "Open event",
        openComsocCalendar: "ComSoc Portugal calendar",
        openVtsCalendar: "VTS Portugal calendar",
        openApi: "vTools documentation",
    },
    chapterEvents: [
        {
            vtoolsId: "563305",
            source: "Distinguished Lecture",
            title: "IEEE Distinguished Lecture: Open Networking for Future Communications",
            date: "16 Jun 2026, 15:00",
            place: "IT-Aveiro, Amphitheatre 19",
            text: "In-person technical seminar with Professor Augusto Venâncio Neto on open, programmable, and disaggregated networking architectures for future communication systems.",
            image: logoUrls.uaCarousel1,
            href: "https://events.vtools.ieee.org/m/563305",
        },
        {
            vtoolsId: "563156",
            source: "Distinguished Lecture",
            title: "IEEE Distinguished Lecture: E2E Slice Lifecycle Management for Telco-Cloud Ecosystems",
            date: "17 Jun 2026, 16:30",
            place: "IT-Aveiro + online",
            text: "Hybrid technical seminar with Professor Augusto Venâncio Neto on network slicing, orchestration, 5G/6G, Open RAN, NFV/SDN, and cloud-edge infrastructures.",
            image: logoUrls.uaCarousel2,
            href: "https://events.vtools.ieee.org/m/563156",
        },
    ],
    gallery: {
        eyebrow: "Gallery",
        title: "Photos of events and reports",
    },
    team: {
        eyebrow: "Team",
        title: "Founding committee and counseling",
        people: [
            {
                name: "André Clérigo",
                role: "Chair",
                area: "Network Architectures & Protocols",
                focus: "XR, V2X, VRUs, edge, and cooperative mobility systems.",
                linkedin: "https://pt.linkedin.com/in/andreclerigo",
            },
            {
                name: "Pedro Valente",
                role: "Vice-Chair",
                area: "Network Architectures & Protocols",
                focus: "Networks, protocols, smart mobility, and applied research at IT-Aveiro.",
                linkedin: "https://pt.linkedin.com/in/pedrovalentemateus",
            },
            {
                name: "Guilherme Lourenço",
                role: "Treasurer",
                area: "Radio Systems",
                focus: "Research in communications, network services, and experimental integration.",
                linkedin: "https://pt.linkedin.com/in/glourenco3ff",
            },
            {
                name: "Bruno Ribeiro",
                role: "Secretary",
                area: "Network Applications & Services",
                focus: "Radio, embedded systems, and experimentation with wireless technologies.",
                linkedin:
                    "https://www.linkedin.com/search/results/people/?keywords=Bruno%20Ribeiro%20Instituto%20de%20Telecomunica%C3%A7%C3%B5es%20Universidade%20de%20Aveiro",
            },
            {
                name: "Fernando Velez",
                photoUrl: logoUrls.fernandoVelez,
                role: "Counselor",
                area: "Instituto de Telecomunicações",
                focus: "Institutional support and guidance between the chapter, the Student Branch, and the UA academic context.",
                linkedin: "https://www.linkedin.com/in/fernando-velez-5018291"
            },
        ],
    },
    contacts: {
        eyebrow: "Contacts",
        title: "Want to propose a talk, workshop, or demo?",
        text: "The chapter is open to proposals from students, researchers, companies, and IEEE chapters in communications, radio, intelligent mobility, 5G/6G, V2X, and experimentation.",
    },
    footer: {
        copyright: "© 2026 IEEE Student Branch Chapter ComSoc/VTS at the University of Aveiro.",
    },
};

export default en;
