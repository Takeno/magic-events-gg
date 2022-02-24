interface NumericInputProps {
  name: string;
  id?: string;
  error?: string;
  placeholder?: string;
  title: string;
  value: number | null | undefined;
  onChange: (value: number) => void;
}

export default function NumericInput(props: NumericInputProps) {
  return (
    <div>
      <label htmlFor={props.id || props.name} className="block font-medium">
        {props.title}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          name={props.name}
          id={props.id || props.name}
          type="number"
          className="block w-full border-gray-300 rounded-md"
          placeholder={props.placeholder}
          value={props.value || ''}
          onChange={(e) => props.onChange(+e.target.value)}
        />
      </div>
      {props.error && <span className="text-red-600">{props.error}</span>}
    </div>
  );
}
