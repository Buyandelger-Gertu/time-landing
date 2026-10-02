import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Hash,
  Headset,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { BRAND, COMPANY_SIZES, TRIAL_DAYS } from "@/content";
import {
  isValidEmail,
  isValidPhone,
  isValidRegister,
  LEAD_ENDPOINT,
  submitLead,
  type Lead,
} from "@/lib/lead";
import { Container, Reveal } from "./ui";

const EMPTY: Lead = {
  company: "",
  register: "",
  name: "",
  phone: "",
  email: "",
  size: COMPANY_SIZES[1],
};

const PERKS = [
  {
    icon: Sparkles,
    title: `${TRIAL_DAYS} хоног бүх боломж нээлттэй`,
    text: "Ирц, чөлөө, цалин — бүх модулийг хязгааргүй турш.",
  },
  {
    icon: CreditCard,
    title: "Картын мэдээлэл шаардахгүй",
    text: "Туршилт дуусахад автоматаар төлбөр татахгүй.",
  },
  {
    icon: Headset,
    title: "Тохируулахад үнэгүй тусална",
    text: "Манай баг ажилтнуудаа оруулахад тань хамт ажиллана.",
  },
];

/** Заавал бөглөх талбарууд — явцын мөрөнд тоологдоно */
const REQUIRED = ["company", "register", "name", "phone", "email"] as const;

function checkField(key: (typeof REQUIRED)[number], form: Lead) {
  switch (key) {
    case "register":
      return isValidRegister(form.register);
    case "phone":
      return isValidPhone(form.phone);
    case "email":
      return isValidEmail(form.email);
    default:
      return form[key].trim().length > 0;
  }
}

