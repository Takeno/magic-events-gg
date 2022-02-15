import formatDate from 'date-fns/format';
import it from 'date-fns/locale/it';

type FormatType = typeof formatDate;

export const format: FormatType = function (date, format, options) {
  return formatDate(date, format, {
    locale: it,
    ...options,
  });
};
