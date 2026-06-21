"use client";

import {
  Baby,
  Drop,
  Pulse,
  Plant,
  HandHeart,
  Leaf,
  ShieldCheck,
  Ear,
  Microscope,
  Infinity as InfinityIcon,
  Lock,
  Stethoscope,
  type Icon,
  type IconWeight,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Premium Phosphor icon set (duotone) for feature/service tiles. */
const map: Record<string, Icon> = {
  baby: Baby,
  "calendar-heart": Drop,
  activity: Pulse,
  sprout: Plant,
  "heart-handshake": HandHeart,
  leaf: Leaf,
  "shield-check": ShieldCheck,
  ear: Ear,
  microscope: Microscope,
  infinity: InfinityIcon,
  lock: Lock,
};

export function ServiceIcon({
  name,
  className,
  weight = "duotone",
}: {
  name: string;
  className?: string;
  weight?: IconWeight;
}) {
  const Icon = map[name] ?? Stethoscope;
  return <Icon className={cn("size-6", className)} weight={weight} />;
}
