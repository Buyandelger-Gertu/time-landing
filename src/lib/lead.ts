import { BRAND, TRIAL_DAYS } from "@/content";

/**
 * Бүртгүүлэх хүсэлтийг backend рүү илгээх хэсэг.
 *
 * Хаягийг `VITE_LEAD_ENDPOINT`-оор өгнө (`.env`, `.env.production`).
 *
 * ⚠️ ХООСОН БАЙВАЛ МАЯГТ ЗӨВХӨН ХАРАГДАЦ. Өгөгдөл хаашаа ч илгээгдэхгүй,
 * зөвхөн консолд хэвлэнэ — хэрэглэгч «амжилттай» гэсэн мэдэгдэл харах
 * атлаа хүсэлт нь хэнд ч очихгүй. Тиймээс хөгжүүлэлтийн үед маягт дээр
 * анхааруулга гарна (`SignUp` доторх `DEV` шалгалт).
 *
 * ⚠️ ТАНИЛЦУУЛГА ХУУДАС ӨӨР ДОМЭЙН ДЭЭР БАЙДАГ. Backend-ийн
 * `CORS_ORIGINS`-д тэр домэйныг нэмээгүй бол хөтөч хүсэлтийг чимээгүй
 * хаана — доорх `catch` үүнийг «Сервертэй холбогдож чадсангүй» гэж
 * харуулна, учир нь хөтөч CORS-ын шалтгааныг JS-д хэлдэггүй.
 */
export const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT ?? "";

export type Lead = {
  company: string;
  register: string;
  name: string;
  phone: string;
  email: string;
  size: string;
};

/** OTP илгээх суваг */
export type OtpChannel = "phone" | "email";

/** Утас / имэйлээр авсан баталгаажуулах код */
export type LeadVerification = { channel: OtpChannel; otp: string };

export type LeadFieldErrors = Partial<
  Record<keyof Lead | "otp" | "channel", string>
>;

/** Серверийн алдаа. `fields` дүүрэн бол маягтын тэр талбар дээр гаргана. */
export class LeadError extends Error {
  fields: LeadFieldErrors;
  /** Байгууллага / данс аль хэдийн бүртгэлтэй (409) — нэвтрэх холбоос */
  loginUrl?: string;

  constructor(
    message: string,
    fields: LeadFieldErrors = {},
    loginUrl?: string,
  ) {
    super(message);
    this.name = "LeadError";
    this.fields = fields;
    this.loginUrl = loginUrl;
  }
}

/** Баталгаажсаны дараа үүссэн туршилтын данс */
export type TrialAccount = {
  username: string;
  login_url: string;
  trial_ends_at: string;
  sent_to: OtpChannel;
  /** false — данс үүссэн ч нууц үгийг илгээж чадсангүй */
  password_sent: boolean;
};

/** Бүртгэлтэй байгууллага / данс — маягтын тухайн талбар дээр гаргана */
export type LeadConflict = {
  message: string;
  field: "register" | "email";
  loginUrl: string;
};

/**
 * Маягтын «Үргэлжлүүлэх» дээр регистр, имэйлээр бүртгэл байгаа эсэхийг
 * OTP илгээхээс ӨМНӨ шалгана.
 *
 * `null` — бүртгэлгүй, эсвэл шалгаж чадсангүй. Шалгаж чадаагүй үед
 * маягтыг хаахгүй: backend код илгээх, хадгалах үедээ дахин шалгана.
 */
export async function checkLead(
  lead: Pick<Lead, "register" | "email">,
): Promise<LeadConflict | null> {
  if (!LEAD_ENDPOINT) return null;

  try {
    const response = await fetch(`${LEAD_ENDPOINT.replace(/\/$/, "")}/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ register: lead.register, email: lead.email }),
    });
    if (response.status !== 409) return null;

    const body: {
      message?: string;
      data?: { field?: string; login_url?: string };
    } | null = await response.json().catch(() => null);

    return {
      message: body?.message ?? "Аль хэдийн бүртгэлтэй байна. Нэвтэрнэ үү.",
      field: body?.data?.field === "email" ? "email" : "register",
      loginUrl: body?.data?.login_url ?? `${BRAND.appUrl}/login`,
    };
  } catch {
    return null;
  }
}

/**
 * Сонгосон утас / имэйл рүү 6 оронтой код илгээнэ.
 * Буцаах утга — дахин илгээх хүртэл хүлээх секунд.
 */
export async function requestLeadOtp(
  channel: OtpChannel,
  lead: Pick<Lead, "phone" | "email" | "register">,
): Promise<number> {
  if (!LEAD_ENDPOINT) {
    console.warn("[lead] LEAD_ENDPOINT тохируулаагүй тул код илгээсэнгүй");
    await new Promise((resolve) => setTimeout(resolve, 600));
    return 60;
  }

  let response: Response;
  try {
    response = await fetch(`${LEAD_ENDPOINT.replace(/\/$/, "")}/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Регистр — код илгээхээс өмнө давхардлыг шалгахад
      body: JSON.stringify({
        channel,
        phone: lead.phone,
        email: lead.email,
        register: lead.register,
      }),
    });
  } catch {
    throw new LeadError("Сервертэй холбогдож чадсангүй. Сүлжээгээ шалгана уу.");
  }

  const body: {
    message?: string;
    data?: { resend_in?: number } & LeadFieldErrors;
  } | null = await response.json().catch(() => null);

  if (response.ok) return body?.data?.resend_in ?? 60;

  if (response.status === 400 && body?.data) {
    throw new LeadError(body.message ?? "Мэдээллээ шалгана уу", body.data);
  }

  // Байгууллага / данс бүртгэлтэй — код илгээгээгүй
  if (response.status === 409) {
    const data = (body?.data ?? {}) as { login_url?: string };
    throw new LeadError(
      body?.message ?? "Аль хэдийн бүртгэлтэй байна. Нэвтэрнэ үү.",
      {},
      data.login_url ?? `${BRAND.appUrl}/login`,
    );
  }
  throw new LeadError(body?.message ?? `Сервер ${response.status} буцаалаа`);
}

