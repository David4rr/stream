import { ChangePasswordForm } from "./ChangePasswordForm";
import { DeleteAccountSection } from "./DeleteAccountSection";
import type { SecurityInfo } from "./types";

export function SecurityTab({ userId, createdAt }: SecurityInfo) {
  return (
    <div className="space-y-6">
      <ChangePasswordForm createdAt={createdAt} />
      <DeleteAccountSection userId={userId} />
    </div>
  );
}
