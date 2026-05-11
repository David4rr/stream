import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import type { AccountInfo } from "./types";

interface AccountInfoCardProps extends AccountInfo {
  isEditing: boolean;
  formData: { username: string; displayName: string; email: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting?: boolean;
}

export function AccountInfoCard({
  userName,
  displayName,
  userEmail,
  subscriptionType,
  isEditing,
  formData,
  onInputChange,
  isSubmitting = false,
}: AccountInfoCardProps) {
  const memberStatus = subscriptionType || "Belum Member";

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="edit-username" className="text-sm text-muted-foreground">Username</label>
          <Input
            id="edit-username"
            name="username"
            value={formData.username}
            onChange={onInputChange}
            disabled={isSubmitting}
            className="h-[38px]"
          />
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <label htmlFor="edit-displayName" className="text-sm text-muted-foreground">Nama Tampilan</label>
          <Input
            id="edit-displayName"
            name="displayName"
            value={formData.displayName}
            onChange={onInputChange}
            disabled={isSubmitting}
            className="h-[38px]"
          />
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <label htmlFor="edit-email" className="text-sm text-muted-foreground">Alamat Email</label>
          <Input
            id="edit-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onInputChange}
            disabled={isSubmitting}
            className="h-[38px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Username</span>
        <span className="text-sm font-medium text-foreground">{userName}</span>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Nama Tampilan</span>
        <span className="text-sm font-medium text-foreground">{displayName}</span>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Alamat Email</span>
        <span className="text-sm font-medium text-foreground">{userEmail}</span>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Status Member</span>
        <span className="text-sm font-medium text-foreground">{memberStatus}</span>
      </div>
    </div>
  );
}
