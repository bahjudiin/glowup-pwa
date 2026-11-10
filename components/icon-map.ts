import {
  Activity,
  AlertTriangle,
  Apple,
  Beef,
  BookMarked,
  BookOpen,
  Brush,
  Clock,
  Dna,
  Droplet,
  Dumbbell,
  Egg,
  FileText,
  Flame,
  FlaskConical,
  Heart,
  HeartPulse,
  ListOrdered,
  Microscope,
  Moon,
  Pill,
  RotateCcw,
  RotateCw,
  Route,
  Scissors,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Shirt,
  ShoppingCart,
  Sparkles,
  Target,
  Timer,
  Utensils,
  Wheat,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon-name -> component map.
 *
 * The data files store lucide icon NAMES as plain strings. This map is the
 * single place that turns those strings into components, so a bad name can
 * never crash a page (see `resolveIcon` in components/category-icon.tsx).
 *
 * Two names used by the data (`Capsule`, `Hair`) are NOT real lucide-react
 * exports — lucide has no "capsule" or "hair" icon at all. They are mapped
 * here to the closest real lucide components and are tracked in
 * `ICON_ALIASES` so `scripts/check-data.mjs` can report them explicitly.
 */
export const ICON_ALIASES: Record<string, LucideIcon> = {
  // lucide-react ships no "capsule" icon -> a pill is the same object.
  Capsule: Pill,
  // lucide-react ships no "hair" icon -> a brush is the closest metaphor.
  Hair: Brush,
};

/** Every icon name that appears in the data files, mapped to a component. */
export const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  AlertTriangle,
  Apple,
  Beef,
  BookMarked,
  BookOpen,
  Clock,
  Dna,
  Droplet,
  Dumbbell,
  Egg,
  FileText,
  Flame,
  FlaskConical,
  Heart,
  HeartPulse,
  ListOrdered,
  Microscope,
  Moon,
  Pill,
  RotateCcw,
  RotateCw,
  Route,
  Scissors,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Shirt,
  ShoppingCart,
  Sparkles,
  Target,
  Timer,
  Utensils,
  Wheat,
  Zap,
  ...ICON_ALIASES,
};

/** Sorted list of the names the data relies on — handy for tests and docs. */
export const ICON_NAMES = Object.keys(ICON_MAP).sort();
