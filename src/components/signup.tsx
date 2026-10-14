import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
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
  checkLead,
  checkRegister,
  isValidEmail,
  isValidPhone,
  isValidRegister,
  LEAD_ENDPOINT,
  LeadError,
  requestLeadOtp,
  submitLead,
  type Lead,
  type LeadFieldErrors,
  type OtpChannel,
  type TrialAccount,
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

const PRIMARY_BUTTON =
  "shimmer group relative mt-6 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand to-brand-strong px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_30px_-10px_rgb(91_91_214_/_0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgb(91_91_214_/_0.8)] active:translate-y-0 disabled:translate-y-0 disabled:opacity-60";

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
const REQUIRED = ["register", "company", "name", "phone", "email"] as const;

/**
 * Регистрийн шалгалтын төлөв.
 * `unknown` — шалгаж чадсангүй (сервер унасан г.м). Маягтыг хаахгүй,
 * backend илгээх үед дахин шалгана.
 */
type RegisterCheck =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "found"; name: string }
  | { status: "notfound" }
  | { status: "unknown" };

function checkField(
  key: (typeof REQUIRED)[number],
  form: Lead,
  registerCheck: RegisterCheck,
) {
  switch (key) {
    case "register":
      return (
        isValidRegister(form.register) &&
        (registerCheck.status === "found" || registerCheck.status === "unknown")
      );
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
  // Маягт → утас / имэйлээр баталгаажуулах → амжилттай
  const [step, setStep] = useState<"form" | "verify" | "done">("form");
  const [account, setAccount] = useState<TrialAccount | null>(null);
  // «Үргэлжлүүлэх» дээр бүртгэлтэй эсэхийг шалгаж байна
  const [checking, setChecking] = useState(false);
  // Бүртгэлтэй гарвал маягтын доор нэвтрэх холбоос
  const [existingLogin, setExistingLogin] = useState("");
  // Илгээх товч дарах бүрд нэмэгдэнэ — алдаатай талбарыг дахин сэгсрэхэд
  const [attempt, setAttempt] = useState(0);
  // Сүүлд шалгасан регистр ба хариу. Одоогийн регистртэй таарахгүй бол
  // шалгалт явж байна гэсэн үг.
  const [lookup, setLookup] = useState<{
    regno: string;
    check: RegisterCheck;
  } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const registerCheck: RegisterCheck = !isValidRegister(form.register)
    ? { status: "idle" }
    : lookup?.regno === form.register
      ? lookup.check
      : { status: "checking" };

  /*
   * Байгууллагын нэрийг ebarimt-ээс олдсон нэрээр ТҮГЖИНЭ — хэрэглэгч
   * өөрчилж чадахгүй. Зөвхөн шалгаж чадаагүй (`unknown`) үед гараар
   * бичүүлнэ. Нэрийг state-д хуулахгүй, шалгалтын хариунаас шууд авна:
   * регистр солигдмогц нэр нь дагаад солигдоно.
   */
  const lockedCompany =
    registerCheck.status === "found" && registerCheck.name
      ? registerCheck.name
      : null;
  const companyEditable = registerCheck.status === "unknown" && !lockedCompany;
  const lead: Lead = {
    ...form,
    company: lockedCompany ?? (companyEditable ? form.company : ""),
  };

  const valid = Object.fromEntries(
    REQUIRED.map((key) => [key, checkField(key, lead, registerCheck)]),
  ) as Record<(typeof REQUIRED)[number], boolean>;

  /*
   * Регистр 7 орон болмогц Монголд бүртгэлтэй байгууллага мөн эсэхийг
   * шалгаж, нэрийг нь бөглөнө. Бичих бүрд хүсэлт явуулахгүйн тулд бага
   * зэрэг хүлээж, өмнөх хүсэлтийг цуцална.
   */
  useEffect(() => {
    const regno = form.register;
    if (!isValidRegister(regno)) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const info = await checkRegister(regno, controller.signal);
        if (!info) {
          setLookup({ regno, check: { status: "unknown" } });
        } else if (!info.found) {
          setLookup({ regno, check: { status: "notfound" } });
          setErrors((previous) => ({
            ...previous,
            register: "Энэ регистрээр Монголд бүртгэлтэй байгууллага олдсонгүй",
          }));
        } else {
          setLookup({
            regno,
            check: { status: "found", name: info.name.trim() },
          });
          setErrors((previous) => ({ ...previous, company: undefined }));
        }
      } catch {
        // цуцлагдсан — шинэ дугаарын шалгалт үргэлжилж байна
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [form.register]);
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
    if (key === "register" || key === "email") setExistingLogin("");
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const next: Partial<Record<keyof Lead, string>> = {};
    if (!isValidRegister(form.register))
      next.register = "7 оронтой регистрийн дугаар оруулна уу";
    else if (registerCheck.status === "notfound")
      next.register = "Энэ регистрээр Монголд бүртгэлтэй байгууллага олдсонгүй";
    else if (registerCheck.status === "checking")
      next.register = "Регистрийг шалгаж байна, түр хүлээнэ үү";
    // Түгжигдсэн үед нэр нь регистрээс хамаарна — алдааг регистр дээр л гаргана
    if (companyEditable && !valid.company)
      next.company = "Байгууллагын нэрээ бичнэ үү";
    if (!valid.name) next.name = "Нэрээ бичнэ үү";
    if (!valid.phone) next.phone = "8 оронтой дугаар оруулна уу";
    if (!valid.email) next.email = "Имэйл хаяг буруу байна";

    setErrors(next);
    setAttempt((count) => count + 1);
    setExistingLogin("");
    if (Object.keys(next).length > 0) return;

    // OTP илгээхээс ӨМНӨ: бүртгэлтэй хүн кодоо оруулсны дараа мэдэх ёсгүй
    setChecking(true);
    const conflict = await checkLead(lead);
    setChecking(false);
    if (conflict) {
      setErrors({ [conflict.field]: conflict.message });
      setAttempt((count) => count + 1);
      setExistingLogin(loginLink(conflict.loginUrl, lead.email));
      return;
    }

    setStep("verify");
  };

  // Баталгаажуулах алхмаас буцах. Сервер талбарын алдаа буцаасан бол
  // (регистр олдсонгүй г.м) маягт дээр тэр талбарыг нь тодруулна.
  const backToForm = (fields?: LeadFieldErrors) => {
    setStep("form");
    if (!fields) return;
    setErrors({
      company: fields.company,
      register: fields.register,
      name: fields.name,
      phone: fields.phone,
      email: fields.email,
    });
    setAttempt((count) => count + 1);
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

                <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-emerald-300 bg-clip-text text-transparent">
                  Одоо
                </span>{" "}
                эхлээрэй
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-white/60">
                Маягтаа бөглөөд утас эсвэл имэйлээ баталгаажуулмагц шууд нэвтэрч
                эхэлнэ.
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
                  Утас{" "}
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
                {step === "done" && account ? (
                  <Success account={account} lead={lead} />
                ) : step === "verify" ? (
                  <Verify
                    lead={lead}
                    onBack={backToForm}
                    onDone={(created) => {
                      setAccount(created);
                      setStep("done");
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
                      <div className="grid gap-4 sm:grid-cols-[11rem_1fr]">
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
                          hint={<RegisterHint check={registerCheck} />}
                          onChange={(value) =>
                            set("register", value.replace(/\D/g, ""))
                          }
                        />
                        <Field
                          label="Байгууллагын нэр"
                          icon={<Building2 size={16} />}
                          autoComplete="organization"
                          value={lead.company}
                          valid={valid.company}
                          error={errors.company}
                          shake={attempt}
                          readOnly={!companyEditable}
                          placeholder={
                            companyEditable
                              ? "Байгууллагын нэрээ бичнэ үү"
                              : "Байгууллагын нэр"
                          }
                          onChange={(value) => set("company", value)}
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

                    {existingLogin && (
                      <a
                        href={existingLogin}
                        className="animate-fade-up mt-4 flex items-center justify-between gap-2 rounded-xl bg-brand-soft px-4 py-3 text-sm font-semibold text-brand-strong transition hover:bg-brand-soft/70"
                      >
                        Бүртгэлтэй байна — нэвтрэх хуудас руу очих
                        <ArrowRight size={15} />
                      </a>
                    )}

                    <button
                      type="submit"
                      disabled={checking}
                      className={PRIMARY_BUTTON}
                    >
                      {checking ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Шалгаж байна...
                        </>
                      ) : (
                        <>
                          Үргэлжлүүлэх
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>

                    <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted">
                      <ShieldCheck size={13} className="text-emerald-500" />
                      Мэдээлэл тань нууцлагдана
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

/**
 * Утас эсвэл имэйлээ сонгоод 6 оронтой кодоор баталгаажуулна. Код зөв
 * бол хүсэлт тэр дороо илгээгдэнэ — backend кодгүй хүсэлт хадгалахгүй.
 */
function Verify({
  lead,
  onBack,
  onDone,
}: {
  lead: Lead;
  onBack: (fields?: LeadFieldErrors) => void;
  onDone: (account: TrialAccount) => void;
}) {
  const [channel, setChannel] = useState<OtpChannel>("phone");
  // Код аль суваг руу явсан. Сувгаа солибол шинээр илгээх хэрэгтэй.
  const [sentTo, setSentTo] = useState<OtpChannel | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  // Аль хэдийн бүртгэлтэй бол алдааны доор нэвтрэх холбоос гаргана
  const [loginUrl, setLoginUrl] = useState("");
  const [busy, setBusy] = useState<"send" | "verify" | null>(null);
  // Дахин илгээх хүртэл үлдсэн секунд
  const [wait, setWait] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = window.setTimeout(() => setWait((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);

  useEffect(() => {
    if (sentTo) codeRef.current?.focus();
  }, [sentTo]);

  const options: {
    key: OtpChannel;
    label: string;
    value: string;
    icon: ReactNode;
  }[] = [
    {
      key: "phone",
      label: "Утас",
      value: lead.phone,
      icon: <Phone size={16} />,
    },
    {
      key: "email",
      label: "Имэйл",
      value: lead.email,
      icon: <Mail size={16} />,
    },
  ];
  const codeSent = sentTo === channel;
  const target = options.find((option) => option.key === channel)!.value;

  const send = async () => {
    setBusy("send");
    setError("");
    try {
      const resendIn = await requestLeadOtp(channel, lead);
      setSentTo(channel);
      setCode("");
      setWait(resendIn);
    } catch (err) {
      if (err instanceof LeadError && err.loginUrl) {
        setError(err.message);
        setLoginUrl(loginLink(err.loginUrl, lead.email));
        return;
      }
      // Утас / имэйл буруу гэвэл маягт руу буцааж тэр талбарыг тодруулна
      if (err instanceof LeadError && (err.fields.phone || err.fields.email)) {
        onBack(err.fields);
        return;
      }
      setError(err instanceof Error ? err.message : "Код илгээж чадсангүй");
    } finally {
      setBusy(null);
    }
  };

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!codeSent) {
      await send();
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setError("6 оронтой кодоо оруулна уу");
      codeRef.current?.focus();
      return;
    }

    setBusy("verify");
    setError("");
    try {
      onDone(await submitLead(lead, { channel, otp: code }));
    } catch (err) {
      if (err instanceof LeadError && err.loginUrl) {
        setError(err.message);
        setLoginUrl(loginLink(err.loginUrl, lead.email));
      } else if (err instanceof LeadError && err.fields.otp) {
        setError(err.fields.otp);
        setCode("");
        codeRef.current?.focus();
      } else if (
        err instanceof LeadError &&
        Object.keys(err.fields).length > 0
      ) {
        onBack(err.fields);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Илгээхэд алдаа гарлаа. Дахин оролдоно уу.",
        );
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <form onSubmit={verify} noValidate className="animate-fade-up">
      <button
        type="button"
        onClick={() => onBack()}
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted transition hover:text-ink"
      >
        <ArrowLeft size={14} />
        Мэдээлэл засах
      </button>

      <h3 className="mt-3 text-xl font-extrabold">Баталгаажуулах</h3>
      <p className="mt-1 text-sm text-muted">
        <span className="font-semibold text-ink">{lead.company}</span>-ийн
        хүсэлтийг баталгаажуулах кодыг хаана авах вэ?
      </p>

      <div role="radiogroup" className="mt-5 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const active = channel === option.key;
          return (
            <button
              key={option.key}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={busy !== null}
              onClick={() => {
                setChannel(option.key);
                setError("");
              }}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition duration-200 active:scale-[0.98] ${
                active
                  ? "border-brand bg-brand-soft shadow-[0_0_0_3px_rgb(91_91_214_/_0.12)]"
                  : "border-line hover:border-brand/40 hover:bg-bg-soft"
              }`}
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                  active ? "bg-brand text-white" : "bg-bg-soft text-muted"
                }`}
              >
                {option.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-muted">
                  {option.label}
                </span>
                <span className="block truncate text-sm font-semibold">
                  {option.value}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {codeSent && (
        <label className="animate-fade-up mt-5 block">
          <span className="block text-sm font-semibold">
            Баталгаажуулах код
          </span>
          <span className="block text-[11px] text-muted">
            {target} руу 6 оронтой код илгээлээ
          </span>
          <input
            ref={codeRef}
            value={code}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="••••••"
            aria-invalid={Boolean(error)}
            onChange={(event) => {
              setCode(event.target.value.replace(/\D/g, ""));
              setError("");
            }}
            className={`mt-1.5 w-full rounded-xl border bg-bg-soft py-3 text-center text-xl font-bold tracking-[0.5em] outline-none transition duration-200 placeholder:text-muted/40 focus:bg-white focus:shadow-[0_0_0_4px_rgb(91_91_214_/_0.12)] ${
              error ? "border-red-400" : "border-line focus:border-brand"
            }`}
          />
        </label>
      )}

      {error && (
        <p className="animate-fade-up mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          {loginUrl && (
            <a
              href={loginUrl}
              className="mt-1 block font-semibold text-red-800 underline"
            >
              Нэвтрэх хуудас руу очих →
            </a>
          )}
        </p>
      )}

      <button type="submit" disabled={busy !== null} className={PRIMARY_BUTTON}>
        {busy ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {busy === "send" ? "Код илгээж байна..." : "Илгээж байна..."}
          </>
        ) : (
          <>
            {codeSent ? "Баталгаажуулж эхлүүлэх" : "Код илгээх"}
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </>
        )}
      </button>

      {codeSent && (
        <p className="mt-4 text-center text-xs text-muted">
          Код ирсэнгүй юу?{" "}
          <button
            type="button"
            onClick={send}
            disabled={wait > 0 || busy !== null}
            className="font-semibold text-brand hover:underline disabled:text-muted disabled:no-underline"
          >
            {wait > 0 ? `Дахин илгээх (${wait}с)` : "Дахин илгээх"}
          </button>
        </p>
      )}
    </form>
  );
}

/**
 * «2026 оны 10-р сарын 19». `toLocaleDateString("mn-MN")`-ийг ашиглахгүй:
 * олон хөтөчид монгол locale байхгүй тул англиар («October 19») гарна.
 */
function formatMnDate(iso: string) {
  const date = new Date(iso);
  return `${date.getFullYear()} оны ${date.getMonth() + 1}-р сарын ${date.getDate()}`;
}

/** Нэвтрэх хуудас — имэйлийг нь урьдчилан бөглөнө */
function loginLink(url: string, username: string) {
  return `${url}?username=${encodeURIComponent(username)}`;
}

function Success({ account, lead }: { account: TrialAccount; lead: Lead }) {
  const ends = formatMnDate(account.trial_ends_at);
  const target = account.sent_to === "phone" ? lead.phone : lead.email;

  return (
    <div className="py-6 text-center">
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
        Туршилт эхэллээ
      </h3>
      <p
        className="animate-fade-up mt-2 text-sm text-muted"
        style={{ animationDelay: "250ms" }}
      >
        <span className="font-semibold text-ink">{lead.company}</span> {ends}{" "}
        хүртэл бүх боломжийг үнэгүй ашиглана.
      </p>

      <div
        className="animate-fade-up mt-5 rounded-xl bg-bg-soft p-4 text-left text-sm"
        style={{ animationDelay: "300ms" }}
      >
        <p className="text-xs font-semibold text-muted">Нэвтрэх нэр</p>
        <p className="font-semibold break-all">{account.username}</p>
        {account.password_sent ? (
          <p className="mt-3 text-xs text-muted">
            Нууц үгийг <span className="font-semibold text-ink">{target}</span>{" "}
            руу илгээлээ.
          </p>
        ) : (
          <p className="mt-3 text-xs text-amber-700">
            Нууц үгийг илгээж чадсангүй. Бид удахгүй холбогдоно, эсвэл{" "}
            <a href={`tel:${BRAND.phone}`} className="font-semibold underline">
              {BRAND.phone}
            </a>{" "}
            руу залгана уу.
          </p>
        )}
      </div>

      <a
        href={loginLink(account.login_url, account.username)}
        className={`${PRIMARY_BUTTON} animate-fade-up`}
        style={{ animationDelay: "350ms" }}
      >
        Нэвтрэх
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </a>
    </div>
  );
}

function RegisterHint({ check }: { check: RegisterCheck }) {
  if (check.status === "checking") {
    return (
      <span className="flex items-center gap-1 text-muted">
        <Loader2 size={11} className="animate-spin" />
        Шалгаж байна...
      </span>
    );
  }
  if (check.status === "found") {
    return (
      <span className="flex items-center gap-1 text-emerald-600">
        <ShieldCheck size={11} />
        Бүртгэлтэй байгууллага
      </span>
    );
  }
  return null;
}

function Field({
  label,
  icon,
  value,
  onChange,
  error,
  hint,
  valid,
  shake,
  readOnly,
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
  /** Алдаа байхгүй үед доор нь гарах тайлбар */
  hint?: ReactNode;
  valid?: boolean;
  /** Утгыг системээс бөглөнө — хэрэглэгч засахгүй */
  readOnly?: boolean;
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
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : undefined}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-xl border py-2.5 pr-9 pl-10 text-sm outline-none transition duration-200 placeholder:text-muted/50 ${
            readOnly
              ? "cursor-default bg-bg-soft/60 font-semibold"
              : "bg-bg-soft hover:border-brand/30 focus:bg-white focus:shadow-[0_0_0_4px_rgb(91_91_214_/_0.12)]"
          } ${
            error
              ? "border-red-400 bg-red-50/40 focus:border-red-400 focus:shadow-[0_0_0_4px_rgb(248_113_113_/_0.15)]"
              : readOnly
                ? "border-line"
                : "border-line focus:border-brand"
          }`}
        />
        {valid && !error && (
          <span className="animate-pop pointer-events-none absolute top-1/2 right-3 grid size-5 -translate-y-1/2 place-items-center rounded-full bg-emerald-500 text-white">
            <Check size={12} strokeWidth={3} />
          </span>
        )}
      </div>
      {error ? (
        <span className="animate-fade-up mt-1 block text-[11px] text-red-600">
          {error}
        </span>
      ) : (
        hint && <span className="mt-1 block text-[11px]">{hint}</span>
      )}
    </label>
  );
}
