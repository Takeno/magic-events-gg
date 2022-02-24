interface CheckboxFlagProps {
  name: string;
  id?: string;
  error?: string;
  placeholder?: string;
  title: string;
  value: boolean | null | undefined;
  onChange: (text: boolean) => void;
}

export default function CheckboxFlag(props: CheckboxFlagProps) {
  return (
    <div>
      <div className="mt-1 flex items-center">
        <input
          name={props.name}
          id={props.id || props.name}
          type="checkbox"
          className="block h-4 w-4"
          placeholder={props.placeholder}
          checked={props.value || false}
          onChange={(e) => props.onChange(e.target.checked)}
        />
        <label
          htmlFor={props.id || props.name}
          className="block ml-3 font-medium"
        >
          {props.title}
        </label>
      </div>
      {props.error && <span className="text-red-600">{props.error}</span>}
    </div>
  );
}
