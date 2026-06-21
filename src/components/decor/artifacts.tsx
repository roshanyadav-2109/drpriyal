import { cn } from "@/lib/utils";

/**
 * Colourful flat 2D "artifacts" — small multi-colour illustrations used instead
 * of monochrome icons for warmth (brand teal + sage + warm amber/coral).
 * Each is a self-contained rounded tile illustration.
 */

const C = {
  teal: "#0b7c98",
  tealDeep: "#055d75",
  sage: "#4f9cb2",
  sageSoft: "#bfdfea",
  mist: "#e6f2f7",
  amber: "#e0a23a",
  coral: "#e07a55",
  cream: "#fff",
};

function Tile({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 80 80" className="size-full" aria-hidden="true">
      <rect x="0" y="0" width="80" height="80" rx="20" fill={bg} />
      {children}
    </svg>
  );
}

/** Listening / warmth — speech bubble + heart. */
function Listen() {
  return (
    <Tile bg={C.mist}>
      <path d="M20 26h30a8 8 0 0 1 8 8v10a8 8 0 0 1-8 8H34l-9 8v-8h-5a8 8 0 0 1-8-8V34a8 8 0 0 1 8-8Z" fill={C.teal} />
      <path d="M40 36c-2.4-3-7-2.4-7 1.6 0 3 4 5.4 7 7.4 3-2 7-4.4 7-7.4 0-4-4.6-4.6-7-1.6Z" fill={C.coral} />
    </Tile>
  );
}

/** Evidence — flask with bubbles. */
function Evidence() {
  return (
    <Tile bg={C.sageSoft}>
      <path d="M34 20h12v12l10 20a6 6 0 0 1-5.4 8.6H29.4A6 6 0 0 1 24 52l10-20V20Z" fill={C.cream} stroke={C.tealDeep} strokeWidth="3" strokeLinejoin="round" />
      <path d="M30 44h20l4 8a4 4 0 0 1-3.6 5.6H29.6A4 4 0 0 1 26 52l4-8Z" fill={C.teal} />
      <circle cx="40" cy="50" r="3" fill={C.amber} />
      <circle cx="46" cy="54" r="2" fill={C.cream} />
    </Tile>
  );
}

/** Every stage — infinity / continuous journey. */
function Stages() {
  return (
    <Tile bg={C.mist}>
      <path d="M30 40c0-6 9-6 12 0 3 6 12 6 12 0s-9-6-12 0c-3 6-12 6-12 0Z" fill="none" stroke={C.teal} strokeWidth="6" strokeLinecap="round" />
      <circle cx="26" cy="40" r="4" fill={C.amber} />
      <circle cx="58" cy="40" r="4" fill={C.coral} />
    </Tile>
  );
}

/** Privacy — shield with check. */
function Privacy() {
  return (
    <Tile bg={C.sageSoft}>
      <path d="M40 18l18 7v13c0 12-8 20-18 24-10-4-18-12-18-24V25l18-7Z" fill={C.teal} />
      <path d="M32 40l6 6 12-12" fill="none" stroke={C.cream} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="58" cy="24" r="4" fill={C.amber} />
    </Tile>
  );
}

/** Cycle — colourful concentric rings (women's health). */
function Cycle() {
  return (
    <Tile bg={C.mist}>
      <circle cx="40" cy="40" r="20" fill="none" stroke={C.sage} strokeWidth="4" />
      <circle cx="40" cy="40" r="12" fill="none" stroke={C.amber} strokeWidth="4" />
      <circle cx="40" cy="20" r="4" fill={C.teal} />
      <circle cx="40" cy="40" r="4" fill={C.coral} />
    </Tile>
  );
}

/** Bloom — colourful lotus/flower. */
function Bloom() {
  return (
    <Tile bg={C.sageSoft}>
      <circle cx="40" cy="40" r="8" fill={C.amber} />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="40" cy="24" rx="6" ry="12" fill={C.teal} opacity="0.85" transform={`rotate(${a} 40 40)`} />
      ))}
      <circle cx="40" cy="40" r="5" fill={C.cream} />
    </Tile>
  );
}

const map: Record<string, React.FC> = {
  ear: Listen,
  microscope: Evidence,
  infinity: Stages,
  lock: Privacy,
  cycle: Cycle,
  bloom: Bloom,
};

export function Artifact({ name, className }: { name: string; className?: string }) {
  const A = map[name] ?? Bloom;
  return (
    <span className={cn("inline-block size-16", className)}>
      <A />
    </span>
  );
}
