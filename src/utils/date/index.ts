import { Temporal } from '@js-temporal/polyfill';
import * as _ from 'lodash';

_.set(globalThis, 'Temporal', Temporal);
// Ensure Temporal is available globally

const units = ['seconds', 'minutes', 'hours', 'weeks', 'months', 'years'] as const;

const unitMap = {
  Y: 'year',
  M: 'month',
  W: 'week',
  D: 'day',
  h: 'hour',
  m: 'minute',
  s: 'second',
  ms: 'millisecond',
} as const satisfies Record<string, Temporal.DateTimeUnit>;

type UnitKey = keyof typeof unitMap;                 // "Y" | "M" | "W" | "D" | "h" | "m" | "s" | "ms"
type UnitValue = (typeof unitMap)[UnitKey];          // "year" | "month" | "week" | "day" | "hour" | "minute" | "second" | "millisecond"
type Unit = UnitKey | UnitValue; 

function rangeFactory(unit: string, isNext = false) {
  return (n: number, timeZone = 'UTC') => {
    const now = Temporal.Now.zonedDateTimeISO(timeZone);
    const target = isNext ? now.add({ [unit]: n }) : now.subtract({ [unit]: n });
    return {
      start: isNext ? now : target,
      end: isNext ? target : now,
    };
  };
}

function dateRangeFactory(isNext = false) {
  return (n: number, timeZone = 'UTC') => {
    const today = Temporal.Now.zonedDateTimeISO(timeZone).toPlainDate();
    const target = isNext ? today.add({ days: n - 1 }) : today.subtract({ days: n - 1 });
    return {
      start: isNext ? Temporal.PlainDateTime.from(today) : Temporal.PlainDateTime.from(target),
      end: isNext ? Temporal.PlainDateTime.from(target) : Temporal.PlainDateTime.from(today),
    };
  };
}

const getPlainDateTime = (date?: Temporal.PlainDate | string, timeZone = 'UTC') => {
  const plainDate = date
    ? typeof date === 'string' ? Temporal.PlainDateTime.from(date) : date
    : Temporal.Now.zonedDateTimeISO(timeZone).toPlainDate();
  return plainDate.toZonedDateTime(timeZone).toPlainDateTime();
};

const reader = (t: number): string => {
  const abs = Math.abs(t);
  const future = t > 0;

  const units = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const { label, seconds } of units) {
    if (abs >= seconds || label === 'second') {
      const value = Math.round(abs / seconds);
      const plural = value === 1 ? label : `${label}s`;
      return future ? `in ${value} ${plural}` : `${value} ${plural} ago`;
    }
  }
  return future ? 'in 0 seconds' : '0 seconds ago';
}

const isValid = (
  input: string | number | Date | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.Instant
): boolean => {
  try {
    if (input instanceof Temporal.PlainDate ||
      input instanceof Temporal.PlainDateTime ||
      input instanceof Temporal.ZonedDateTime ||
      input instanceof Temporal.Instant) {
      return true;
    }

    if (typeof input === 'string') {
      Temporal.PlainDateTime.from(input); // throws if invalid
      return true;
    }

    if (typeof input === 'number') {
      Temporal.Instant.fromEpochMilliseconds(input); // throws if invalid
      return true;
    }

    if (input instanceof Date) {
      if (Number.isNaN(input.getTime())) return false;
      Temporal.Instant.fromEpochMilliseconds(input.getTime());
      return true;
    }

    return false;
  } catch {
    return false;
  }
};


const difference = (
  a: string | number | Date | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.Instant,
  b?: typeof a,
  unit: Unit = 'second'
): number => {
  const parse = (x: InputDate) => {
    if (typeof x === 'string') return x.includes('T') ? Temporal.PlainDateTime.from(x) : Temporal.PlainDate.from(x).toPlainDateTime();
    if (typeof x === 'number') return Temporal.Instant.fromEpochMilliseconds(x);
    if (x instanceof Date) return Temporal.Instant.fromEpochMilliseconds(x.getTime());
    if (x instanceof Temporal.ZonedDateTime) return x.toPlainDateTime();
    if (x instanceof Temporal.PlainDate) return x.toPlainDateTime();
    return x;
  };

  const first = parse(a);
  const second = parse(b ?? Temporal.Now.instant());
  const _unit = (unit in unitMap ? unitMap[unit as UnitKey] : unit) as UnitValue;

  if (
    first instanceof Temporal.Instant &&
    second instanceof Temporal.Instant
  ) {
    const diff = second.epochMilliseconds - first.epochMilliseconds;
    switch (_unit) {
      case 'millisecond': return diff;
      case 'second': return diff / 1_000;
      case 'minute': return diff / 60_000;
      case 'hour': return diff / 3_600_000;
      case 'day': return diff / 86_400_000;
      default: throw new Error(`Unsupported unit "${unit}" for Instant`);
    }
  }

  if (
    first instanceof Temporal.PlainDateTime &&
    second instanceof Temporal.PlainDateTime
  ) {
    if (['second', 'minute', 'hour'].includes(_unit)) {
      const firstZ = first.toZonedDateTime('UTC');
      const secondZ = second.toZonedDateTime('UTC');
      return secondZ.since(firstZ, { smallestUnit: _unit }).total({ unit: _unit });
    }
    return second.since(first, { smallestUnit: _unit })[`${_unit}s`];
  }
  throw new Error('Unsupported or mismatched Temporal types');
};

