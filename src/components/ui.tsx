import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/** Бүх хэсэгт нийтлэг хэвтээ хязгаар — утсан дээр 20px зайтай */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/** Гарчгийн дээрх жижиг шошго */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold tracking-wide text-brand-strong uppercase">
      {children}
    </span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "left";
}) {
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={`text-3xl font-extrabold text-ink sm:text-4xl ${eyebrow ? "mt-4" : ""}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

const BUTTON_STYLE = {
  primary:
    "bg-brand text-white shadow-[var(--shadow-md)] hover:bg-brand-strong active:translate-y-px",
  ghost:
    "border border-line bg-white text-ink hover:border-brand hover:text-brand",
  light: "bg-white text-brand-strong hover:bg-brand-soft",
  outline:
    "border border-white/25 text-white hover:border-white/60 hover:bg-white/10",
} as const;

const BUTTON_SIZE = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-[15px]",
} as const;

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: keyof typeof BUTTON_STYLE;
  size?: keyof typeof BUTTON_SIZE;
  className?: string;
};

/**
 * Товч.
 *
 * `href` өгвөл `<a>`, өгөхгүй бол `<button>` болно — харагдац нь ижил.
 * Лэндинг дээрх ихэнх «товч» нь үнэндээ хуудсан доторх холбоос байдаг тул
 * зөв элемент сонгох нь дэлгэц уншигчид чухал.
 */
export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
}: ButtonProps) {
  const style = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition ${BUTTON_STYLE[variant]} ${BUTTON_SIZE[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={style}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={style}>
      {children}
    </button>
  );
}

/**
 * Гүйлгэхэд зөөлөн гарч ирэх боодол.
 *
 * ⚠️ Нэг л удаа ажиллана — `unobserve` хийснээр дээш доош гүйлгэх бүрд
 * агуулга анивчихаас сэргийлнэ.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  /** мс — жагсаалтын элементүүдийг дараалуулж гаргахад */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.unobserve(node);
      },
      // Доод талаас 10% нь харагдмагц эхэлнэ — эрт гарч ирвэл хөдөлгөөн нь
      // хэрэглэгчийн нүднээс гадна дуусна
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={shown ? "shown" : "hidden"}
      style={{ transitionDelay: `${delay}ms` }}
      className={className}
    >
      {children}
    </div>
  );
}
