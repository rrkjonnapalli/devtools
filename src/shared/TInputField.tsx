export type TInputFieldProps = {
  label: string;
  value: number;
  onChange?: (value: string) => void;
  onValueChange?: (value: number) => void;
  placeholder?: string;
  type?: string;
};
export function TInputField({ label, value, onValueChange, onChange, placeholder, type = "number" }: TInputFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-text px-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => {
          onChange?.(e.target.value);
          onValueChange?.(Number(e.target.value));
        }}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-transparent border-b border-border text-text placeholder-text-light focus:border-primary focus:outline-none transition-colors"
      />
    </div>
  );
};