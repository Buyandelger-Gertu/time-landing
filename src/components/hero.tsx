import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";

import { HERO, STATS } from "@/content";
import { Button, Container, Reveal } from "./ui";
import { MockDashboard } from "./mock-dashboard";
import { MockPhone } from "./mock-phone";

export function Hero() {
  // Онцлох үгийг гарчгаас тасалж, өнгөөр ялгана
  const [before, after] = HERO.title.split(HERO.highlight);

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      {/* Дэвсгэрийн гэрэлтүүлэг — агуулгын ард, дарж болохгүй */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_50%_-10%,var(--brand-soft),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-line to-transparent"
      />

      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-xs font-semibold text-ink-soft shadow-[var(--shadow-sm)]">
            <Sparkles size={13} className="text-brand" />
            {HERO.badge}
          </span>

          <h1 className="mt-6 text-4xl leading-[1.1] font-extrabold text-ink sm:text-5xl lg:text-6xl">
            {before}
            <span className="bg-gradient-to-r from-brand to-violet-500 bg-clip-text text-transparent">
              {HERO.highlight}
            </span>
            {after}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {HERO.subtitle}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="#signup" size="lg" className="w-full sm:w-auto">
              {HERO.primary}
              <ArrowRight size={16} />
            </Button>
            <Button
              href="#features"
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto"
            >
              <PlayCircle size={16} />
              {HERO.secondary}
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted">{HERO.note}</p>
        </Reveal>

        {/* ── бүтээгдэхүүний дүрслэл ── */}
        {/*
         * Веб + утас ЗЭРЭГЦЭЭ. Эхэндээ утсыг самбарын өнцөг дээр давхарлаж
         * үзсэн боловч «Хүсэлтүүд» хэсгийг халхалж байсан — бүтээгдэхүүний
         * дүрслэл дээр агуулга нуугдаж болохгүй.
         *
         * Утас нь зөвхөн өргөн дэлгэцэд. Жижиг дэлгэцэд самбар өөрөө
         * нарийсдаг тул хажууд нь утас багтахгүй, харин «Апп» хэсэгт
         * бүтнээрээ гарна.
         */}
        <Reveal
          delay={120}
          className="mt-16 grid gap-8 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-9">
            <MockDashboard />
          </div>
          <div className="hidden lg:col-span-3 lg:block">
            <MockPhone />
          </div>
        </Reveal>

        {/* ── тоон үзүүлэлт ── */}
        <Reveal delay={200}>
          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-10 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="text-3xl font-extrabold text-ink sm:text-4xl">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-xs text-muted sm:text-sm">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
