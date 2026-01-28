// src/data/dummyData.ts

export type FarmStatus = 'green' | 'yellow' | 'red';

export type Farm = {
  id: string;
  name: string;
  owner: string;
  region: string;
  area: number;
  type: 'bland' | 'mjölk' | 'växtodling' | 'gris' | 'dikor & ungnöt';
  status: FarmStatus;
  lastUpdated: string;
  nextDeadline?: string; // YYYY-MM-DD (ISO)
  currentSupport: number;
  potentialSupport: number;

  // Pilot
  isPilot?: boolean;
  nextAction?: string; // "Vad ska göras – och när"
  upcomingRequirements?: string[];
  forgottenCommon?: string[];
  activeModules?: string[];
};

export const farms: Farm[] = [
  {
    id: '1',
    name: 'Lövängen Gård',
    owner: 'Familjen Karlsson',
    region: 'Skåne',
    area: 145,
    type: 'bland',
    status: 'green',
    lastUpdated: '2025-11-10',
    nextDeadline: '2025-12-15',
    currentSupport: 420000,
    potentialSupport: 448400,
  },
  {
    id: '2',
    name: 'Stora Ekbacken',
    owner: 'Erik Johansson',
    region: 'Östergötland',
    area: 230,
    type: 'växtodling',
    status: 'yellow',
    lastUpdated: '2025-10-02',
    nextDeadline: '2025-12-01',
    currentSupport: 510000,
    potentialSupport: 562800,
  },
  {
    id: '3',
    name: 'Sjökullen Lantbruk',
    owner: 'Anna och Peter Nilsson',
    region: 'Västra Götaland',
    area: 180,
    type: 'mjölk',
    status: 'red',
    lastUpdated: '2025-09-18',
    nextDeadline: '2025-11-30',
    currentSupport: 395000,
    potentialSupport: 452200,
  },
  {
    id: '4',
    name: 'Bergs Gård',
    owner: 'Lars och Karin Berg',
    region: 'Västmanland',
    area: 160,
    type: 'gris',
    status: 'yellow',
    lastUpdated: '2025-11-01',
    nextDeadline: '2025-12-20',
    currentSupport: 370000,
    potentialSupport: 401500,
  },
  {
    id: '5',
    name: 'Lilla Backagården',
    owner: 'Maria Svensson',
    region: 'Halland',
    area: 95,
    type: 'bland',
    status: 'green',
    lastUpdated: '2025-11-15',
    nextDeadline: '2026-01-10',
    currentSupport: 260000,
    potentialSupport: 279400,
  },
  {
    id: '6',
    name: 'Norrängens Lantbruk',
    owner: 'Anders och Sofia Lund',
    region: 'Uppland',
    area: 210,
    type: 'växtodling',
    status: 'green',
    lastUpdated: '2025-10-28',
    nextDeadline: '2026-02-01',
    currentSupport: 495000,
    potentialSupport: 528600,
  },
  {
    id: '7',
    name: 'Högdalens Gård',
    owner: 'Familjen Persson',
    region: 'Dalarna',
    area: 130,
    type: 'mjölk',
    status: 'yellow',
    lastUpdated: '2025-09-30',
    nextDeadline: '2025-12-05',
    currentSupport: 340000,
    potentialSupport: 372800,
  },
  {
    id: '8',
    name: 'Ängsbro Lantbruk',
    owner: 'Oskar och Elin Larsson',
    region: 'Södermanland',
    area: 120,
    type: 'bland',
    status: 'green',
    lastUpdated: '2025-11-05',
    currentSupport: 310000,
    potentialSupport: 332000,
  },
  {
    id: '9',
    name: 'Åkerholmens Gård',
    owner: 'Familjen Holm',
    region: 'Örebro',
    area: 175,
    type: 'växtodling',
    status: 'red',
    lastUpdated: '2025-08-22',
    nextDeadline: '2025-11-20',
    currentSupport: 380000,
    potentialSupport: 435600,
  },
  {
    id: '10',
    name: 'Solbacken',
    owner: 'Anna-Karin Pettersson',
    region: 'Blekinge',
    area: 105,
    type: 'bland',
    status: 'green',
    lastUpdated: '2025-11-18',
    currentSupport: 275000,
    potentialSupport: 296400,
  },

  // === PILOT-GÅRD: Harparboda (dikor & ungnöt) ===
  // Målet: Inga fejk-“feb-deadlines”. Istället SAM (9 april 2026), nötkreatursstödets räkneperiod och skyddszoner som säsong (april–oktober).
  {
    id: 'harparboda',
    name: 'Harparboda Gård',
    owner: 'Jocke Harparboda',
    region: 'Uppland',
    area: 120,
    type: 'dikor & ungnöt',
    status: 'yellow',
    lastUpdated: '2026-01-20',

    // Viktigast i närtid: SAM
    nextDeadline: '2026-04-09',

    currentSupport: 280000,
    potentialSupport: 315000,

    isPilot: true,

    // Konkreta, relevanta formuleringar (utan hittepå-datum)
    nextAction: 'Förbered SAM-ansökan: kontrollera skyddszoner och uppdatera djurantal (senast 9 april 2026)',

    upcomingRequirements: [
      'SAM-ansökan: sista dag 9 april 2026 (stöd, skyddszoner, djurantal)',
      'Nötkreatursstöd: räkneperiod 1 aug 2025 – 31 juli 2026 (stäm av djurantal och händelser löpande)',
      'Skyddszoner: etableras senast våren och ska följas under betessäsong (april–oktober)',
      'Inför betessäsong (april–oktober): gå igenom betesmarker/stängsel och dokumentera åtgärder vid behov',
    ],

    forgottenCommon: [
      'Foton/dokumentation på skyddszoner och riskpunkter (bra vid kontroll)',
      'Stalljournal: flyttar, inköp/försäljning, dödsfall (håll den uppdaterad)',
      'Kvitton/följesedlar för foder och insatsvaror samlade på ett ställe',
      'Transporthandlingar vid djurtransporter (om det är aktuellt)',
      'Service-/kontrollnoteringar för vattenkoppar/ventiler (små grejer som ofta glöms)',
    ],

    activeModules: ['egenkontroll-miljo', 'djurhallning-notkreatur', 'journaler-dokumentation', 'tillsyn-sam'],
  },
];

export function getFarmById(id: string): Farm | undefined {
  return farms.find((f) => f.id === id);
}
