interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  className?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  className,
}: TextFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 text-left ${className ?? ''}`}>
      <label htmlFor={id} className="text-xs text-gray-400 font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="w-full p-3 rounded-lg border border-line bg-surface-raised text-white text-sm focus:outline-none focus:border-gray-500 placeholder-gray-600 transition-all"
      />
    </div>
  );
}
