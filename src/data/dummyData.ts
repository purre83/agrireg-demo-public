export type FarmStatus = "green" | "yellow" | "red";

export type Farm = {
  id: string;
  name: string;
  owner: string;
  region: string;
  area: number;
  type: "bland" | "mjölk" | "växtodling" | "gris";
  status: FarmStatus;
  lastUpdated: string;
  nextDeadline?: string;
  currentSupport: number;
  potentialSupport: number;
};

export const farms: Farm[] = [
  {
    id: "1",
    name: "Lövängen Gård",
    owner: "Familjen Karlsson",
    region: "Skåne",
    area: 145,
    type: "bland",
    status: "green",
    lastUpdated: "2025-11-10",
    nextDeadline: "2025-12-15",
    currentSupport: 420000,
    potentialSupport: 448400,
  },
  {
    id: "2",
    name: "Stora Ekbacken",
    owner: "Erik Johansson",
    region: "Östergötland",
    area: 230,
    type: "växtodling",
    status: "yellow",
    lastUpdated: "2025-10-02",
    nextDeadline: "2025-12-01",
    currentSupport: 510000,
    potentialSupport: 562800,
  },
  {
    id: "3",
    name: "Sjökullen Lantbruk",
    owner: "Anna och Peter Nilsson",
    region: "Västra Götaland",
    area: 180,
    type: "mjölk",
    status: "red",
    lastUpdated: "2025-09-18",
    nextDeadline: "2025-11-30",
    currentSupport: 395000,
    potentialSupport: 452200,
  },
  {
    id: "4",
    name: "Bergs Gård",
    owner: "Lars och Karin Berg",
    region: "Västmanland",
    area: 160,
    type: "gris",
    status: "yellow",
    lastUpdated: "2025-11-01",
    nextDeadline: "2025-12-20",
    currentSupport: 370000,
    potentialSupport: 401500,
  },
  {
    id: "5",
    name: "Lilla Backagården",
    owner: "Maria Svensson",
    region: "Halland",
    area: 95,
    type: "bland",
    status: "green",
    lastUpdated: "2025-11-15",
    nextDeadline: "2026-01-10",
    currentSupport: 260000,
    potentialSupport: 279400,
  },
  {
    id: "6",
    name: "Norrängens Lantbruk",
    owner: "Anders och Sofia Lund",
    region: "Uppland",
    area: 210,
    type: "växtodling",
    status: "green",
    lastUpdated: "2025-10-28",
    nextDeadline: "2026-02-01",
    currentSupport: 495000,
    potentialSupport: 528600,
  },
  {
    id: "7",
    name: "Högdalens Gård",
    owner: "Familjen Persson",
    region: "Dalarna",
    area: 130,
    type: "mjölk",
    status: "yellow",
    lastUpdated: "2025-09-30",
    nextDeadline: "2025-12-05",
    currentSupport: 340000,
    potentialSupport: 372800,
  },
  {
    id: "8",
    name: "Ängsbro Lantbruk",
    owner: "Oskar och Elin Larsson",
    region: "Södermanland",
    area: 120,
    type: "bland",
    status: "green",
    lastUpdated: "2025-11-05",
    currentSupport: 310000,
    potentialSupport: 332000,
  },
  {
    id: "9",
    name: "Åkerholmens Gård",
    owner: "Familjen Holm",
    region: "Örebro",
    area: 175,
    type: "växtodling",
    status: "red",
    lastUpdated: "2025-08-22",
    nextDeadline: "2025-11-20",
    currentSupport: 380000,
    potentialSupport: 435600,
  },
  {
    id: "10",
    name: "Solbacken",
    owner: "Anna-Karin Pettersson",
    region: "Blekinge",
    area: 105,
    type: "bland",
    status: "green",
    lastUpdated: "2025-11-18",
    currentSupport: 275000,
    potentialSupport: 296400,
  },
];

export function getFarmById(id: string): Farm | undefined {
  return farms.find((f) => f.id === id);
}
