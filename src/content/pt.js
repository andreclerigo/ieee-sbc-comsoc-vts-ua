import { links, logoUrls } from './shared.js';

const pt = {
    htmlLang: "pt-PT",
    metaTitle: "IEEE ComSoc/VTS UA",
    header: {
        logoAlt: "IEEE ComSoc/VTS UA",
        contact: "Contactar",
        openMenu: "Abrir menu",
        closeMenu: "Fechar menu",
        languageLabel: "Selecionar idioma",
    },
    navItems: [
        ["sobre", "Sobre"],
        ["eventos", "Eventos"],
        ["galeria", "Galeria"],
        ["equipa", "Equipa"],
        ["contactos", "Contactos"],
    ],
    hero: {
        eyebrow: "IEEE Student Branch Chapter",
        title: "IEEE ComSoc/VTS da Universidade de Aveiro",
        text: "Um chapter estudantil para aproximar estudantes, investigadores e profissionais em comunicações, redes, rádio, mobilidade inteligente e veículos conectados.",
        eventsCta: "Ver eventos",
        galleryCta: "Ver galeria",
        previousPhoto: "Imagem anterior",
        nextPhoto: "Imagem seguinte",
    },
    eventPhotos: [
        {
            title: "IEEE UA Student Branch",
            label: "Comunidade",
            image: logoUrls.uaCarousel1,
        },
        {
            title: "Atividades estudantis",
            label: "Campus",
            image: logoUrls.uaCarousel2,
        },
        {
            title: "ShareToy",
            label: "Voluntariado técnico",
            image: logoUrls.shareToy,
        },
        {
            title: "MicroRato",
            label: "Competição",
            image: logoUrls.microRato,
        },
    ],
    about: {
        eyebrow: "Sobre",
        title: "Uma presença IEEE clara no campus.",
        text: "O chapter combina a comunidade estudantil da Universidade de Aveiro com a experiência técnica do IT-Aveiro e das sociedades IEEE Communications Society e Vehicular Technology Society. A página passa a funcionar como espaço editorial para atividades próprias, eventos da rede e registo fotográfico.",
        openLabel: "Abrir",
    },
    stats: [
        ["ComSoc + VTS", "Sociedades IEEE"],
        ["UA + IT-Aveiro", "Contexto académico"],
        ["4", "Doutorandos fundadores"],
    ],
    partners: [
        {
            name: "Universidade de Aveiro",
            text: "Ecossistema académico que acolhe a Student Branch e liga o chapter a estudantes, docentes e investigadores.",
            href: links.ua,
            logo: logoUrls.ua,
            logoAlt: "Logotipo da Universidade de Aveiro",
        },
        {
            name: "IT-Aveiro",
            text: "Unidade de investigação que sustenta a massa crítica técnica do chapter em telecomunicações e redes.",
            href: links.it,
            logo: logoUrls.it,
            logoAlt: "Logotipo do IT-Aveiro",
        },
        {
            name: "IEEE ComSoc Portugal",
            text: "Comunidade técnica nacional focada em redes, comunicações e serviços digitais.",
            href: links.comsocPt,
            logo: logoUrls.comsoc,
            logoAlt: "Logotipo da IEEE Communications Society",
        },
        {
            name: "IEEE VTS Portugal",
            text: "Comunidade técnica nacional ligada a rádio móvel, veículos e transporte terrestre.",
            href: links.vtsPt,
            logo: logoUrls.vts,
            logoAlt: "Logotipo da IEEE Vehicular Technology Society",
        },
    ],
    events: {
        eyebrow: "Eventos",
        title: "Atividades do chapter e rede IEEE",
        networkEyebrow: "vTools Portugal",
        networkTitle: "Eventos ComSoc e VTS Portugal",
        networkText:
            "A lista é carregada automaticamente a partir da API pública do vTools e filtra eventos em que ComSoc Portugal ou VTS Portugal aparecem como host ou co-host.",
        loading: "A carregar eventos do vTools...",
        error: "Não foi possível carregar os eventos vTools neste momento.",
        empty: "Não existem eventos ComSoc/VTS Portugal publicados no período consultado.",
        recentNotice:
            "Sem eventos futuros publicados neste momento; seguem os eventos ComSoc/VTS Portugal mais recentes.",
        online: "Online",
        noDescription: "Descrição não disponível no vTools.",
        openComsocCalendar: "Calendário ComSoc Portugal",
        openVtsCalendar: "Calendário VTS Portugal",
        openApi: "Documentação vTools",
    },
    chapterEvents: [
        {
            source: "Chapter",
            title: "Palestra",
            date: "17 Junho 2026",
            place: "IT-Aveiro",
            text: "",
            image: logoUrls.uaCarousel1,
        },
    ],
    gallery: {
        eyebrow: "Galeria",
        title: "Fotos de eventos e reportagens",
    },
    team: {
        eyebrow: "Equipa",
        title: "Comissão fundadora e aconselhamento",
        people: [
            {
                name: "André Clérigo",
                role: "Presidente",
                area: "Network Applications & Protocols",
                focus: "XR, V2X, VRUs, edge e sistemas de mobilidade cooperativa.",
                linkedin: "https://pt.linkedin.com/in/andreclerigo",
            },
            {
                name: "Pedro Valente",
                role: "Vice-presidente",
                area: "Network Architectures & Protocols",
                focus: "Redes, protocolos, mobilidade inteligente e investigação aplicada em IT-Aveiro.",
                linkedin: "https://pt.linkedin.com/in/pedrovalentemateus",
            },
            {
                name: "Guilherme Lourenço",
                role: "Tesoureiro",
                area: "Radio Systems",
                focus: "Investigação em comunicações, serviços de rede e integração experimental.",
                linkedin: "https://pt.linkedin.com/in/glourenco3ff",
            },
            {
                name: "Bruno Ribeiro",
                role: "Secretário",
                area: "Network Applications & Services",
                focus: "Rádio, sistemas embebidos e experimentação com tecnologias sem fios.",
                linkedin:
                    "https://www.linkedin.com/search/results/people/?keywords=Bruno%20Ribeiro%20Instituto%20de%20Telecomunica%C3%A7%C3%B5es%20Universidade%20de%20Aveiro",
            },
            {
                name: "Fernando Velez",
                photoUrl: "/assets/fernando-velez.jpg",
                role: "Conselheiro",
                area: "Instituto de Telecomunicações",
                focus: "Apoio institucional e orientação entre o chapter, a Student Branch e o contexto académico da UA.",
                linkedin: "https://pt.linkedin.com/in/fernando-velez-5018291",
            },
        ],
    },
    contacts: {
        eyebrow: "Contactos",
        title: "Queres propor uma palestra, workshop ou demo?",
        text: "O chapter está aberto a propostas de estudantes, investigadores, empresas e capítulos IEEE nas áreas de comunicações, rádio, mobilidade inteligente, 5G/6G, V2X e experimentação.",
    },
    footer: {
        copyright: "© 2026 IEEE Student Branch Chapter ComSoc/VTS da Universidade de Aveiro.",
    },
};

export default pt;
