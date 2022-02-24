interface TextareaProps {
  name: string;
  id?: string;
  error?: string;
  placeholder?: string;
  title: string;
  value: string | null | undefined;
  onChange: (text: string) => void;
}

export default function Textarea(props: TextareaProps) {
  return (
    <div>
      <label htmlFor={props.id || props.name} className="block font-medium">
        {props.title}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <textarea
          name={props.name}
          id={props.id || props.name}
          className="block w-full border-gray-300 rounded-md"
          placeholder={props.placeholder}
          value={props.value || ''}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
      {props.error && <span className="text-red-600">{props.error}</span>}
    </div>
  );
}
