"use client";

import { useState, useEffect } from "react";
import { Star, Send, AlertCircle } from "lucide-react";
import { sendFeedback } from "@/app/actions/feedback";

export function FeedbackForm({ isPopup = false, onClose }: { isPopup?: boolean; onClose?: (submitted: boolean) => void }) {
  // Prevent closing with ESC key before submitting feedback
  useEffect(() => {
    if (!isPopup) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isPopup]);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      setError("Silakan pilih rating bintang.");
      return;
    }
    if (!category) {
      setError("Silakan pilih kategori.");
      return;
    }
    if (!title.trim()) {
      setError("Subjek tidak boleh kosong.");
      return;
    }
    if (content.length < 10) {
      setError("Deskripsi minimal 10 karakter.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await sendFeedback({
        title,
        content,
        category: category.toLowerCase(),
        rating,
      });

      if (!result.success) {
        setError(result.message || "Gagal mengirim feedback. Silakan coba lagi.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormContent = (
    <div
      className="w-full max-w-2xl mx-auto bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-2xl"
    >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Kirim Masukan</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Bantu kami meningkatkan layanan kami</p>
          {!submitted && isPopup && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                Wajib diisi untuk melanjutkan
              </span>
            </div>
          )}
        </div>

        {submitted ? (
          <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Terima Kasih!</h4>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Masukan Anda sangat berharga bagi kami.</p>
            {onClose ? (
              <button
                type="button"
                onClick={() => onClose?.(true)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all"
              >
                Lanjut Nonton
              </button>
            ) : (
              <button
                onClick={() => {
                  setSubmitted(false);
                  setTitle("");
                  setContent("");
                  setCategory("");
                  setRating(0);
                }}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
              >
                Kirim masukan lain
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col items-center gap-2 mb-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating Website</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none bg-no-repeat bg-right-4"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="" disabled>Pilih kategori...</option>
                <option value="General">General</option>
                <option value="Bug">Bug</option>
                <option value="Feature">Feature</option>
                <option value="Improvement">Improvement</option>
              </select>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Subjek / Topik"
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan masukan Anda di sini... (minimal 10 karakter)"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-xs ${content.length < 10 ? 'text-red-500' : 'text-gray-400'}`}>
                    {content.length} / 10 karakter
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !rating || !category || content.length < 10}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Masukan</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
  );

  if (isPopup) {
    return FormContent;
  }

  return (
    <div className="w-full bg-white dark:bg-[#0e0e0e] border-t border-gray-200 dark:border-white/10 py-16 px-4 relative z-10">
      {FormContent}
    </div>
  );
}
