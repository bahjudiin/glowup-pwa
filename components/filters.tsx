"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COST_TIERS, EVIDENCE_GRADES } from "@/lib/data/queries";

const ANY = "any";

const EVIDENCE_OPTIONS = [
  { id: ANY, label: "All evidence" },
  ...EVIDENCE_GRADES.map((grade) => ({ id: grade, label: grade })),
];

const COST_OPTIONS = [
  { id: ANY, label: "All cost" },
  ...COST_TIERS.map((tier) => ({ id: tier, label: tier })),
];

export function Filters() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentEvidence = searchParams.get("evidence") || "";
  const currentCost = searchParams.get("cost") || "";
  const currentVerified = searchParams.get("verified") === "true";

  const [evidence, setEvidence] = useState(currentEvidence || ANY);
  const [cost, setCost] = useState(currentCost || ANY);
  const [verified, setVerified] = useState(currentVerified);

  useEffect(() => {
    setEvidence(currentEvidence || ANY);
    setCost(currentCost || ANY);
    setVerified(currentVerified);
  }, [currentEvidence, currentCost, currentVerified]);

  const push = (params: URLSearchParams) => {
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const apply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (evidence && evidence !== ANY) params.set("evidence", evidence);
    else params.delete("evidence");
    if (cost && cost !== ANY) params.set("cost", cost);
    else params.delete("cost");
    if (verified) params.set("verified", "true");
    else params.delete("verified");
    push(params);
    setOpen(false);
  };

  const reset = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("evidence");
    params.delete("cost");
    params.delete("verified");
    push(params);
    setEvidence(ANY);
    setCost(ANY);
    setVerified(false);
    setOpen(false);
  };

  const hasActive = Boolean(currentEvidence || currentCost || currentVerified);

  return (
    <div className="relative w-full max-w-md">
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {hasActive && (
            <span className="ml-auto h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
              +
            </span>
          )}
        </div>
        <SlidersHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="relative w-full max-w-md mx-4 rounded-2xl border border-input bg-card p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Filters</h3>
              <button
                onClick={reset}
                className="text-xs text-muted-foreground hover:text-primary underline decoration-1"
              >
                Reset
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Evidence grade
                </label>
                <Select value={evidence} onValueChange={setEvidence}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVIDENCE_OPTIONS.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Cost tier
                </label>
                <Select value={cost} onValueChange={setCost}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any cost" />
                  </SelectTrigger>
                  <SelectContent>
                    {COST_OPTIONS.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-input bg-background/50">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={verified}
                    onCheckedChange={setVerified}
                    aria-label="Verified prices only"
                  />
                  <span className="text-sm">Verified prices only</span>
                </div>
                <span className="text-xs text-muted-foreground text-right">
                  iHerb prices checked 1 Nov 2026
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={apply}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
              >
                Apply
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2 rounded-lg border border-input bg-background text-sm font-medium hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
