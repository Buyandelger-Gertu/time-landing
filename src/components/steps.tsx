import { ArrowRight } from "lucide-react";

import { STEPS, TRIAL_DAYS } from "@/content";
import { Button, Container, Reveal } from "./ui";

/** Бараан зурвас — цагаан хэсгүүдийн дундуур амьсгал авах зай болно */
export function Steps() {
  return (
    <section className="bg-bg-deep py-20 text-white sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            Эхлэх нь
          </span>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Гурван алхам, нэг өдөр
          </h2>
          <p className="mt-4 text-white/60">
            Дэд бүтэц суулгах, сервер тохируулах шаардлагагүй. Бүртгүүлсэн
            даруйдаа ажиллаж эхэлнэ.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 100} className="h-full">
              <div className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="text-5xl font-extrabold text-white/15 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-12 text-center">
          <Button href="#signup" variant="light" size="lg">
            {TRIAL_DAYS} хоног үнэгүй эхлүүлэх
            <ArrowRight size={16} />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
