import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

interface Option<T = any> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface Props<T = any> {
  label: string;
  value?: T | null;
  placeholder?: string;
  options: Option<T>[];
  onChange: (v: T) => void;
  disabled?: boolean;
  className?: string;
}

export default function DropdownField<T>({
  label,
  value,
  placeholder = "Selecciona...",
  options,
  onChange,
  disabled,
  className,
}: Props<T>) {
  return (
    <div className={className}>
      <label className="block text-sm text-default-500 mb-2">{label}</label>
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <button
            type="button"
            className="w-full text-left px-3 py-2 border rounded flex justify-between items-center"
            disabled={disabled}
          >
            <span>
              {value
                ? options.find((o) => o.value === value)?.label
                : placeholder}
            </span>
            <span className="text-sm opacity-70">▾</span>
          </button>
        </DropdownTrigger>
        <DropdownMenu>
          {options.map((o) => (
            <DropdownItem
              key={String(o.value)}
              onClick={() => onChange(o.value)}
              isDisabled={o.disabled}
            >
              {o.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
