"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Swiper as SwiperType } from "swiper";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-cards";
import "swiper/css";
import { CheckCircle2Icon, StarIcon, Volume2Icon } from "lucide-react";
import { toast } from "sonner";
import WordCard, { CARD_PALETTE } from "@/components/WordCard";
import type { WordRow } from "@/app/actions/words";
import { toggleFavorite, toggleMastered } from "@/app/actions/words";

// Jagged tear clip-paths (the split runs vertically down the middle ~50%)
const LEFT_CLIP =
  "polygon(0% 0%, 50% 0%, 53% 5%, 47% 12%, 54% 19%, 46% 27%, 53% 34%, 47% 41%, 54% 48%, 46% 55%, 53% 63%, 47% 70%, 54% 77%, 46% 84%, 53% 91%, 50% 100%, 0% 100%)";
const RIGHT_CLIP =
  "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 53% 91%, 46% 84%, 54% 77%, 47% 70%, 53% 63%, 46% 55%, 54% 48%, 47% 41%, 53% 34%, 46% 27%, 54% 19%, 47% 12%, 53% 5%)";

// ─── Main Component ──────────────────────────────────────────────────────────

export default function FlashCard({ words }: { words: WordRow[] }) {
  const [shuffled, setShuffled] = useState(words);
  const [favs, setFavs] = useState<Set<number>>(
    () => new Set(words.filter((w) => w.isFavorite).map((w) => w.id)),
  );
  const [mastered, setMastered] = useState<Set<number>>(
    () => new Set(words.filter((w) => w.isMastered).map((w) => w.id)),
  );
  const [activeRealIdx, setActiveRealIdx] = useState(0);
  const [rippingId, setRippingId] = useState<number | null>(null);
  const [favAnimId, setFavAnimId] = useState<number | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  // Store card data at the moment master is pressed so overlay renders correctly
  const rippingCardRef = useRef<{ card: WordRow; paletteIdx: number } | null>(
    null,
  );
  const nextCardRef = useRef<{ card: WordRow; paletteIdx: number } | null>(
    null,
  );
  // Index to restore after the mastered card is removed & Swiper remounts
  const masteredTargetIdxRef = useRef(0);

  // Shuffle client-only to avoid SSR hydration mismatch
  useEffect(() => {
    setShuffled([...words].sort(() => Math.random() - 0.5));
  }, [words]);

  // Filter out mastered cards
  const displayWords = shuffled.filter((w) => !mastered.has(w.id));

  // Current visible card
  const currentCard =
    displayWords[activeRealIdx % Math.max(1, displayWords.length)];

  // Stable palette: keyed off the card's position in the *shuffled* array so
  // mastering a card never shifts any other card's color or illustration.
  const getPaletteIdx = (card: WordRow) => {
    const i = shuffled.findIndex((w) => w.id === card.id);
    return (i === -1 ? 0 : i) % CARD_PALETTE.length;
  };

  // Global arrow-key navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const swiper = swiperRef.current;
      if (!swiper || swiper.animating) return;
      if (e.key === "ArrowLeft") swiper.slidePrev(650);
      if (e.key === "ArrowRight") swiper.slideNext(650);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleFav = () => {
    if (!currentCard) return;
    const id = currentCard.id;
    const word = currentCard.word;
    const adding = !favs.has(id);
    setFavAnimId(id);
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
      }
    });
    setTimeout(() => setFavAnimId(null), 900);
  };

  const speakWord = (word: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(word);
    utt.lang = "en-US";
    utt.rate = 0.88;
    utt.pitch = 1.0;
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const priority = [
        (v: SpeechSynthesisVoice) => v.name === "Google US English",
        (v: SpeechSynthesisVoice) => v.name === "Samantha",
        (v: SpeechSynthesisVoice) => v.name === "Daniel",
        (v: SpeechSynthesisVoice) =>
          v.lang.startsWith("en") && !v.name.includes("Microsoft"),
        (v: SpeechSynthesisVoice) => v.lang.startsWith("en"),
      ];
      for (const test of priority) {
        const match = voices.find(test);
        if (match) return match;
      }
      return null;
    };
    const voice = pickVoice();
    if (voice) {
      utt.voice = voice;
      window.speechSynthesis.speak(utt);
    } else {
      // Voices not yet loaded — wait for them
      window.speechSynthesis.onvoiceschanged = () => {
        const v = pickVoice();
        if (v) utt.voice = v;
        window.speechSynthesis.speak(utt);
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  };

  const handleMaster = () => {
    if (!currentCard || rippingId !== null) return;
    const id = currentCard.id;
    const word = currentCard.word;
    const idx = displayWords.findIndex((w) => w.id === id);
    rippingCardRef.current = {
      card: currentCard,
      paletteIdx: getPaletteIdx(currentCard),
    };
    // After removal the next card may shift position but its palette is stable.
    const isLastCard = idx === displayWords.length - 1;
    const targetIdx = isLastCard ? 0 : idx;
    const nextRawIdx = (idx + 1) % displayWords.length;
    const nextCard = displayWords.length > 1 ? displayWords[nextRawIdx] : null;
    nextCardRef.current = nextCard
      ? { card: nextCard, paletteIdx: getPaletteIdx(nextCard) }
      : null;
    masteredTargetIdxRef.current = targetIdx;
    setRippingId(id);
    toggleMastered(id, true).then((res) => {
      if (res.success) {
        toast.success(`"${word}" marked as mastered!`);
      } else {
        toast.error(res.error ?? "Failed to mark as mastered");
      }
    });
    // No slideNext here — let the rip play fully over the correct card
  };

  // Called when the rip-right piece finishes its animate → triggers cleanup
  const onRipComplete = () => {
    setRippingId((id) => {
      if (id !== null) {
        setMastered((prev) => new Set([...prev, id]));
      }
      return null;
    });
    setActiveRealIdx(masteredTargetIdxRef.current);
    rippingCardRef.current = null;
    nextCardRef.current = null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col items-center gap-4"
    >
      {/* Swiper easing override */}
      <style>{`
        .swiper-cards .swiper-slide {
          transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1) !important;
        }
      `}</style>

      {displayWords.length === 0 ? (
        <div className="flex flex-col items-center gap-3 h-[500px] md:h-[520px] justify-center text-neutral-500">
          <CheckCircle2Icon className="h-10 w-10 opacity-30" />
          <p className="text-sm">All words mastered!</p>
        </div>
      ) : (
        <>
          {/* Wrapper keeps rip pieces positioned relative to the card */}
          <div className="relative w-[280px] h-[500px] md:w-[380px] md:h-[520px]">
            <Swiper
              key={mastered.size}
              effect="cards"
              grabCursor={true}
              loop={displayWords.length > 1}
              speed={650}
              initialSlide={activeRealIdx}
              modules={[EffectCards]}
              onSwiper={(s) => {
                swiperRef.current = s;
              }}
              onSlideChangeTransitionEnd={(s) => setActiveRealIdx(s.realIndex)}
              className="h-full w-full"
            >
              {displayWords.map((card) => {
                const pIdx = getPaletteIdx(card);
                const palette = CARD_PALETTE[pIdx];
                return (
                  <SwiperSlide key={card.id} className="rounded-3xl shadow-2xl">
                    <WordCard
                      word={card.word}
                      meaning={card.meaning ?? undefined}
                      example={card.example ?? undefined}
                      bg={palette.bg}
                      text={palette.text}
                      illustrationIndex={pIdx % 5}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* ── Paper-rip overlay: two halves fall away ── */}
            <AnimatePresence>
              {rippingId !== null && rippingCardRef.current && (
                <>
                  {/* Next card backdrop — revealed as the rip pieces fall away */}
                  {nextCardRef.current ? (
                    <div
                      className="absolute inset-0 rounded-3xl overflow-hidden"
                      style={{ zIndex: 40 }}
                    >
                      <WordCard
                        word={nextCardRef.current.card.word}
                        meaning={nextCardRef.current.card.meaning ?? undefined}
                        example={nextCardRef.current.card.example ?? undefined}
                        bg={CARD_PALETTE[nextCardRef.current.paletteIdx].bg}
                        text={CARD_PALETTE[nextCardRef.current.paletteIdx].text}
                        illustrationIndex={nextCardRef.current.paletteIdx % 5}
                      />
                    </div>
                  ) : (
                    // Last card — just use dark bg so pieces fall into darkness
                    <div
                      className="absolute inset-0 rounded-3xl bg-neutral-950"
                      style={{ zIndex: 40 }}
                    />
                  )}

                  {/* Left piece — falls bottom-left, rotates counter-clockwise */}
                  <motion.div
                    key="rip-left"
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{ clipPath: LEFT_CLIP, zIndex: 50 }}
                    initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
                    animate={{ y: "90%", x: "-22%", rotate: -28, opacity: 0 }}
                    transition={{
                      duration: 0.62,
                      ease: [0.4, 0, 0.9, 0.6],
                    }}
                  >
                    <WordCard
                      word={rippingCardRef.current.card.word}
                      meaning={rippingCardRef.current.card.meaning ?? undefined}
                      example={rippingCardRef.current.card.example ?? undefined}
                      bg={CARD_PALETTE[rippingCardRef.current.paletteIdx].bg}
                      text={
                        CARD_PALETTE[rippingCardRef.current.paletteIdx].text
                      }
                      illustrationIndex={rippingCardRef.current.paletteIdx % 5}
                    />
                  </motion.div>

                  {/* Right piece — falls bottom-right, rotates clockwise.
                      onAnimationComplete fires after this piece finishes → cleanup */}
                  <motion.div
                    key="rip-right"
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{ clipPath: RIGHT_CLIP, zIndex: 50 }}
                    initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
                    animate={{ y: "90%", x: "22%", rotate: 28, opacity: 0 }}
                    transition={{
                      duration: 0.62,
                      ease: [0.4, 0, 0.9, 0.6],
                    }}
                    onAnimationComplete={onRipComplete}
                  >
                    <WordCard
                      word={rippingCardRef.current.card.word}
                      meaning={rippingCardRef.current.card.meaning ?? undefined}
                      example={rippingCardRef.current.card.example ?? undefined}
                      bg={CARD_PALETTE[rippingCardRef.current.paletteIdx].bg}
                      text={
                        CARD_PALETTE[rippingCardRef.current.paletteIdx].text
                      }
                      illustrationIndex={rippingCardRef.current.paletteIdx % 5}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Action buttons — below the deck so cards never cover them */}
          {currentCard && (
            <div className="flex items-center gap-3">
              {/* Speak */}
              <div className="relative group">
                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                  Pronounce word
                </span>
                <button
                  onClick={() => {
                    // Read realIndex directly from Swiper ref to avoid stale-closure issues
                    const idx = swiperRef.current?.realIndex ?? activeRealIdx;
                    const card =
                      displayWords[idx % Math.max(1, displayWords.length)];
                    if (card) speakWord(card.word);
                  }}
                  className="h-9 w-9 flex items-center justify-center rounded-2xl bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-sky-300 hover:bg-sky-400/10 hover:border-sky-500/30 transition-colors"
                >
                  <Volume2Icon className="h-4 w-4" />
                </button>
              </div>
              {/* Favorite */}
              <div className="relative group">
                {/* Tooltip */}
                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                  {favs.has(currentCard.id)
                    ? "Remove from favourites"
                    : "Add to favourites"}
                </span>
                <button
                  onClick={handleFav}
                  className={`h-9 w-9 flex items-center justify-center rounded-2xl border transition-colors ${
                    favs.has(currentCard.id)
                      ? "bg-amber-400/15 border-amber-400/40 text-amber-300"
                      : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-amber-300 hover:bg-amber-400/10"
                  }`}
                >
                  <StarIcon
                    className="h-4 w-4"
                    fill={favs.has(currentCard.id) ? "currentColor" : "none"}
                  />
                </button>
                <AnimatePresence>
                  {favAnimId === currentCard.id && (
                    <motion.div
                      key="star-fly"
                      initial={{ opacity: 1, scale: 0.6, y: 0, x: 0 }}
                      animate={{ opacity: 0, scale: 1.8, y: -48, x: 4 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <StarIcon
                        className="h-5 w-5 text-amber-300"
                        fill="currentColor"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Master */}
              <div className="relative group">
                {/* Tooltip */}
                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                  Mark as mastered — removes from deck
                </span>
                <button
                  onClick={handleMaster}
                  disabled={rippingId !== null}
                  className="h-9 w-9 flex items-center justify-center rounded-2xl bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700 transition-colors disabled:opacity-40"
                >
                  <CheckCircle2Icon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <p className="text-neutral-500 text-xs tracking-wide">
            swipe to change card
          </p>
        </>
      )}
    </motion.div>
  );
}
