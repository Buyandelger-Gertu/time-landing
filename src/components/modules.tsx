import { MODULES } from "@/content";
import { Reveal, Section, SectionHead } from "./ui";

/** Системд байгаа бүх модулийг тоочих сүлжээ */
export function Modules() {
  return (
    <Section id="modules">
      <Reveal>
        <SectionHead
          eyebrow="Модулиуд"
          title="Нэмэлт төлбөргүй, бүгд нэг багцад"
          subtitle="Тус тусад нь худалдаж авах шаардлагагүй."
        />
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MODULES.map((module, index) => (
          <Reveal
            key={module.title}
            // Хэт их саатал өгвөл доод мөрүүд нь хоцорч харагдана —
            // 6 элемент тутамд эргэлдүүлж дээд хязгаарыг барина
            delay={(index % 6) * 50}
            className="h-full"
          >
            <div className="group h-full rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[var(--shadow-md)]">
              <span className="grid size-10 place-items-center rounded-xl bg-bg-soft text-brand transition group-hover:bg-brand group-hover:text-white">
                <module.icon size={18} />
              </span>
              <h3 className="mt-4 text-sm font-bold text-ink">
                {module.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                {module.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
