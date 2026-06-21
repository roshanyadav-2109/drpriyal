import { cn } from "@/lib/utils";

/**
 * Tasteful, single-weight line-art motifs used sparingly as texture.
 * Abstract wave/orbit/botanical forms — never literal clinical icons.
 */

/** Concentric ultrasound / sound-wave arcs. */
export function WaveArcs({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      aria-hidden="true"
      className={cn("text-gold", className)}
    >
      {[40, 80, 120, 160, 200].map((r, i) => (
        <path
          key={r}
          d={`M ${200 - r} 200 A ${r} ${r} 0 0 1 ${200 + r} 200`}
          stroke="currentColor"
          strokeWidth="1"
          opacity={0.55 - i * 0.08}
        />
      ))}
    </svg>
  );
}

/** Cycle / orbit rings with a few molecular dots — hormonal-health science cue. */
export function OrbitRings({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
      className={cn("text-sage", className)}
    >
      <circle cx="120" cy="120" r="110" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="120" cy="120" r="78" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <circle cx="120" cy="120" r="46" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="120" cy="10" r="4" fill="currentColor" />
      <circle cx="198" cy="120" r="3" fill="currentColor" opacity="0.7" />
      <circle cx="74" cy="120" r="2.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

/** Single continuous-line botanical / lotus form — Indian warmth, not kitsch. */
export function LotusLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      aria-hidden="true"
      className={cn("text-gold", className)}
    >
      <path
        d="M60 74 C60 50 44 38 30 34 C40 46 48 58 60 74 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M60 74 C60 50 76 38 90 34 C80 46 72 58 60 74 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M60 74 C60 44 60 24 60 8 C66 26 66 50 60 74 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M18 74 C44 60 76 60 102 74" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

/** Thin section divider with a centered diamond — gold hairline. */
export function HairlineDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 text-gold", className)} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/50" />
      <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0">
        <rect x="5" y="0" width="6" height="6" transform="rotate(45 5 0)" fill="currentColor" opacity="0.6" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/50" />
    </div>
  );
}

/** Faint full-width wave band used behind hero / stat sections. */
export function WaveBand({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("text-sage/30", className)}
    >
      <path
        d="M0 80 C 240 20 480 20 720 60 C 960 100 1200 100 1440 50"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M0 100 C 240 50 480 50 720 85 C 960 120 1200 120 1440 80"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
