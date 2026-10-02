import { Check } from "lucide-react";

import { PRICING, TRIAL_DAYS } from "@/content";
import { Button, Reveal, Section, SectionHead } from "./ui";

export function Pricing() {
  return (
    <Section id="pricing">
      <Reveal>
        <SectionHead
          eyebrow="Үнэ"
          title="Ажилтны тоогоор, ойлгомжтой"
          subtitle={`Нуугдмал төлбөргүй. Эхлээд ${TRIAL_DAYS} хоног үнэгүй туршаад, тохирвол үргэлжлүүлнэ.`}
        />
      </Reveal>

      <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
        {PRICING.map((plan, index) => (
          <Reveal key={plan.id} delay={index * 90} className="h-full">
            <div
              className={`relative flex h-full flex-col rounded-3xl p-7 ${
                plan.featured
                  ? "border-2 border-brand bg-white shadow-[var(--shadow-lg)] lg:-mt-4 lg:pb-10"
                  : "border border-line bg-white"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white">
                  Санал болгож буй
                </span>
              )}

              <h3 className="text-lg font-bold text-ink">{plan.name}</h3>
              <p className="mt-1 text-xs text-muted">{plan.note}</p>

              <div className="mt-5 flex items-baseline gap-1.5">
                {plan.price ? (
                  <>
                    <span className="text-4xl font-extrabold text-ink">
                      {plan.price}
                    </span>
                    <span className="text-xs text-muted">{plan.unit}</span>
                  </>
                ) : (
                  <span className="text-2xl font-extrabold text-ink">
                    Тохиролцоно
                  </span>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <span className="text-sm text-ink-soft">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                href="#signup"
                variant={plan.featured ? "primary" : "ghost"}
                size="lg"
                className="mt-7 w-full"
              >
                {plan.cta}
              </Button>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <p className="mt-8 text-center text-xs text-muted">
          Үнэд НӨАТ ороогүй. Жилээр төлөхөд 2 сарын хөнгөлөлт эдэлнэ.
        </p>
      </Reveal>
    </Section>
  );
}
