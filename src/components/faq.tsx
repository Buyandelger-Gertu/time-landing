import { useState } from "react";
import { Plus } from "lucide-react";

import { BRAND, FAQ } from "@/content";
import { Reveal, Section, SectionHead } from "./ui";

export function Faq() {
  // Эхнийх нь нээлттэй — хоосон жагсаалт харагдвал дарах эсэх нь
  // тодорхойгүй болдог
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" className="bg-bg-soft">
      <Reveal>
        <SectionHead eyebrow="Түгээмэл асуулт" title="Юу гэж асуудаг вэ?" />
      </Reveal>

      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {FAQ.map((item, index) => {
          const open = openIndex === index;

          return (
            <Reveal key={item.q} delay={index * 50}>
              <div
                className={`overflow-hidden rounded-2xl border bg-white transition ${
                  open
                    ? "border-brand/40 shadow-[var(--shadow-md)]"
                    : "border-line"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6"
                >
                  <span className="flex-1 text-sm font-bold text-ink sm:text-base">
                    {item.q}
                  </span>
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full transition ${
                      open
                        ? "rotate-45 bg-brand text-white"
                        : "bg-bg-soft text-muted"
                    }`}
                  >
                    <Plus size={15} />
                  </span>
                </button>

                {/*
                 * Хаалттай үед DOM-оос БҮРЭН хасахгүй, өндрөөр нь нуусан:
                 * хайлтын систем болон дэлгэц уншигчид хариултыг олж чадна.
                 */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={200}>
        <p className="mt-10 text-center text-sm text-muted">
          Өөр асуух зүйл байна уу?{" "}
          <a
            href={`mailto:${BRAND.email}`}
            className="font-semibold text-brand hover:underline"
          >
            {BRAND.email}
          </a>{" "}
          хаягаар бичээрэй.
        </p>
      </Reveal>
    </Section>
  );
}
