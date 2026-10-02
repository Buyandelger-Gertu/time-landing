import { Clock } from "lucide-react";

import { BRAND } from "@/content";

/** Лого — тэмдэг + нэр. `light` нь бараан дэвсгэр дээр */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <a href="#top" className="inline-flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-brand text-white shadow-[var(--shadow-sm)]">
        <Clock size={19} strokeWidth={2.4} />
      </span>
      <span
        className={`text-lg font-extrabold tracking-tight ${
          tone === "light" ? "text-white" : "text-ink"
        }`}
      >
        {BRAND.name}
      </span>
    </a>
  );
}
