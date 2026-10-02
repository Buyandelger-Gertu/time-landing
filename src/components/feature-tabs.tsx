import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { TABS } from "@/content";
import { Reveal, Section, SectionHead } from "./ui";

/**
 * Гол чадваруудыг таб болгон харуулна.
 *
 * Дөрвөн ажлын урсгалыг зэрэг дэлгэвэл хуудас хэт урсдаг тул нэг нэгээр
 * нь. Утсан дээр табууд хэвтээгээр гүйнэ.
 */
export function FeatureTabs() {
  const [activeId, setActiveId] = useState<string>(TABS[0].id);
  const active = TABS.find((tab) => tab.id === activeId) ?? TABS[0];

  return (
    <Section id="features" className="bg-bg-soft">
      <Reveal>
        <SectionHead
          eyebrow="Боломжууд"
          title="Дөрвөн ажлын урсгал, нэг систем"
          subtitle="Ирц бүртгэхээс эхлээд цалин бодох бүх үйл явц багтсан."
        />
      </Reveal>

      {/* ── таб сонголт ── */}
      <Reveal delay={80}>
        <div className="mt-10 -mx-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
          <div
            role="tablist"
            aria-label="Боломжууд"
            className="mx-auto flex w-max gap-2 rounded-full border border-line bg-white p-1.5 shadow-[var(--shadow-sm)]"
          >
            {TABS.map((tab) => {
              const selected = tab.id === active.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveId(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
                    selected
                      ? "bg-brand text-white shadow-[var(--shadow-sm)]"
                      : "text-ink-soft hover:bg-bg-soft"
                  }`}
                >
                  <tab.icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* ── идэвхтэй табын агуулга ── */}
      <div
        // `key` солигдоход React DOM-ыг шинээр үүсгэдэг тул гарч ирэх
        // хөдөлгөөн таб солих бүрд дахин ажиллана
        key={active.id}
        className="mt-10 grid items-center gap-8 rounded-3xl border border-line bg-white p-6 shadow-[var(--shadow-md)] sm:p-10 lg:grid-cols-2 lg:gap-14"
      >
        <div>
          <span className="inline-grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand">
            <active.icon size={21} />
          </span>
          <h3 className="mt-5 text-2xl font-extrabold text-ink sm:text-3xl">
            {active.title}
          </h3>
          <p className="mt-3 leading-relaxed text-muted">{active.body}</p>

          <a
            href="#signup"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:gap-2.5 hover:underline"
          >
            Энэ боломжийг туршиж үзэх
            <ArrowRight size={15} />
          </a>
        </div>

        {/*
         * Чадваруудыг зөвхөн ЭНД тоочино.
         *
         * Эхэндээ зүүн талд ижил жагсаалт байсан — нэг дэлгэцэд нэг ижил
         * дөрвөн өгүүлбэр хоёр удаа харагдаж байлаа.
         */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-soft via-white to-bg-soft p-6 ring-1 ring-line sm:p-8">
          <p className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wide text-brand-strong uppercase">
            <Check size={13} strokeWidth={3} />
            Багтсан зүйлс
          </p>
          <div className="space-y-3">
            {active.points.map((point, index) => (
              <div
                key={point}
                data-reveal="shown"
                style={{ transitionDelay: `${index * 60}ms` }}
                className="flex items-center gap-3 rounded-xl border border-line bg-white/90 px-4 py-3 shadow-[var(--shadow-sm)] backdrop-blur-sm"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand text-white">
                  <active.icon size={14} />
                </span>
                <span className="text-xs font-medium text-ink">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