export function SignUp() {
  const [form, setForm] = useState<Lead>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Lead, string>>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState("");
  // Илгээх товч дарах бүрд нэмэгдэнэ — алдаатай талбарыг дахин сэгсрэхэд
  const [attempt, setAttempt] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const valid = Object.fromEntries(
    REQUIRED.map((key) => [key, checkField(key, form)]),
  ) as Record<(typeof REQUIRED)[number], boolean>;
  const filled = REQUIRED.filter((key) => valid[key]).length;

  // Алдаатай эхний талбар руу курсор шилжүүлнэ — урт маягт дээр хэрэглэгч
  // алдаагаа хайж гүйлгэхгүй
  useEffect(() => {
    if (attempt === 0) return;
    formRef.current
      ?.querySelector<HTMLInputElement>('[aria-invalid="true"]')
      ?.focus();
  }, [attempt]);

  const set = (key: keyof Lead, value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    // Хэрэглэгч засаж эхэлмэгц алдааг арилгана — бичиж байхад улаан
    // бичвэр ширтэх нь таагүй
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const next: Partial<Record<keyof Lead, string>> = {};
    if (!valid.company) next.company = "Байгууллагын нэрээ бичнэ үү";
    if (!valid.register)
      next.register = "7 оронтой регистрийн дугаар оруулна уу";
    if (!valid.name) next.name = "Нэрээ бичнэ үү";
    if (!valid.phone) next.phone = "8 оронтой дугаар оруулна уу";
    if (!valid.email) next.email = "Имэйл хаяг буруу байна";

    setErrors(next);
    setAttempt((count) => count + 1);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    setFailed("");
    try {
      await submitLead(form);
      setDone(true);
    } catch (error) {
      setFailed(
        error instanceof Error
          ? error.message
          : "Илгээхэд алдаа гарлаа. Дахин оролдоно уу.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="signup"
      className="relative isolate overflow-hidden bg-bg-deep py-20 text-white sm:py-28"
    >
      {/* ── арын гэрэл ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute -top-40 -left-32 size-[34rem] rounded-full bg-brand/40 blur-[120px]" />
        <div className="animate-drift-slow absolute -right-40 -bottom-48 size-[30rem] rounded-full bg-emerald-400/15 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255_/_0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255_/_0.04)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] bg-[size:48px_48px]" />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ── зүүн тал: амлалт ── */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide uppercase backdrop-blur">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                Үнэгүй туршилт
              </span>
              <h2 className="mt-5 text-3xl font-extrabold sm:text-5xl sm:leading-[1.1]">
                Маргааш{" "}
                <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-emerald-300 bg-clip-text text-transparent">
                  өглөөнөөс
                </span>{" "}
                эхлээрэй
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-white/60">
                Маягтаа бөглөөд илгээнэ үү. Ажлын нэг өдрийн дотор холбогдож,
                байгууллагынхаа тохиргоог хамтдаа хийнэ.
              </p>
            </Reveal>

            <div className="mt-8 space-y-3">
              {PERKS.map(({ icon: Icon, title, text }, index) => (
                <Reveal key={title} delay={120 + index * 90}>
                  <div className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.06]">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand/80 to-brand-strong/60 text-white shadow-lg shadow-brand/20 transition duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-white">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-white/50">
                        {text}
                      </span>
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={420}>
              <a
                href={`tel:${BRAND.phone}`}
                className="group mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-2 pr-5 pl-2 text-sm transition hover:border-white/25 hover:bg-white/10"
              >
                <span className="grid size-8 place-items-center rounded-full bg-white text-brand-strong transition group-hover:rotate-12">
                  <Phone size={15} />
                </span>
                <span className="text-white/60">
                  Утсаар ярих нь дээр үү?{" "}
                  <span className="font-semibold text-white">
                    {BRAND.phone}
                  </span>
                </span>
              </a>
            </Reveal>
          </div>

          {/* ── баруун тал: маягт ── */}
          <Reveal delay={150}>
            <div className="glow-border rounded-[1.75rem] p-px shadow-[0_40px_80px_-30px_rgb(91_91_214_/_0.55)]">
              <div className="rounded-[calc(1.75rem-1px)] bg-white p-6 text-ink sm:p-8">
                {done ? (
                  <Success
                    phone={form.phone}
                    onReset={() => {
                      setForm(EMPTY);
                      setErrors({});
                      setAttempt(0);
                      setDone(false);
                    }}
                  />
                ) : (
                  <form ref={formRef} onSubmit={submit} noValidate>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-extrabold">
                          {TRIAL_DAYS} хоног үнэгүй эхлүүлэх
                        </h3>
                        <p className="mt-1 text-sm text-muted">
                          1 минут л болно.
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-strong tabular-nums">
                        {filled}/{REQUIRED.length}
                      </span>
                    </div>

                    {/* Бөглөсөн явц */}
                    <div className="mt-4 h-1 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand to-emerald-400 transition-[width] duration-500 ease-out"
                        style={{
                          width: `${(filled / REQUIRED.length) * 100}%`,
                        }}
                      />
                    </div>

                    {/*
                     * Зөвхөн ХӨГЖҮҮЛЭЛТИЙН үед харагдана. Жинхэнэ хаяг
                     * тохируулаагүй бол маягт «амжилттай» гэж хэлэх атлаа
                     * хүсэлт хаашаа ч очихгүйг эзэнд нь сануулна.
                     */}
                    {import.meta.env.DEV && !LEAD_ENDPOINT && (
                      <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-amber-800">
                        <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                        <p className="text-[11px] leading-relaxed">
                          <b>Зөвхөн хөгжүүлэлтэд харагдана:</b>{" "}
                          <code>src/lib/lead.ts</code> дахь{" "}
                          <code>LEAD_ENDPOINT</code> хоосон тул хүсэлт хаашаа ч
                          илгээгдэхгүй.
                        </p>
                      </div>
                    )}

                    <div className="mt-5 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
                        <Field
                          label="Байгууллагын нэр"
                          icon={<Building2 size={16} />}
                          autoComplete="organization"
                          value={form.company}
                          valid={valid.company}
                          error={errors.company}
                          shake={attempt}
                          placeholder="Жишээ: Монгол ХХК"
                          onChange={(value) => set("company", value)}
                        />
                        <Field
                          label="Регистр"
                          icon={<Hash size={16} />}
                          inputMode="numeric"
                          maxLength={7}
                          value={form.register}
                          valid={valid.register}
                          error={errors.register}
                          shake={attempt}
                          placeholder="1234567"
                          onChange={(value) =>
                            set("register", value.replace(/\D/g, ""))
                          }
                        />
                      </div>

                      <Field
                        label="Холбоо барих хүн"
                        icon={<UserRound size={16} />}
                        autoComplete="name"
                        value={form.name}
                        valid={valid.name}
                        error={errors.name}
                        shake={attempt}
                        placeholder="Овог нэр"
                        onChange={(value) => set("name", value)}
                      />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                          label="Утас"
                          icon={<Phone size={16} />}
                          type="tel"
                          autoComplete="tel"
                          value={form.phone}
                          valid={valid.phone}
                          error={errors.phone}
                          shake={attempt}
                          placeholder="99112233"
                          onChange={(value) => set("phone", value)}
                        />
                        <Field
                          label="Имэйл"
                          icon={<Mail size={16} />}
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          valid={valid.email}
                          error={errors.email}
                          shake={attempt}
                          placeholder="name@company.mn"
                          onChange={(value) => set("email", value)}
                        />
                      </div>

                      <fieldset>
                        <legend className="text-sm font-semibold">
                          Ажилтны тоо
                        </legend>
                        <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {COMPANY_SIZES.map((size) => {
                            const active = form.size === size;
                            return (
                              <button
                                key={size}
                                type="button"
                                aria-pressed={active}
                                onClick={() => set("size", size)}
                                className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition duration-200 active:scale-95 ${
                                  active
                                    ? "border-brand bg-brand-soft text-brand-strong shadow-[0_0_0_3px_rgb(91_91_214_/_0.12)]"
                                    : "border-line text-ink-soft hover:border-brand/40 hover:bg-bg-soft"
                                }`}
                              >
                                {size.replace(" ажилтан", "")}
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>
                    </div>

                    {failed && (
                      <p className="animate-fade-up mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {failed}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="shimmer group relative mt-6 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand to-brand-strong px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_30px_-10px_rgb(91_91_214_/_0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgb(91_91_214_/_0.8)] active:translate-y-0 disabled:translate-y-0 disabled:opacity-60"
                    >
                      {sending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Илгээж байна...
                        </>
                      ) : (
                        <>
                          Үнэгүй эхлүүлэх
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>

                    <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted">
                      <ShieldCheck size={13} className="text-emerald-500" />
                      Мэдээлэл тань нууцлагдана · Илгээснээр үйлчилгээний
                      нөхцөлийг зөвшөөрч байна.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Success({ phone, onReset }: { phone: string; onReset: () => void }) {
  return (
    <div className="py-10 text-center">
      <span className="relative mx-auto grid size-16 place-items-center">
        <span className="animate-ring absolute inset-0 rounded-full bg-emerald-200" />
        <span className="animate-pop relative grid size-16 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
          <CheckCircle2 size={28} />
        </span>
      </span>
      <h3
        className="animate-fade-up mt-6 text-xl font-extrabold"
        style={{ animationDelay: "150ms" }}
      >
        Хүсэлт хүлээн авлаа
      </h3>
      <p
        className="animate-fade-up mt-2 text-sm text-muted"
        style={{ animationDelay: "250ms" }}
      >
        Ажлын нэг өдрийн дотор{" "}
        <span className="font-semibold text-ink">{phone}</span> дугаараар
        холбогдоно.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="animate-fade-up mt-6 text-sm font-semibold text-brand hover:underline"
        style={{ animationDelay: "350ms" }}
      >
        Дахин илгээх
      </button>
    </div>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  error,
  valid,
  shake,
  placeholder,
  type = "text",
  inputMode,
  maxLength,
  autoComplete,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  valid?: boolean;
  /** Өөрчлөгдөх бүрд алдаатай бол талбар сэгсрэгдэнэ */
  shake?: number;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  autoComplete?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!error || !boxRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    boxRef.current.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(-3px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 360, easing: "ease-out" },
    );
  }, [error, shake]);

  return (
    <label className="block">
      <span className="block text-sm font-semibold">{label}</span>
      <div ref={boxRef} className="group relative mt-1.5">
        <span
          className={`pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 transition-colors duration-200 ${
            error
              ? "text-red-400"
              : "text-muted/60 group-focus-within:text-brand"
          }`}
        >
          {icon}
        </span>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          inputMode={inputMode}
          maxLength={maxLength}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-xl border bg-bg-soft py-2.5 pr-9 pl-10 text-sm outline-none transition duration-200 placeholder:text-muted/50 hover:border-brand/30 focus:bg-white focus:shadow-[0_0_0_4px_rgb(91_91_214_/_0.12)] ${
            error
              ? "border-red-400 bg-red-50/40 focus:border-red-400 focus:shadow-[0_0_0_4px_rgb(248_113_113_/_0.15)]"
              : "border-line focus:border-brand"
          }`}
        />
        {valid && !error && (
          <span className="animate-pop pointer-events-none absolute top-1/2 right-3 grid size-5 -translate-y-1/2 place-items-center rounded-full bg-emerald-500 text-white">
            <Check size={12} strokeWidth={3} />
          </span>
        )}
      </div>
      {error && (
        <span className="animate-fade-up mt-1 block text-[11px] text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}