/**
 * Хүсэлтийг илгээнэ. Код зөв бол backend компани ба админ дансыг үүсгэж,
 * нууц үгийг баталгаажсан суваг руу илгээнэ.
 */
export async function submitLead(
  lead: Lead,
  verification: LeadVerification,
): Promise<TrialAccount> {
  if (!LEAD_ENDPOINT) {
    console.warn("[lead] LEAD_ENDPOINT тохируулаагүй тул илгээсэнгүй:", lead);
    // Сүлжээний саатлыг дуурайж, товчны «илгээж байна» төлөв харагдана
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      username: lead.email,
      login_url: `${BRAND.appUrl}/login`,
      trial_ends_at: new Date(Date.now() + TRIAL_DAYS * 864e5).toISOString(),
      sent_to: verification.channel,
      password_sent: true,
    };
  }

  let response: Response;
  try {
    response = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, ...verification }),
    });
  } catch {
    throw new LeadError("Сервертэй холбогдож чадсангүй. Сүлжээгээ шалгана уу.");
  }

  // Хариу нь JSON биш байж болно (прокси 502 гэх мэт) — унагаахгүй.
  const body: {
    message?: string;
    data?: unknown;
  } | null = await response.json().catch(() => null);

  if (response.ok && body?.data) return body.data as TrialAccount;

  if (response.status === 400 && body?.data) {
    throw new LeadError(
      body.message ?? "Мэдээллээ шалгана уу",
      body.data as LeadFieldErrors,
    );
  }

  if (response.status === 409) {
    const data = (body?.data ?? {}) as { login_url?: string };
    throw new LeadError(
      body?.message ?? "Аль хэдийн бүртгэлтэй байна. Нэвтэрнэ үү.",
      {},
      data.login_url ?? `${BRAND.appUrl}/login`,
    );
  }

  throw new LeadError(body?.message ?? `Сервер ${response.status} буцаалаа`);
}

export type RegisterInfo = { found: boolean; name: string };

/**
 * Регистрээр Монголд бүртгэлтэй байгууллага мөн эсэхийг шалгана.
 *
 * Backend нь ebarimt руу дамжуулдаг (`GET /api/leads/register/:regno`) —
 * ebarimt CORS зөвшөөрдөггүй тул хөтчөөс шууд дуудах боломжгүй.
 *
 * `null` — шалгаж чадсангүй (endpoint тохируулаагүй, сервер унасан).
 * Ийм үед маягтыг ХААХГҮЙ: backend илгээх үед дахин шалгана.
 */
export async function checkRegister(
  regno: string,
  signal?: AbortSignal,
): Promise<RegisterInfo | null> {
  if (!LEAD_ENDPOINT) return null;

  try {
    const response = await fetch(
      `${LEAD_ENDPOINT.replace(/\/$/, "")}/register/${encodeURIComponent(regno)}`,
      { signal },
    );
    if (!response.ok) return null;
    const body: { data?: RegisterInfo } | null = await response
      .json()
      .catch(() => null);
    return body?.data ?? null;
  } catch (error) {
    // Хэрэглэгч цааш бичсэнээр цуцлагдсан бол дуудсан тал мэдэх ёстой
    if (signal?.aborted) throw error;
    return null;
  }
}

/** Монгол дугаар — 8 орон, 6/7/8/9-өөр эхэлнэ */
export function isValidPhone(value: string) {
  return /^[6-9]\d{7}$/.test(value.replace(/[\s-]/g, ""));
}

/** Хуулийн этгээдийн регистр — 7 орон */
export function isValidRegister(value: string) {
  return /^\d{7}$/.test(value.replace(/\s/g, ""));
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
