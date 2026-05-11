"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  MessageSquare,
  Reply,
  Edit2,
  X,
  Check,
  Trash2,
  Send,
} from "lucide-react";
import {
  getComments,
  createComment,
  getCurrentUserId,
  updateComment,
  deleteComment,
} from "@/app/actions/comment-actions";
import type { Comment } from "@/types/detail";
import { cn } from "@/lib/utils";

interface CommentSectionProps {
  contentItemId: string | null;
  initialComments?: Comment[];
}

type ReplyTo = { id: string; username: string; rootCommentId: string };

function formatDate(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "Baru saja";
  if (m < 60) return `${m} menit yang lalu`;
  if (h < 24) return `${h} jam yang lalu`;
  if (d < 7) return `${d} hari yang lalu`;
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  onReply: (id: string, username: string, rootId: string) => void;
  onUpdate: (id: string, body: string) => Promise<boolean>;
  onDelete: (id: string) => void;
  currentUserId?: string;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  rootCommentId?: string;
}

function CommentItem({
  comment,
  depth = 0,
  onReply,
  onUpdate,
  onDelete,
  currentUserId,
  editingId,
  setEditingId,
  rootCommentId,
}: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [editText, setEditText] = useState(comment.body);
  const [isSaving, setIsSaving] = useState(false);

  const replies = comment.children ?? [];
  const rootId = rootCommentId ?? comment.id;
  const isEditing = editingId === comment.id;
  const isOwner = currentUserId === comment.userId;

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    setIsSaving(true);
    const ok = await onUpdate(comment.id, editText);
    setIsSaving(false);
    if (ok) setEditingId(null);
    else setEditText(comment.body);
  };

  return (
    <div
      className={cn(
        "space-y-2",
        depth > 0 && "ml-8 pl-4 border-l-2 border-border/50",
      )}
    >
      <div className="group flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-[#3477d7] to-[#1b3f71] flex items-center justify-center text-white text-xs font-medium">
          {comment.user?.username?.charAt(0).toUpperCase() ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">
              {comment.user?.username ?? "Unknown"}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                disabled={isSaving}
                className="w-full px-3 py-2 rounded-lg bg-background border border-[#3477d7] text-sm outline-none resize-none focus:ring-2 focus:ring-[#3477d7]"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={isSaving || !editText.trim()}
                  className="gap-1 bg-linear-to-r from-[#3477d7] to-[#1b3f71] text-white"
                >
                  {isSaving ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="w-3 h-3" />
                  )}
                  Simpan
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditText(comment.body);
                    setEditingId(null);
                  }}
                >
                  <X className="w-3 h-3" /> Batal
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-foreground/90 wrap-break-word">
              {comment.body}
            </p>
          )}

          <div className="flex items-center gap-3 mt-1.5">
            {replies.length > 0 && depth === 0 && !showReplies && (
              <button
                onClick={() => setShowReplies(true)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Lihat {replies.length} balasan
              </button>
            )}
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              {depth === 0 && (
                <button
                  onClick={() =>
                    onReply(
                      comment.id,
                      comment.user?.username ?? "Unknown",
                      rootId,
                    )
                  }
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <Reply className="w-3 h-3" /> Balas
                </button>
              )}
              {isOwner && !isEditing && (
                <>
                  <button
                    onClick={() => {
                      setEditText(comment.body);
                      setEditingId(comment.id);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors">
                        <Trash2 className="w-3 h-3" /> Hapus
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus komentar?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {replies.length > 0
                            ? `Komentar ini memiliki ${replies.length} balasan. Setelah dihapus, balasan akan naik menjadi komentar utama.`
                            : "Komentar ini akan dihapus secara permanen."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => onDelete(comment.id)}
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReplies && replies.length > 0 && (
        <div className="space-y-2">
          {replies.map((child) => (
            <CommentItem
              key={child.id}
              comment={{ ...child, children: [] }}
              depth={depth + 1}
              onReply={onReply}
              onUpdate={onUpdate}
              onDelete={onDelete}
              currentUserId={currentUserId}
              editingId={editingId}
              setEditingId={setEditingId}
              rootCommentId={rootId}
            />
          ))}
          <button
            onClick={() => setShowReplies(false)}
            className="ml-11 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Sembunyikan balasan
          </button>
        </div>
      )}
    </div>
  );
}

export function CommentSection({
  contentItemId,
  initialComments = [],
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<ReplyTo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUserId().then(setCurrentUserId);
  }, []);

  // Sync comments when SSR data changes (new episode / drama)
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // Reset form state when navigating to different content
  useEffect(() => {
    setReplyTo(null);
    setError("");
    setNewComment("");
    setEditingId(null);
  }, [contentItemId]);

  const refresh = async () => {
    if (!contentItemId) return;
    const res = await getComments(contentItemId);
    if (res?.success) setComments(res.data);
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !contentItemId) return;
    const userId = currentUserId ?? (await getCurrentUserId());
    if (!userId) {
      setError("Anda harus login untuk berkomentar.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    const res = await createComment({
      userId,
      contentItemId,
      body: newComment,
      parentCommentId: replyTo?.rootCommentId ?? null,
    });
    if (res.success) {
      await refresh();
      setNewComment("");
      setReplyTo(null);
    } else setError(res.message ?? "Gagal mengirim komentar");
    setIsSubmitting(false);
  };

  const handleUpdate = async (id: string, body: string): Promise<boolean> => {
    const res = await updateComment(id, { body });
    if (res.success) {
      await refresh();
      return true;
    }
    setError(res.message ?? "Gagal mengupdate komentar");
    return false;
  };

  const handleDelete = async (id: string) => {
    const res = await deleteComment(id);
    if (res.success) await refresh();
    else setError(res.message ?? "Gagal menghapus komentar");
  };

  return (
    <Card className="border-0 bg-card/80 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <MessageSquare className="w-5 h-5" /> Komentar
          </h2>
          <p className="text-sm text-muted-foreground">
            {comments.length > 0
              ? `${comments.length} komentar`
              : "Jadilah yang pertama berkomentar"}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-background/50 border border-border/50 space-y-3">
          {replyTo && (
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground">
                Membalas{" "}
                <span className="font-medium text-foreground">
                  @{replyTo.username}
                </span>
              </span>
              <button
                onClick={() => setReplyTo(null)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Batal
              </button>
            </div>
          )}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            disabled={!contentItemId}
            placeholder={
              contentItemId ? "Tulis komentar..." : "Komentar tidak tersedia..."
            }
            className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm outline-none resize-none focus:ring-2 focus:ring-[#3477d7] focus:border-[#3477d7] disabled:opacity-50 text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex items-center justify-between">
            {error && <span className="text-xs text-red-500">{error}</span>}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !newComment.trim() || !contentItemId}
              size="sm"
              className="gap-2 bg-linear-to-r from-[#3477d7] to-[#1b3f71] text-white ml-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Kirim
                </>
              )}
            </Button>
          </div>
        </div>

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                onReply={(id, u, r) =>
                  setReplyTo({ id, username: u, rootCommentId: r })
                }
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                currentUserId={currentUserId ?? undefined}
                editingId={editingId}
                setEditingId={setEditingId}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-8">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
