"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  BookOpenIcon,
  CheckCircle2Icon,
  PencilIcon,
  SearchIcon,
  StarIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import WordCard, { CARD_PALETTE, ILLUSTRATIONS } from "@/components/WordCard";
import type { WordRow } from "@/app/actions/words";
import {
  toggleFavorite,
  toggleMastered,
  deleteWord,
} from "@/app/actions/words";
import { toast } from "sonner";
import AddWordModal, { type EditTarget } from "@/components/AddWordModal";

type Filter = "all" | "latest" | "oldest" | "favorites" | "mastered";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "latest", label: "Latest" },
  { key: "oldest", label: "Oldest" },
  { key: "favorites", label: "★ Favorites" },
  { key: "mastered", label: "✓ Mastered" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function WordsClient({
  initialWords,
}: {
  initialWords: WordRow[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);

  // Local fav / mastered state seeded from DB values
  const [favs, setFavs] = useState<Set<number>>(
    () => new Set(initialWords.filter((w) => w.isFavorite).map((w) => w.id)),
  );
  const [dones, setDones] = useState<Set<number>>(
    () => new Set(initialWords.filter((w) => w.isMastered).map((w) => w.id)),
  );

  const toggleFav = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const adding = !favs.has(id);
    const word = initialWords.find((w) => w.id === id)?.word ?? "Word";
    setFavs((prev) => {
      const next = new Set(prev);
      adding ? next.add(id) : next.delete(id);
      return next;
    });
    toggleFavorite(id, adding).then((res) => {
      if (res.success) {
        toast[adding ? "success" : "info"](
          adding
            ? `"${word}" added to favourites`
            : `"${word}" removed from favourites`,
        );
      } else {
        toast.error(res.error ?? "Failed to update favourite");
        setFavs((prev) => {
          const next = new Set(prev);
          adding ? next.delete(id) : next.add(id);
          return next;
        });
      }
    });
  };

  const toggleDone = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const adding = !dones.has(id);
    const word = initialWords.find((w) => w.id === id)?.word ?? "Word";
    setDones((prev) => {
      const next = new Set(prev);
      adding ? next.add(id) : next.delete(id);
      return next;
    });
    toggleMastered(id, adding).then((res) => {
      if (res.success) {
        toast[adding ? "success" : "info"](
          adding
            ? `"${word}" marked as mastered!`
            : `"${word}" unmarked as mastered`,
        );
      } else {
        toast.error(res.error ?? "Failed to update mastered");
        setDones((prev) => {
          const next = new Set(prev);
          adding ? next.delete(id) : next.add(id);
          return next;
        });
      }
    });
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(null);
    deleteWord(id).then((res) => {
      if (res.success) {
        toast.success("Word deleted");
      } else {
        toast.error(res.error ?? "Failed to delete word");
      }
    });
  };

  // Filter + sort pipeline
  let words = initialWords.filter((w) =>
    w.word.toLowerCase().includes(query.toLowerCase()),
  );
  if (filter === "latest")
    words = [...words].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  if (filter === "oldest")
    words = [...words].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  if (filter === "favorites") words = words.filter((w) => favs.has(w.id));
  if (filter === "mastered") words = words.filter((w) => dones.has(w.id));

  const selectedWord = initialWords.find((w) => w.id === selectedId);
  const selectedIndex = initialWords.findIndex((w) => w.id === selectedId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="min-h-screen px-4 pb-24">
      <div className="mx-auto max-w-5xl pt-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            My Words
          </h1>
          <p className="text-sm text-neutral-400">
            All the words you&apos;ve anchored so far.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your word"
            className="w-full rounded-xl bg-neutral-900 border border-neutral-800 pl-10 pr-4 py-2.5 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all"
          />
        </div>

        {/* Filter chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all border ${
                filter === key
                  ? "bg-white text-neutral-950 border-white"
                  : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-neutral-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Word Grid */}
        {words.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-neutral-500">
            <BookOpenIcon className="h-10 w-10 opacity-30" />
            <p className="text-sm">No words found.</p>
          </div>
        ) : (
          <motion.div
            key={filter}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {words.map((w, i) => {
              const palette = CARD_PALETTE[i % CARD_PALETTE.length];
              const isFav = favs.has(w.id);
              const isDone = dones.has(w.id);
              return (
                <motion.div key={w.id} variants={item} className="relative">
                  <motion.div
                    layoutId={`card-${w.id}`}
                    onClick={() => setSelectedId(w.id)}
                    className="relative rounded-3xl overflow-hidden shadow-lg cursor-pointer h-44"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <WordCard
                      word={w.word}
                      meaning={w.meaning ?? w.details ?? ""}
                      example={w.example ?? ""}
                      bg={palette.bg}
                      text={palette.text}
                      illustrationIndex={i % ILLUSTRATIONS.length}
                    />
                  </motion.div>

                  {/* Mastered badge */}
                  {isDone && (
                    <span
                      className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        color: palette.text,
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        background: "rgba(0,0,0,0.25)",
                      }}
                    >
                      <CheckCircle2Icon className="h-2.5 w-2.5" /> Mastered
                    </span>
                  )}

                  {/* Action buttons */}
                  <div className="absolute bottom-2.5 right-2.5 z-10 flex gap-1.5">
                    <button
                      onClick={(e) => toggleFav(w.id, e)}
                      className="rounded-full p-1.5 transition-colors"
                      style={{
                        background: "rgba(0,0,0,0.22)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                      }}
                      title={
                        isFav ? "Remove from favorites" : "Add to favorites"
                      }
                    >
                      <StarIcon
                        className="h-3.5 w-3.5"
                        style={{ color: palette.text }}
                        fill={isFav ? "currentColor" : "none"}
                      />
                    </button>
                    <button
                      onClick={(e) => toggleDone(w.id, e)}
                      className="rounded-full p-1.5 transition-colors"
                      style={{
                        background: "rgba(0,0,0,0.22)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                      }}
                      title={
                        isDone ? "Mark as not mastered" : "Mark as mastered"
                      }
                    >
                      <CheckCircle2Icon
                        className="h-3.5 w-3.5"
                        style={{ color: palette.text }}
                        fill={isDone ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Expanded Card Overlay */}
      <AnimatePresence>
        {selectedId !== null && selectedWord && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 z-40 backdrop-blur-md bg-black/50"
            />

            {/* Expanded card */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
              <div className="relative w-full max-w-sm pointer-events-auto flex gap-3">
                {/* Card */}
                <motion.div
                  layoutId={`card-${selectedId}`}
                  className="relative flex-1 rounded-3xl overflow-hidden shadow-2xl aspect-7/10"
                >
                  <WordCard
                    word={selectedWord.word}
                    meaning={selectedWord.meaning ?? selectedWord.details ?? ""}
                    example={selectedWord.example ?? ""}
                    bg={CARD_PALETTE[selectedIndex % CARD_PALETTE.length].bg}
                    text={
                      CARD_PALETTE[selectedIndex % CARD_PALETTE.length].text
                    }
                    illustrationIndex={selectedIndex % ILLUSTRATIONS.length}
                  />
                </motion.div>

                {/* Action column */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="flex flex-col justify-center gap-2.5"
                >
                  {/* Close */}
                  <button
                    onClick={() => setSelectedId(null)}
                    className="h-9 w-9 flex items-center justify-center rounded-2xl bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700 transition-colors"
                    title="Close"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>

                  <div className="h-px w-full bg-neutral-700" />

                  {/* Favorite */}
                  <button
                    onClick={(e) => toggleFav(selectedId, e)}
                    className={`h-9 w-9 flex items-center justify-center rounded-2xl border transition-colors ${
                      favs.has(selectedId)
                        ? "bg-amber-400/15 border-amber-400/40 text-amber-300"
                        : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-amber-300 hover:bg-amber-400/10"
                    }`}
                    title={
                      favs.has(selectedId)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <StarIcon
                      className="h-4 w-4"
                      fill={favs.has(selectedId) ? "currentColor" : "none"}
                    />
                  </button>

                  {/* Mastered */}
                  <button
                    onClick={(e) => toggleDone(selectedId, e)}
                    className={`h-9 w-9 flex items-center justify-center rounded-2xl border transition-colors ${
                      dones.has(selectedId)
                        ? "bg-neutral-200/15 border-neutral-300/40 text-neutral-200"
                        : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-200/10"
                    }`}
                    title={
                      dones.has(selectedId)
                        ? "Mark as not mastered"
                        : "Mark as mastered"
                    }
                  >
                    <CheckCircle2Icon
                      className="h-4 w-4"
                      fill={dones.has(selectedId) ? "currentColor" : "none"}
                    />
                  </button>

                  <div className="h-px w-full bg-neutral-700" />

                  {/* Edit */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(null);
                      setEditTarget({
                        id: selectedId,
                        word: selectedWord.word,
                        details: selectedWord.details,
                      });
                    }}
                    className="h-9 w-9 flex items-center justify-center rounded-2xl bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700 transition-colors"
                    title="Edit word"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(e) => handleDelete(selectedId, e)}
                    className="h-9 w-9 flex items-center justify-center rounded-2xl bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                    title="Delete word"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </button>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Edit modal — opens when a word's edit button is clicked */}
      <AddWordModal
        editTarget={editTarget}
        onEditClose={() => setEditTarget(null)}
      />
    </main>
  );
}
