import { ReactNode, useRef } from 'react';

type LabeledInputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  leftIcon?: ReactNode;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
};

export function LabeledInput({ label, type = 'text', value, onChange, placeholder, leftIcon, inputMode, autoComplete }: LabeledInputProps) {
  return (
    <div className="group relative border rounded-2xl px-3 py-3 flex items-center gap-2 focus-within:border-blue-500 transition-colors">
      {leftIcon && <div className="text-gray-500 ml-1 select-none">{leftIcon}</div>}
      <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] text-gray-400 group-focus-within:text-blue-600">
        {label}
      </label>
      <input
        className="w-full outline-none bg-transparent text-[16px] placeholder-gray-400"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
      />
    </div>
  );
}

type DateFieldProps = {
  label: string;
  value: string; // yyyy-mm-dd
  onChange: (value: string) => void;
};

function formatPretty(dateStr: string) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map((v) => parseInt(v, 10));
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  if (!y || !m || !d) return '';
  return `${d} ${months[m-1]} ${y}`;
}

export function DateField({ label, value, onChange }: DateFieldProps) {
  const ref = useRef<HTMLInputElement>(null);
  const openPicker = () => {
    const el = ref.current;
    if (!el) return;
    // showPicker is supported in Chromium; fallback to click()
  const anyEl = el as any;
  if (anyEl.showPicker) anyEl.showPicker(); else el.click();
  };
  return (
    <div className="group relative border rounded-2xl px-3 py-3 flex items-center gap-2 focus-within:border-blue-500 transition-colors">
      <div className="text-gray-600 ml-1 select-none">📅</div>
      <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] text-gray-400 group-focus-within:text-blue-600">
        {label}
      </label>
      <button type="button" onClick={openPicker} className="text-left w-full text-[16px] text-gray-900">
        {value ? formatPretty(value) : 'Select date'}
      </button>
      <input ref={ref} type="date" value={value} onChange={(e) => onChange(e.target.value)} className="absolute opacity-0 pointer-events-none" />
    </div>
  );
}

export default LabeledInput;
