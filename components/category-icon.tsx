import { Circle, type LucideIcon } from "lucide-react";
import { ICON_MAP } from "@/components/icon-map";
import { cn } from "@/lib/utils";

/**
 * Resolve an icon NAME (as stored in the data files) to a lucide component.
 * Unknown names fall back to a neutral circle so a bad data value can never
 * take a page down.
 */
export function resolveIcon(name: string | undefined | null): LucideIcon {
  if (!name) return Circle;
  return ICON_MAP[name] ?? Circle;
}

export function CategoryIcon({
  name,
  className,
}: {
  name: string | undefined | null;
  className?: string;
}) {
  const Icon = resolveIcon(name);
  return <Icon className={cn("h-4 w-4", className)} aria-hidden="true" />;
}
