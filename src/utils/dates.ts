import formatDate from 'date-fns/format';
import add from 'date-fns/add';
import it from 'date-fns/locale/it';

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
