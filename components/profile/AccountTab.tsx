import { useState } from "react";
import { AppDispatch } from "@/store";
import { updateProfile } from "@/store/auth-slice";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit02Icon, Tick01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { AccountInfoCard } from "./AccountInfoCard";
import { BillingButton } from "./BillingButton";
import type { AccountInfo } from "./types";

interface AccountTabProps extends AccountInfo {
  dispatch: AppDispatch;
}

const VALIDATION = {
  username: /^[a-zA-Z0-9]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  displayName: /^[a-zA-Z0-9 ]+$/,
};

const ERROR_MESSAGES = {
  usernameRequired: "Username tidak boleh kosong",
  usernameInvalid: "Username hanya boleh mengandung huruf dan angka (tanpa spasi)",
  emailRequired: "Email tidak boleh kosong",
  emailInvalid: "Format email tidak valid",
  displayNameRequired: "Nama tampilan tidak boleh kosong",
  displayNameInvalid: "Nama tampilan hanya boleh mengandung huruf, angka, dan spasi",
  userIdNotFound: "User ID tidak ditemukan",
  updateFailed: "Gagal mengupdate profil",
};

export function AccountTab({
  displayName,
  userEmail,
  userName,
  subscriptionType,
  userId,
  dispatch,
}: AccountTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    username: userName || "",
    email: userEmail || "",
    displayName: displayName || "",
  });

  const [originalData] = useState({
    username: userName || "",
    email: userEmail || "",
    displayName: displayName || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.username.trim()) return ERROR_MESSAGES.usernameRequired;
    if (!VALIDATION.username.test(formData.username)) return ERROR_MESSAGES.usernameInvalid;

    if (!formData.email.trim()) return ERROR_MESSAGES.emailRequired;
    if (!VALIDATION.email.test(formData.email)) return ERROR_MESSAGES.emailInvalid;

    if (!formData.displayName.trim()) return ERROR_MESSAGES.displayNameRequired;
    if (!VALIDATION.displayName.test(formData.displayName)) return ERROR_MESSAGES.displayNameInvalid;

    return null;
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!userId) {
      setError(ERROR_MESSAGES.userIdNotFound);
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    const result = await dispatch(updateProfile({
      userId,
      username: formData.username,
      email: formData.email,
      displayName: formData.displayName,
    }));

    setIsSubmitting(false);

    if (updateProfile.fulfilled.match(result)) {
      setSuccess("Profil berhasil diupdate!");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } else {
      const errorMessage = result.payload as { error?: string };
      setError(errorMessage.error || ERROR_MESSAGES.updateFailed);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const hasChanges = Object.keys(formData).some(
    (key) => formData[key as keyof typeof formData] !== originalData[key as keyof typeof originalData]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-muted/5 p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Informasi Akun</h4>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4" />
              <span className="text-xs">Edit</span>
            </Button>
          )}
        </div>

        <AccountInfoCard
          userName={userName}
          displayName={displayName}
          userEmail={userEmail}
          subscriptionType={subscriptionType}
          isEditing={isEditing}
          formData={formData}
          onInputChange={handleInputChange}
          isSubmitting={isSubmitting}
        />

        {isEditing && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting || !hasChanges} className="gap-1.5">
              {isSubmitting ? "Menyimpan..." : (
                <>
                  <HugeiconsIcon icon={Tick01Icon} className="h-4 w-4" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}
      </div>

      <div className="rounded-2xl border border-border bg-muted/5 p-6">
        <h4 className="text-sm font-semibold text-foreground mb-4">Support me</h4>
        <div className="space-y-3">
          <BillingButton />
          {/* <Button variant="outline" className="w-full justify-start" disabled>
            <HugeiconsIcon icon={InformationCircleIcon} className="h-4 w-4 mr-2" />
            Riwayat Pembayaran
          </Button> */}
        </div>
      </div>
    </div>
  );
}
