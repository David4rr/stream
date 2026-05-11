import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/store/auth-slice";
import { useAppDispatch } from "@/store/hooks";
import { deleteAccount } from "@/app/actions/auth/delete-account";

export function DeleteAccountSection({ userId }: { userId?: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteAccount = async () => {
    if (!userId) return;

    setIsDeleting(true);
    setDeleteError("");

    const result = await deleteAccount(userId);
    setIsDeleting(false);

    if (result.success) {
      await dispatch(logout());
      router.push("/login");
    } else {
      setDeleteError(result.error);
    }
  };

  return (
    <div className="rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h5 className="text-sm font-semibold text-red-600 dark:text-red-400">Hapus Akun</h5>
          <p className="text-xs text-muted-foreground mt-1">Tindakan ini permanen dan tidak dapat dibatalkan</p>
        </div>
        {!showDeleteConfirm ? (
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} size="sm">
            Hapus
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeleteError("");
              }}
              disabled={isDeleting}
              size="sm"
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting} size="sm">
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </div>
        )}
      </div>
      {deleteError && <p className="text-sm text-red-500 mt-3">{deleteError}</p>}
    </div>
  );
}
