import formatDate from 'date-fns/format';
import add from 'date-fns/add';
import addMinutes from 'date-fns/addMinutes';
import it from 'date-fns/locale/it';

type FormatType = typeof formatDate;

const dt = new Date();

export const format: FormatType = function (date, format, options) {
  const fixedTimezone = addMinutes(date, 60 + dt.getTimezoneOffset());

  return formatDate(fixedTimezone, format, {
    locale: it,
    ...options,
  });
};

type GuessEndType = typeof add;

export const guessEndOfEvent: GuessEndType = (date, duration) =>
  add(date, duration);
