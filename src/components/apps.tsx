import { Apple, Check, Play } from "lucide-react";

import { ADMIN, MOBILE } from "@/content";
import { Button, Reveal, Section, SectionHead } from "./ui";
import { MockPhone } from "./mock-phone";
import { MockDashboard } from "./mock-dashboard";

export function Apps() {
  return (
    <Section id="apps" className="bg-bg-soft">
      <Reveal>
        <SectionHead
          eyebrow="Хоёр тал"
          title="Ажилтанд апп, удирдлагад веб"
          subtitle=""
        />
      </Reveal>

      {/* ── ажилтны апп ── */}
      <Reveal delay={80}>
        <div className="mt-12 grid items-center gap-10 rounded-3xl border border-line bg-white p-6 shadow-[var(--shadow-md)] sm:p-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl font-extrabold text-ink sm:text-3xl">
              {MOBILE.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{MOBILE.subtitle}</p>

            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {MOBILE.features.map((feature) => (
                <div key={feature.text} className="flex items-center gap-2.5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                    <feature.icon size={14} />
                  </span>
                  <span className="text-sm text-ink-soft">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {/* ⚠️ Дэлгүүрийн жинхэнэ холбоосоороо солино */}
              <Button href="#signup" variant="ghost">
                <Apple size={16} />
                App Store
              </Button>
              <Button href="#signup" variant="ghost">
                <Play size={16} />
                Google Play
              </Button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="rounded-3xl bg-gradient-to-br from-brand-soft to-white p-8">
              <MockPhone />
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── удирдлагын веб ── */}
      <Reveal delay={120}>
        <div className="mt-6 grid items-center gap-10 rounded-3xl border border-line bg-white p-6 shadow-[var(--shadow-md)] sm:p-10 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-3xl bg-gradient-to-br from-bg-soft to-white p-5 sm:p-7">
            <MockDashboard />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-ink sm:text-3xl">
              {ADMIN.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{ADMIN.subtitle}</p>

            <ul className="mt-6 space-y-3">
              {ADMIN.features.map((feature) => (
                <li key={feature.text} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="text-sm text-ink-soft">{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
