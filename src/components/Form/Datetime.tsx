import {ChangeEvent, useCallback} from 'react';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

interface DatetimeProps {
  name: string;
  id?: string;
  error?: string;
  placeholder?: string;
  title: string;
  value: number | null | undefined;
  onChange: (timestamp: number) => void;
}

export default function Datetime(props: DatetimeProps) {
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      const d = parseISO(value);

      props.onChange(d.getTime());
    },
    [props.onChange]
  );

  const value =
    typeof props.value === 'number'
      ? format(props.value, "yyyy-MM-dd'T'HH:mm")
      : '';

  return (
    <div>
      <label htmlFor={props.id || props.name} className="block font-medium">
        {props.title}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          name={props.name}
          id={props.id || props.name}
          type="datetime-local"
          className="block w-full border-gray-300 rounded-md"
          placeholder={props.placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
      {props.error && <span className="text-red-600">{props.error}</span>}
    </div>
  );
}
