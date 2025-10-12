import {
  // CalendarDateTime,
  parseDate,
  type ZonedDateTime
} from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';

export const zones = () => {
  const zonelist = ['PST', 'CST', 'IST', 'EST'];
  const list = Intl.supportedValuesOf('timeZone');
  list.push(...zonelist);
  if (!(list.includes('UTC') || list.includes('utc'))) {
    list.push('UTC');
  }
  return list.map(zone => ({
    abbr: new Date().toLocaleTimeString('en-us', { timeZoneName: 'short', timeZone: zone }).split(' ')[2],
    zone
  }));
}


export const duration = (_d1: Date, _d2: Date, timeZone = 'UTC') => {
  const z1 = Temporal.Instant.fromEpochMilliseconds(_d1.getTime()).toZonedDateTimeISO(timeZone);
  const z2 = Temporal.Instant.fromEpochMilliseconds(_d2.getTime()).toZonedDateTimeISO(timeZone);

  // Always diff from earlier → later
  const [start, end] = z1.epochMilliseconds <= z2.epochMilliseconds ? [z1, z2] : [z2, z1];

  const dur = end.since(start, { largestUnit: 'years' }); // full calendar-aware duration

  const totalMonths = dur.years * 12 + dur.months;
  const totalDays = Math.floor(end.since(start, { smallestUnit: 'days' }).total({ unit: 'day' }));
  const totalHours = Math.floor(end.since(start, { smallestUnit: 'hours' }).total({ unit: 'hour' }));
  const totalMinutes = Math.floor(end.since(start, { smallestUnit: 'minutes' }).total({ unit: 'minute' }));
  const totalSeconds = Math.floor(end.since(start, { smallestUnit: 'seconds' }).total({ unit: 'second' }));

  const main = [
    dur.years ? `${dur.years} year${dur.years > 1 ? 's' : ''}` : '',
    dur.months ? `${dur.months} month${dur.months > 1 ? 's' : ''}` : '',
    dur.days ? `${dur.days} day${dur.days > 1 ? 's' : ''}` : '',
    dur.hours ? `${dur.hours} hour${dur.hours > 1 ? 's' : ''}` : '',
    dur.minutes ? `${dur.minutes} minute${dur.minutes > 1 ? 's' : ''}` : '',
    dur.seconds ? `${dur.seconds} second${dur.seconds > 1 ? 's' : ''}` : ''
  ].filter(Boolean).join(' ');

  return {
    main,
    years: dur.years,
    months: totalMonths,
    days: totalDays,
    hours: totalHours,
    minutes: totalMinutes,
    seconds: totalSeconds,
  };
}

// // Example
// const d1 = new Date('2020-01-01T00:00:00Z');
// const d2 = new Date('2023-03-06T07:08:10Z');
// console.log(diffDetailed(d1, d2));

export const getCompatibleDate = (date: ZonedDateTime | null) => {
  if (!date) return null;
  // Convert your ZonedDateTime to a compatible format
  return parseDate(date.toString());
  // return new CalendarDateTime(
  //   date.year, date.month, date.day, 
  //   date.hour, date.minute, date.second
  // );
};