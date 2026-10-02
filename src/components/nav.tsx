import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { NAV, TRIAL_DAYS } from "@/content";
import { Button, Container } from "./ui";
import { Logo } from "./logo";

/**
 * Наалттай толгой цэс.
 *
 * Дээд талдаа ил тод, гүйлгэсний дараа цагаан дэвсгэртэй болдог: hero-гийн
 * градиент дээр хүрээ зурвал зурвас шиг харагддаг.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Цэс нээлттэй үед ард нь гүйлгэхийг хаана
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled
          ? "border-b border-line bg-white/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <Container>
        <div className="flex h-18 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-bg-soft hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button href="#signup">{TRIAL_DAYS} хоног үнэгүй</Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Цэс хаах" : "Цэс нээх"}
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-xl border border-line bg-white text-ink lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </Container>

      {/* ── утасны цэс ── */}
      {open && (
        <div className="border-t border-line bg-white lg:hidden">
          <Container className="py-4">
            <div className="flex flex-col">
              {NAV.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-2 py-3 text-base font-medium text-ink-soft transition hover:bg-bg-soft"
                >
                  {item.label}
                </a>
              ))}

              <div className="mt-3 grid gap-2 border-t border-line pt-4">
                <Button href="#signup" size="lg" className="w-full">
                  {TRIAL_DAYS} хоног үнэгүй эхлүүлэх
                </Button>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
