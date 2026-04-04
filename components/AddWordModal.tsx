"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, CheckCircle2 } from "lucide-react";
import { addWord, updateWord } from "@/app/actions/words";
import { toast as sonnerToast } from "sonner";

function SuccessToast({
  message,
  onDone,
}: {
  message: string;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-1/2 top-5 z-100 -translate-x-1/2 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-neutral-900 px-4 py-3 shadow-2xl shadow-black/50 text-sm text-emerald-400 backdrop-blur-sm"
    >
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </motion.div>
  );
}

export type EditTarget = {
  id: number;
  word: string;
  details: string | null;
};

interface AddWordModalProps {
  /** When provided the modal opens in edit mode (no floating + button) */
  editTarget?: EditTarget | null;
  onEditClose?: () => void;
}

export default function AddWordModal({
  editTarget,
  onEditClose,
}: AddWordModalProps = {}) {
  const isEditMode = editTarget != null;

  const [open, setOpen] = useState(false);
  const [word, setWord] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Pre-fill fields whenever a new edit target arrives
  useEffect(() => {
    if (editTarget) {
      setWord(editTarget.word);
      setDetails(editTarget.details ?? "");
      setError(null);
    }
  }, [editTarget]);

  const isOpen = isEditMode || open;

  function handleClose() {
    if (isPending) return;
    if (isEditMode) {
      onEditClose?.();
    } else {
      setOpen(false);
      setWord("");
      setDetails("");
    }
    setError(null);
  }

  function handleSave() {
    if (!word.trim() || isPending) return;
    setError(null);

    if (isEditMode && editTarget) {
      // Frontend no-change check — skip API call entirely if nothing changed
      const trimmedWord = word.trim();
      const trimmedDetails = details.trim();
      const origWord = editTarget.word.trim();
      const origDetails = (editTarget.details ?? "").trim();

      if (trimmedWord === origWord && trimmedDetails === origDetails) {
        sonnerToast.info("No changes made — everything looks the same!");
        onEditClose?.();
        return;
      }

      startTransition(async () => {
        const result = await updateWord(editTarget.id, word, details);
        if (!result || result.success === false) {
          setError(result?.error ?? "Failed to update word");
          return;
        }
        onEditClose?.();
        setToast("Word updated successfully!");
      });
    } else {
      startTransition(async () => {
        const result = await addWord(word, details);
        if (result?.success === false) {
          setError(result.error);
          return;
        }
        setWord("");
        setDetails("");
        setOpen(false);
        setToast("Word added successfully!");
      });
    }
  }

  return (
    <>
      {/* Success toast */}
      <AnimatePresence>
        {toast && (
          <SuccessToast message={toast} onDone={() => setToast(null)} />
        )}
      </AnimatePresence>

      {/* Floating + button — only rendered in add mode */}
      {!isEditMode && (
        <motion.button
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-2xl shadow-black/40 transition-colors hover:bg-neutral-100"
          aria-label="Add word"
        >
          <Plus className="h-6 w-6" strokeWidth={2.5} />
        </motion.button>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Dialog */}
            <motion.div
              key="dialog"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl"
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {isEditMode ? "Edit Word" : "Add Word"}
                </h2>
                <button
                  onClick={handleClose}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Word field */}
                <div>
                  <label
                    htmlFor="word-input"
                    className="mb-1.5 block text-sm font-medium text-neutral-300"
                  >
                    Word <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="word-input"
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="e.g. Ephemeral"
                    autoFocus
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-white/30 focus:ring-1 focus:ring-white/20"
                  />
                </div>

                {/* Details field */}
                <div>
                  <label
                    htmlFor="details-input"
                    className="mb-1.5 block text-sm font-medium text-neutral-300"
                  >
                    Details{" "}
                    <span className="text-xs font-normal text-neutral-500">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="details-input"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Add a definition, example sentence, or note…"
                    rows={3}
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-white/30 focus:ring-1 focus:ring-white/20"
                  />
                </div>
              </div>

              {/* Error */}
              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={handleClose}
                  disabled={isPending}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!word.trim() || isPending}
                  className="flex min-w-18 items-center justify-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-opacity disabled:opacity-40 hover:enabled:opacity-90"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      {isEditMode ? "Saving…" : "Getting meaning…"}
                    </>
                  ) : isEditMode ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
