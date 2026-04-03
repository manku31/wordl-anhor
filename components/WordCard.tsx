// ─── Shared Word Flashcard Component ────────────────────────────────────────
// Used by FlashCard (swiper) and the My Words grid page

// ─── Botanical SVG Illustrations ────────────────────────────────────────────

const Cactus = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 60 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 70 L30 20"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M30 40 C30 40 30 28 20 28 C20 28 20 40 20 40"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M20 34 L14 34"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M30 35 C30 35 30 23 40 23 C40 23 40 35 40 35"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M40 29 L46 29"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <ellipse
      cx="30"
      cy="72"
      rx="8"
      ry="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <circle
      cx="30"
      cy="20"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <circle
      cx="20"
      cy="28"
      r="2"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <circle
      cx="40"
      cy="23"
      r="2"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

const Succulent = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse
      cx="35"
      cy="35"
      rx="6"
      ry="6"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M35 29 C35 29 32 18 24 20 C24 20 26 30 35 29Z"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
    />
    <path
      d="M35 29 C35 29 38 18 46 20 C46 20 44 30 35 29Z"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
    />
    <path
      d="M41 35 C41 35 52 32 50 24 C50 24 40 26 41 35Z"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
    />
    <path
      d="M29 35 C29 35 18 32 20 24 C20 24 30 26 29 35Z"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
    />
    <path
      d="M41 41 C41 41 52 44 50 52 C50 52 40 50 41 41Z"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
    />
    <path
      d="M29 41 C29 41 18 44 20 52 C20 52 30 50 29 41Z"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
    />
    <path
      d="M35 41 C35 41 32 52 24 50 C24 50 26 40 35 41Z"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
    />
    <path
      d="M35 41 C35 41 38 52 46 50 C46 50 44 40 35 41Z"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
    />
  </svg>
);

const Leaves = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 60 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 75 L30 30"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M30 55 C30 55 14 50 14 36 C14 36 28 38 30 55Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M30 44 C30 44 46 39 46 25 C46 25 32 27 30 44Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M30 65 C30 65 18 58 20 48"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14 36 L30 55"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <path
      d="M46 25 L30 44"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="2 2"
    />
  </svg>
);

const Aloe = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 70 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M35 75 L35 45"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M35 60 C35 60 20 58 16 44 C16 44 28 42 35 60Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M35 60 C35 60 50 58 54 44 C54 44 42 42 35 60Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M35 48 C35 48 22 44 20 30 C20 30 32 30 35 48Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M35 48 C35 48 48 44 50 30 C50 30 38 30 35 48Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M35 38 C35 38 28 30 30 18 C30 18 38 20 35 38Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

const PricklyPear = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 60 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse
      cx="30"
      cy="60"
      rx="12"
      ry="14"
      stroke="currentColor"
      strokeWidth="2"
    />
    <ellipse
      cx="20"
      cy="44"
      rx="10"
      ry="12"
      stroke="currentColor"
      strokeWidth="2"
      transform="rotate(-15 20 44)"
    />
    <ellipse
      cx="40"
      cy="44"
      rx="10"
      ry="12"
      stroke="currentColor"
      strokeWidth="2"
      transform="rotate(15 40 44)"
    />
    <ellipse
      cx="30"
      cy="30"
      rx="9"
      ry="11"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="28" cy="55" r="1" fill="currentColor" />
    <circle cx="33" cy="62" r="1" fill="currentColor" />
    <circle cx="27" cy="65" r="1" fill="currentColor" />
    <circle cx="18" cy="42" r="1" fill="currentColor" />
    <circle cx="22" cy="48" r="1" fill="currentColor" />
  </svg>
);

// ─── Exports ─────────────────────────────────────────────────────────────────

export const ILLUSTRATIONS = [Cactus, Succulent, Leaves, Aloe, PricklyPear];

export const CARD_PALETTE = [
  { bg: "#f2d5cf", text: "#7a4f4a" },
  { bg: "#ddb8b1", text: "#5c3530" },
  { bg: "#fae8e4", text: "#8a5652" },
  { bg: "#e8c4bc", text: "#6b3f3a" },
  { bg: "#c9938a", text: "#fff5f3" },
  { bg: "#f5cec8", text: "#7a4f4a" },
  { bg: "#f0ddd9", text: "#8a5652" },
  { bg: "#bf8a84", text: "#fff5f3" },
];

function meaningFontSize(text: string): string {
  const len = text.length;
  if (len > 120) return "0.65rem";
  if (len > 80) return "0.72rem";
  if (len > 50) return "0.78rem";
  return "0.85rem";
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface WordCardProps {
  word: string;
  meaning?: string;
  example?: string;
  bg: string;
  text: string;
  illustrationIndex: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WordCard({
  word,
  meaning,
  example,
  bg,
  text,
  illustrationIndex,
}: WordCardProps) {
  const Illustration = ILLUSTRATIONS[illustrationIndex % ILLUSTRATIONS.length];

  return (
    <div
      className="relative h-full w-full rounded-3xl overflow-hidden flex flex-col p-5 select-none"
      style={{ backgroundColor: bg, color: text }}
    >
      {/* Botanical — top right */}
      <div className="absolute top-2 right-2 opacity-30">
        <Illustration className="h-16 w-16" />
      </div>

      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none rounded-3xl"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Word */}
      <div className="relative z-10 mt-1">
        <p
          className="font-bold leading-tight"
          style={{
            fontFamily: "var(--font-dancing-script), cursive",
            fontSize: "clamp(1.6rem, 6vw, 2rem)",
          }}
        >
          {word}
        </p>
      </div>

      {/* Divider */}
      <div
        className="relative z-10 my-2.5 h-px w-10 rounded-full opacity-30"
        style={{ backgroundColor: text }}
      />

      {/* Meaning */}
      <div className="relative z-10 flex-1">
        <p
          className="leading-snug opacity-90"
          style={{ fontSize: meaningFontSize(meaning ?? "") }}
        >
          {meaning}
        </p>
      </div>

      {/* Example */}
      {example && (
        <div className="relative z-10 mt-2 pt-2 border-t border-current/20">
          <p
            className="italic leading-snug opacity-60 line-clamp-3"
            style={{ fontSize: "0.65rem" }}
          >
            e.g. {example}
          </p>
        </div>
      )}

      {/* Botanical — bottom right */}
      <div className="absolute bottom-2 right-2 opacity-15">
        <Illustration className="h-10 w-10 rotate-12" />
      </div>
    </div>
  );
}
