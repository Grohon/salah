import type { IslamicEvent, HijriDate } from './types';

const HIJRI_MONTH_LENGTHS = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

function isLeapYear(year: number): boolean {
  const cycleYear = ((year - 1) % 30) + 1;
  return [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29].includes(cycleYear);
}

function monthLength(year: number, month: number): number {
  if (month === 12) return isLeapYear(year) ? 30 : 29;
  return HIJRI_MONTH_LENGTHS[month - 1];
}

function daysFromYearStart(year: number, month: number, day: number): number {
  let total = 0;
  for (let m = 1; m < month; m++) total += monthLength(year, m);
  return total + day;
}

function daysInYear(year: number): number {
  return isLeapYear(year) ? 355 : 354;
}

interface HijriEventDef {
  name: string;
  nameAr: string;
  month: number;
  day: number;
  type: 'important' | 'normal';
  description: string;
}

const EVENT_DEFS: HijriEventDef[] = [
  {
    name: "Islamic New Year",
    nameAr: "رأس السنة الهجرية",
    month: 1, day: 1,
    type: 'important',
    description: "Beginning of the Islamic lunar calendar",
  },
  {
    name: "Day of Ashura",
    nameAr: "عاشوراء",
    month: 1, day: 10,
    type: 'normal',
    description: "Day of mourning and reflection",
  },
  {
    name: "Mawlid al-Nabi",
    nameAr: "المولد النبوي",
    month: 3, day: 12,
    type: 'normal',
    description: "Birth of Prophet Muhammad (PBUH)",
  },
  {
    name: "Isra and Mi'raj",
    nameAr: "الإسراء والمعراج",
    month: 7, day: 27,
    type: 'normal',
    description: "Night journey and ascension of the Prophet",
  },
  {
    name: "Ramadan",
    nameAr: "رمضان",
    month: 9, day: 1,
    type: 'important',
    description: "Month of fasting and spiritual reflection",
  },
  {
    name: "Laylat al-Qadr",
    nameAr: "ليلة القدر",
    month: 9, day: 27,
    type: 'important',
    description: "Night of power — last ten days of Ramadan",
  },
  {
    name: "Eid al-Fitr",
    nameAr: "عيد الفطر",
    month: 10, day: 1,
    type: 'important',
    description: "Festival of breaking the fast",
  },
  {
    name: "Eid al-Adha",
    nameAr: "عيد الأضحى",
    month: 12, day: 10,
    type: 'important',
    description: "Festival of sacrifice",
  },
];

export function getIslamicEvents(hijriDate: HijriDate | null): IslamicEvent[] {
  if (!hijriDate) return [];

  const todayYear = parseInt(hijriDate.year, 10);
  const todayMonth = parseInt(hijriDate.month, 10);
  const todayDay = parseInt(hijriDate.day, 10);
  const todayOffset = daysFromYearStart(todayYear, todayMonth, todayDay);

  return EVENT_DEFS.map((def) => {
    let eventYear: number;
    let eventOffset: number;

    const defOffset = daysFromYearStart(todayYear, def.month, def.day);

    if (defOffset > todayOffset) {
      eventYear = todayYear;
      eventOffset = defOffset;
    } else {
      eventYear = todayYear + 1;
      eventOffset = daysInYear(todayYear) - todayOffset + daysFromYearStart(eventYear, def.month, def.day);
    }

    const daysUntil = eventOffset - todayOffset;

    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + daysUntil);

    return {
      name: def.name,
      nameAr: def.nameAr,
      date: eventDate,
      type: def.type,
      description: def.description,
    };
  }).filter(e => e.date > new Date());
}

export function getUpcomingEvents(events: IslamicEvent[], count: number = 3): IslamicEvent[] {
  return events
    .filter(e => e.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, count);
}

export function getDaysUntilEvent(event: IslamicEvent): number {
  const now = new Date();
  const diff = event.date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
