import { describe, test, expect } from "vitest";
import { Temporal } from "@js-temporal/polyfill";
import { datetime } from "./index";

describe("datetime", () => {
  test("isValid detects valid vs invalid", () => {
    expect(datetime.isValid("2025-10-10T10:00:00")).toBe(true);
    expect(datetime.isValid("2025-10-10")).toBe(true);
    expect(datetime.isValid(1700000000000)).toBe(true);
    expect(datetime.isValid(new Date("2020-01-01"))).toBe(true);
    expect(datetime.isValid("bad-input")).toBe(false);
    expect(datetime.isValid(NaN)).toBe(false);
  });

  test("now produces current instant close to system clock", () => {
    const sysNow = Date.now();
    const dtNow = datetime.now().epochMilliseconds;
    expect(Math.abs(dtNow - sysNow)).toBeLessThan(1000); // within 1s
  });

  test("today, yesterday, tomorrow give expected dates", () => {
    const tz = "UTC";
    const today = datetime.today(tz);
    const yesterday = datetime.yesterday(tz);
    const tomorrow = datetime.tomorrow(tz);

    console.log({ today: today.toString(), yesterday: yesterday.toString(), tomorrow: tomorrow.toString() });

    const plainToday = Temporal.Now.plainDateTimeISO(tz).with({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const r1 = today.toPlainDate().equals(plainToday.toPlainDate());
    const r2 = yesterday.until(today).days;
    const r3 = today.until(tomorrow).days;

    expect(r1).toBe(true);
    expect(r2).toBe(1);
    expect(r3).toBe(1);
  });

  test("date() parses and matches given date string", () => {
    const d = datetime.date("2025-12-25");
    expect(d.toPlainDate().toString()).toBe("2025-12-25");
  });

  test("format() returns correct formatted string", () => {
    const dt = Temporal.PlainDateTime.from("2025-12-25T12:00:00");
    const formatted = datetime.format(dt, { year: "numeric", month: "short", day: "numeric" }, "en-US");
    expect(formatted).toBe("Dec 25, 2025");
  });

  test("difference() between instants returns exact values", () => {
    const a = Temporal.Instant.fromEpochMilliseconds(0);
    const b = Temporal.Instant.fromEpochMilliseconds(2000);
    expect(datetime.difference(a, b, "second")).toBe(2);
    expect(datetime.difference(a, b, "millisecond")).toBe(2000);
  });

  test("difference() between PlainDateTime returns days", () => {
    const a = Temporal.PlainDateTime.from("2025-01-01T00:00:00");
    const b = Temporal.PlainDateTime.from("2025-01-02T00:00:00");
    expect(datetime.difference(a, b, "day")).toBe(1);
  });

  test("reader() produces human readable text", () => {
    expect(datetime.reader(60)).toBe("in 1 minute");
    expect(datetime.reader(-3600)).toBe("1 hour ago");
  });

  test("diff() produces correct wording", () => {
    const a = Temporal.Instant.fromEpochMilliseconds(0);
    const b = Temporal.Instant.fromEpochMilliseconds(3600 * 1000);
    const text = datetime.diff(a, b);
    expect(text).toBe("in 1 hour");
  });

  test("check.isBefore / isAfter truthfully compare", () => {
    const a = Temporal.Instant.fromEpochMilliseconds(0);
    const b = Temporal.Instant.fromEpochMilliseconds(1000);
    expect(datetime.check.isBefore(a, b)).toBe(true);
    expect(datetime.check.isBefore(b, a)).toBe(false);
    expect(datetime.check.isAfter(b, a)).toBe(true);
    expect(datetime.check.isAfter(a, b)).toBe(false);
  });

  test("ranges.today covers current day start to end", () => {
    const tz = "UTC";
    const range = datetime.ranges.today(tz);
    const today = Temporal.Now.plainDateTimeISO(tz).toPlainDate();
    expect(range.start.toPlainDate().equals(today)).toBe(true);
    expect(range.end.toPlainDate().equals(today)).toBe(true);
  });

  test("ranges.last and ranges.next compute correct intervals", () => {
    const tz = "UTC";
    const last3Days = datetime.ranges.last.days(3, tz);
    expect(last3Days.end.epochMilliseconds > last3Days.start.epochMilliseconds).toBe(true);
    expect(last3Days.end.since(last3Days.start).days).toBe(3);

    const next2Hours = datetime.ranges.next.hours(2, tz);
    expect(next2Hours.end.since(next2Hours.start).hours).toBe(2);
  });

  test.only("time zone differences produce different PlainDateTimes", () => {
    const utcToday = datetime.today("UTC");
    const nyToday = datetime.today("America/New_York");
    console.log({ utcToday: utcToday.toZonedDateTime('UTC').toString(), nyToday: nyToday.toZonedDateTime('America/New_York').toString() });
    expect(utcToday.toString()).not.toBe(nyToday.toString());
  });
});