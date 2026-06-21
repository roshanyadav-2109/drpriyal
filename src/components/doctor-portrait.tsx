import { ShieldCheck } from "lucide-react";
import { SmartImage } from "@/components/smart-image";
import { img, DOCTOR_PHOTO_LOCAL } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * Editorial portrait. Uses a professional photo by default — replace `img.doctorPortrait`
 * (src/lib/images.ts) with Dr. Priyal Agarwal's real photo before launch.
 */
export function DoctorPortrait({
  className,
  priority,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      {/* thin framing accent behind the image */}
      <div className="absolute -right-3 -top-3 hidden h-full w-full rounded-md border border-gold/40 sm:block" />

      <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-sand bg-bone shadow-[var(--shadow-card)]">
        <SmartImage
          primarySrc={DOCTOR_PHOTO_LOCAL}
          fallbackSrc={img.doctorPortrait}
          alt="Dr. Priyal Agarwal — Obstetrician & Gynaecologist"
          priority={priority}
          className="object-cover"
          sizes="(max-width: 1024px) 90vw, 40vw"
        />
        {/* subtle bottom gradient for the caption strip */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/55 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="text-ivory">
            <p className="font-serif text-lg leading-tight">Dr. Priyal Agarwal</p>
            <p className="text-xs text-ivory/80">Obstetrician &amp; Gynaecologist</p>
          </div>
        </div>
      </div>

      {/* floating credential chip */}
      <div className="absolute -bottom-4 -right-3 flex items-center gap-2 rounded-md border border-sand bg-paper px-3.5 py-2.5 shadow-[var(--shadow-card)]">
        <ShieldCheck className="size-4 text-pine" />
        <div className="leading-tight">
          <p className="font-serif text-sm text-ink">MBBS · OB-GYN</p>
          <p className="text-[0.65rem] text-ink-faint">Founder, WomanHood</p>
        </div>
      </div>
    </div>
  );
}
