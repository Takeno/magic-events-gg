import {useEffect, useRef} from 'react';
import 'easymde/dist/easymde.min.css';

interface MarkdownEditorProps {
  name: string;
  id?: string;
  error?: string;
  placeholder?: string;
  title: string;
  value: string | null | undefined;
  onChange: (text: string) => void;
}

export default function MarkdownEditor(props: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let instance: EasyMDE | null = null;

    import('easymde').then((mod) => {
      if (textareaRef.current === null) {
        return;
      }
      const EasyMDE = mod.default;

      instance = new EasyMDE({
        element: textareaRef.current,
        status: false,
        spellChecker: false,
      });

      instance.codemirror.on('change', () => {
        props.onChange(instance?.value() || '');
      });
    });

    return () => {
      instance && instance.toTextArea();
    };
  }, []);

  return (
    <div>
      <label htmlFor={props.id || props.name} className="block font-medium">
        {props.title}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <textarea
          ref={textareaRef}
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
