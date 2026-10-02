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

export type LeadFieldErrors = Partial<Record<keyof Lead, string>>;

/** Серверийн алдаа. `fields` дүүрэн бол маягтын тэр талбар дээр гаргана. */
export class LeadError extends Error {
  fields: LeadFieldErrors;

  constructor(message: string, fields: LeadFieldErrors = {}) {
    super(message);
    this.name = "LeadError";
    this.fields = fields;
  }
}

type LeadResponse = { message?: string; data?: LeadFieldErrors };

export async function submitLead(lead: Lead): Promise<void> {
  if (!LEAD_ENDPOINT) {
    console.warn("[lead] LEAD_ENDPOINT тохируулаагүй тул илгээсэнгүй:", lead);
    // Сүлжээний саатлыг дуурайж, товчны «илгээж байна» төлөв харагдана
    await new Promise((resolve) => setTimeout(resolve, 600));
    return;
  }

  let response: Response;
  try {
    response = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
  } catch {
    throw new LeadError("Сервертэй холбогдож чадсангүй. Сүлжээгээ шалгана уу.");
  }

  if (response.ok) return;

  // Хариу нь JSON биш байж болно (прокси 502 гэх мэт) — унагаахгүй.
  const body: LeadResponse | null = await response.json().catch(() => null);

  if (response.status === 400 && body?.data) {
    throw new LeadError(body.message ?? "Мэдээллээ шалгана уу", body.data);
  }

  throw new LeadError(body?.message ?? `Сервер ${response.status} буцаалаа`);
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
