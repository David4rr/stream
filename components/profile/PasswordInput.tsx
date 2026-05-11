import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "@/components/icons";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  showPassword: boolean;
  onToggleShow: () => void;
  disabled?: boolean;
}

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  showPassword,
  onToggleShow,
  disabled = false,
}: PasswordInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10 h-[38px]"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}
