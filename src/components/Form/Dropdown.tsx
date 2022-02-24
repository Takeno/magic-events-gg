interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownProps {
  name: string;
  id?: string;
  error?: string;
  placeholder?: string;
  title: string;
  value: string | null | undefined;
  onChange: (value: string | null | undefined) => void;
  options: DropdownItem[];
}

export default function Dropdown(props: DropdownProps) {
  return (
    <div>
      <label htmlFor={props.id || props.name} className="block font-medium">
        {props.title}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <select
          name={props.name}
          id={props.id || props.name}
          className="block w-full border-gray-300 rounded-md"
          placeholder={props.placeholder}
          value={props.value || ''}
          onChange={(e) => props.onChange(e.target.value)}
        >
          <option value="">{props.placeholder}</option>
          {props.options.map((opt, index) => (
            <option key={index} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {props.error && <span className="text-red-600">{props.error}</span>}
    </div>
  );
}
