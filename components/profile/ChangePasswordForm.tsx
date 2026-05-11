import { useState } from "react";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/app/actions/auth/change-password";
import { PasswordInput } from "./PasswordInput";
import { formatDateId, calculateAccountAge } from "@/lib/utils/date";

interface ChangePasswordFormProps {
  createdAt?: string;
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

export function ChangePasswordForm({ createdAt }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const joinDate = formatDateId(createdAt);
  const accountAge = calculateAccountAge(createdAt);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Semua field harus diisi");
      return;
    }

    if (currentPassword === newPassword) {
      setError("Password baru harus berbeda dengan password saat ini");
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      setError("Password minimal 8 karakter, harus mengandung huruf kapital, huruf kecil, angka, dan karakter spesial");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setIsLoading(true);
    const result = await changePassword({ currentPassword, newPassword });
    setIsLoading(false);

    if (result.success) {
      setSuccess(result.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-muted/5 p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Ubah Password</h4>
        <span className="text-xs text-muted-foreground">Bergabung sejak {joinDate} ({accountAge} hari)</span>
      </div>

      <div className="space-y-4">
        <PasswordInput
          id="current-password"
          label="Password Saat Ini"
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder="Masukkan password saat ini"
          showPassword={showCurrentPassword}
          onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
          disabled={isLoading}
        />

        <PasswordInput
          id="new-password"
          label="Password Baru"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="Min 8 karakter, A-Z, a-z, 0-9, simbol"
          showPassword={showNewPassword}
          onToggleShow={() => setShowNewPassword(!showNewPassword)}
          disabled={isLoading}
        />

        <PasswordInput
          id="confirm-password"
          label="Konfirmasi Password Baru"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Ulangi password baru"
          showPassword={showConfirmPassword}
          onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
          disabled={isLoading}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}

        <Button
          onClick={handleSubmit}
          disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
          className="w-full bg-[#3477d7] hover:bg-[#2a5fb8] text-white"
        >
          {isLoading ? "Menyimpan..." : "Simpan Password"}
        </Button>
      </div>
    </div>
  );
}
