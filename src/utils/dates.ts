import formatDate from 'date-fns/format';
import add from 'date-fns/add';
import it from 'date-fns/locale/it';
import {formatInTimeZone} from 'date-fns-tz';

type FormatType = typeof formatDate;

export const format: FormatType = function (date, format, options) {
  return formatDate(date, format, {
    locale: it,
    ...options,
  });
};

type GuessEndType = typeof add;

export const guessEndOfEvent: GuessEndType = (date, duration) =>
  add(date, duration);

type FormatTimeZone = typeof formatInTimeZone;

export const formatTimeZoned: FormatTimeZone = function (
  date,
  timeZone,
  format,
  options
) {
  return formatInTimeZone(date, timeZone, format, {
    locale: it,
    ...options,
  });
};