const toInstant = (x: InputDate): Temporal.Instant => {
  if (typeof x === 'string') return Temporal.Instant.from(x);
  if (typeof x === 'number') return Temporal.Instant.fromEpochMilliseconds(x);
  if (x instanceof Date) return Temporal.Instant.fromEpochMilliseconds(x.getTime());
  if (x instanceof Temporal.ZonedDateTime) return x.toInstant();
  if (x instanceof Temporal.PlainDateTime) return x.toZonedDateTime('UTC').toInstant();
  if (x instanceof Temporal.PlainDate) return x.toZonedDateTime('UTC').toInstant();
  if (x instanceof Temporal.Instant) return x;
  if (x === null || x === undefined) return Temporal.Now.instant();
  // Fallback: try to cast to Temporal.Instant, or throw
  throw new TypeError('Invalid input for toInstant');
};

const isBefore = (a: InputDate, b?: InputDate) => now(a).epochMilliseconds < now(b ?? Temporal.Now.instant()).epochMilliseconds;
const isAfter = (a: InputDate, b?: InputDate) => now(a).epochMilliseconds > now(b ?? Temporal.Now.instant()).epochMilliseconds;

const dayRange = (dt: InputDate, timeZone = 'UTC') => {
  const _dt = now(dt);
  // Convert Instant to ZonedDateTime, then to PlainDate
  const zonedDateTime = _dt.toZonedDateTimeISO(timeZone);
  const plainDate = zonedDateTime.toPlainDate();

  const start = plainDate.toZonedDateTime({ timeZone, plainTime: Temporal.PlainTime.from('00:00:00') });
  const end = start.add({ days: 1 }).subtract({ nanoseconds: 1 });
  return { start, end };
};

const day = (input?: InputDate, timeZone = 'UTC') => {
  const dt = now(input);
  // Convert Instant to ZonedDateTime, then to PlainDate
  const zonedDateTime = dt.toZonedDateTimeISO(timeZone);
  const pdt = Temporal.PlainDateTime.from(zonedDateTime);
  return dayRange(pdt);
};

const now = (x?: InputDate) => !x ? Temporal.Now.instant() : toInstant(x);

type InputDate = null | string | number | Date | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.Instant;

export const datetime = {
  isValid,
  now,
  toInstant,
  today: (timeZone = 'UTC') => Temporal.PlainDateTime.from(Temporal.Now.zonedDateTimeISO(timeZone).toPlainDate()),
  tomorrow: (timeZone = 'UTC') => Temporal.PlainDateTime.from(Temporal.Now.zonedDateTimeISO(timeZone).toPlainDate().add({ days: 1 })),
  yesterday: (timeZone = 'UTC') => Temporal.PlainDateTime.from(Temporal.Now.zonedDateTimeISO(timeZone).toPlainDate().subtract({ days: 1 })),
  date: (input?: Temporal.PlainDate | string, timeZone = 'UTC') => getPlainDateTime(input, timeZone),
  format: (dt: Temporal.PlainDateTime, options?: Intl.DateTimeFormatOptions, locale = 'en-US') =>
    dt.toZonedDateTime('UTC').toLocaleString(locale, options),
  check: { isValid, isBefore, isAfter, },
  ranges: {
    day,
    today: (timeZone = 'UTC') => day(null, timeZone),
    yesterday: (timeZone = 'UTC') => {
      const d = Temporal.Now.zonedDateTimeISO(timeZone).toPlainDate().subtract({ days: 1 });
      const pdt = Temporal.PlainDateTime.from(d);
      return dayRange(pdt);
    },
    tomorrow: (timeZone = 'UTC') => {
      const d = Temporal.Now.zonedDateTimeISO(timeZone).toPlainDate().add({ days: 1 });
      const pdt = Temporal.PlainDateTime.from(d);
      return dayRange(pdt);
    },
    last: Object.fromEntries([...units.map(u => [u, rangeFactory(u)]), ['days', dateRangeFactory(false)],]),
    next: Object.fromEntries([...units.map(u => [u, rangeFactory(u, true)]), ['days', dateRangeFactory(true)],])
  },
  difference,
  reader,
  diff: (
    a: string | number | Date | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.Instant,
    b?: typeof a
  ): string => {
    const t = difference(a, b, 'second');
    return reader(t);
  },
  unitMap
};