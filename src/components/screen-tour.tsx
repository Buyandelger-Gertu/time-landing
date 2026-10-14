import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Bell,
  CalendarDays,
  CalendarOff,
  Check,
  CheckCircle2,
  Clock,
  Fingerprint,
  Inbox,
  MapPin,
  Send,
  Users,
  Wallet,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container, Reveal } from "./ui";

/*
 * СИСТЕМЭЭР АЯЛАХ — дэлгэцүүд ээлжлэн солигдоно.
 *
 * Hero дээр хяналтын самбар харагддаг тул энд ӨӨР дэлгэцүүдийг үзүүлнэ.
 * `MockDashboard`-тай ижил зарчим: жинхэнэ screenshot биш, бүтцийг давтсан
 * загвар. ⚠️ Нэр, тоо бүгд ЗОХИОМОЛ.
 *
 * Автомат тоглуулалтын цагийг CSS барина (`.tour-progress` дуусахад
 * дараагийнх руу). Тиймээс зогсоох = `animation-play-state: paused`, мөн
 * `prefers-reduced-motion` үед автоматаар солигдохгүй.
 */

const DURATION_MS = 5500;

type Screen = {
  id: string;
  label: string;
  title: string;
  text: string;
  icon: LucideIcon;
  path: string;
  Desktop: () => ReactNode;
  Phone: () => ReactNode;
};

/** `--i` — дэлгэц доторх элементийн гарч ирэх дараалал */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

// ── 1. Ирц ──────────────────────────────────────────────────────────────────

const ATTENDANCE = [
  {
    name: "Б. Номин",
    dept: "Борлуулалт",
    in: "08:52",
    status: "on",
    via: MapPin,
  },
  {
    name: "Г. Тэмүүлэн",
    dept: "Хөгжүүлэлт",
    in: "09:14",
    status: "late",
    via: Wifi,
  },
  {
    name: "Д. Ануужин",
    dept: "Санхүү",
    in: "08:41",
    status: "on",
    via: Fingerprint,
  },
  {
    name: "Э. Мөнх-Эрдэнэ",
    dept: "Агуулах",
    in: "07:58",
    status: "on",
    via: Fingerprint,
  },
  {
    name: "С. Халиун",
    dept: "Хүний нөөц",
    in: "—",
    status: "leave",
    via: CalendarOff,
  },
  {
    name: "О. Батбаяр",
    dept: "Хөгжүүлэлт",
    in: "08:59",
    status: "on",
    via: MapPin,
  },
] as const;

const STATUS = {
  on: { label: "Ажиллаж байна", tone: "bg-emerald-50 text-emerald-700" },
  late: { label: "Хоцорсон", tone: "bg-amber-50 text-amber-700" },
  leave: { label: "Чөлөөтэй", tone: "bg-violet-50 text-violet-700" },
};

function AttendanceDesktop() {
  return (
    <div className="p-4 sm:p-5">
      <div
        className="tour-item flex items-center justify-between"
        style={at(0)}
      >
        <div>
          <p className="text-sm font-bold text-ink">Ирцийн бүртгэл</p>
          <p className="text-[11px] text-muted">Өнөөдөр · 50 ажилтан</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
          <span className="relative flex size-1.5">
            <span className="animate-ring absolute inset-0 rounded-full bg-emerald-400" />
            <span className="relative size-1.5 rounded-full bg-emerald-500" />
          </span>
          Шууд
        </span>
      </div>

      <div className="tour-item mt-3 flex gap-1.5" style={at(1)}>
        {[
          ["Бүгд", "50", true],
          ["Ирсэн", "42", false],
          ["Хоцорсон", "3", false],
          ["Чөлөөтэй", "5", false],
        ].map(([label, count, active]) => (
          <span
            key={label as string}
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              active
                ? "bg-ink text-white"
                : "bg-white text-muted ring-1 ring-line"
            }`}
          >
            {label} <span className="opacity-60">{count}</span>
          </span>
        ))}
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-line bg-white">
        {ATTENDANCE.map((row, index) => {
          const status = STATUS[row.status];
          return (
            <div
              key={row.name}
              className="tour-item flex items-center gap-3 border-b border-line px-3 py-2 last:border-0"
              style={at(index + 2)}
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-soft text-[10px] font-bold text-brand-strong">
                {row.name.split(" ")[1][0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-ink">
                  {row.name}
                </p>
                <p className="truncate text-[9px] text-muted">{row.dept}</p>
              </div>
              <span className="hidden text-muted/70 sm:block">
                <row.via size={12} />
              </span>
              <span className="w-10 text-right text-[11px] font-bold tabular-nums text-ink">
                {row.in}
              </span>
              <span
                className={`hidden w-24 rounded-md px-2 py-0.5 text-center text-[9px] font-semibold sm:block ${status.tone}`}
              >
                {status.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AttendancePhone() {
  return (
    <div className="flex h-full flex-col px-4 pb-5">
      <p className="tour-item mt-2 text-[11px] text-muted" style={at(0)}>
        Өглөөний мэнд,
      </p>
      <p className="tour-item text-sm font-extrabold text-ink" style={at(0)}>
        Б. Номин
      </p>

      <div className="tour-item mt-6 grid place-items-center" style={at(1)}>
        <span className="relative grid size-32 place-items-center">
          <span className="animate-ring absolute inset-0 rounded-full bg-brand/25" />
          <span className="relative grid size-32 place-items-center rounded-full bg-gradient-to-b from-brand to-brand-strong text-white shadow-[0_16px_30px_-12px_rgb(91_91_214_/_0.8)]">
            <span className="text-center">
              <Fingerprint size={26} className="mx-auto" />
              <span className="mt-1 block text-[11px] font-bold">Ирлээ</span>
            </span>
          </span>
        </span>
      </div>

      <div
        className="tour-item mx-auto mt-5 flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700"
        style={at(2)}
      >
        <MapPin size={11} />
        Оффисын бүсэд байна
        <Check size={11} strokeWidth={3} />
      </div>

      <div
        className="tour-item mt-auto rounded-2xl bg-bg-soft p-3"
        style={at(3)}
      >
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted">Өнөөдрийн хуваарь</span>
          <span className="font-bold text-ink tabular-nums">09:00 – 18:00</span>
        </div>
      </div>
    </div>
  );
}

// ── 2. Хүсэлт ───────────────────────────────────────────────────────────────

const REQUESTS = [
  {
    name: "Б. Номин",
    kind: "Ээлжийн амралт",
    when: "10/14 – 10/16 · 3 хоног",
    icon: CalendarOff,
    approved: true,
  },
  {
    name: "Г. Тэмүүлэн",
    kind: "Цаг засах",
    when: "10/06 · 09:10 → 08:55",
    icon: Clock,
    approved: false,
  },
  {
    name: "Д. Ануужин",
    kind: "Зайнаас ажиллах",
    when: "10/09 · Пүрэв",
    icon: MapPin,
    approved: false,
  },
];

function RequestsDesktop() {
  return (
    <div className="p-4 sm:p-5">
      <div
        className="tour-item flex items-center justify-between"
        style={at(0)}
      >
        <div>
          <p className="text-sm font-bold text-ink">Хүсэлтүүд</p>
          <p className="text-[11px] text-muted">
            3 хүсэлт таны шийдвэрийг хүлээж байна
          </p>
        </div>
        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
          3
        </span>
      </div>

      <div className="mt-3 space-y-2.5">
        {REQUESTS.map((request, index) => (
          <div
            key={request.name}
            className="tour-item relative rounded-xl border border-line bg-white p-3"
            style={at(index + 1)}
          >
            <div className="flex items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                <request.icon size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-ink">
                  {request.name}{" "}
                  <span className="font-normal text-muted">
                    · {request.kind}
                  </span>
                </p>
                <p className="mt-0.5 text-[10px] text-muted tabular-nums">
                  {request.when}
                </p>
              </div>
              {request.approved ? (
                // Эхний хүсэлтийг «батлах» мөчийг харуулна
                <span
                  className="tour-item flex items-center gap-1 rounded-md bg-emerald-500 px-2 py-1 text-[9px] font-bold text-white"
                  style={at(7)}
                >
                  <CheckCircle2 size={11} />
                  Батлагдсан
                </span>
              ) : (
                <span className="flex shrink-0 gap-1.5">
                  <span className="rounded-md px-2 py-1 text-[9px] font-semibold text-muted ring-1 ring-line">
                    Татгалзах
                  </span>
                  <span className="rounded-md bg-brand px-2 py-1 text-[9px] font-bold text-white">
                    Батлах
                  </span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        className="tour-item mt-3 flex items-center gap-2 rounded-xl bg-white/70 p-3 text-[10px] text-muted ring-1 ring-line"
        style={at(5)}
      >
        <Bell size={12} className="text-brand" />
        Батлагдмагц ажилтанд мэдэгдэл очиж, ирцэд автоматаар тусна.
      </div>
    </div>
  );
}

function RequestsPhone() {
  return (
    <div className="flex h-full flex-col px-4 pb-5">
      <p
        className="tour-item mt-2 text-sm font-extrabold text-ink"
        style={at(0)}
      >
        Чөлөө хүсэх
      </p>

      <p
        className="tour-item mt-4 text-[10px] font-semibold text-muted"
        style={at(1)}
      >
        Төрөл
      </p>
      <div className="tour-item mt-1.5 flex flex-wrap gap-1.5" style={at(1)}>
        {["Ээлжийн амралт", "Өвчтэй", "Цалингүй"].map((kind, index) => (
          <span
            key={kind}
            className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
              index === 0 ? "bg-brand text-white" : "bg-bg-soft text-muted"
            }`}
          >
            {kind}
          </span>
        ))}
      </div>

      <p
        className="tour-item mt-4 text-[10px] font-semibold text-muted"
        style={at(2)}
      >
        Хугацаа
      </p>
      <div
        className="tour-item mt-1.5 flex items-center justify-between rounded-xl bg-bg-soft px-3 py-2.5 text-[10px]"
        style={at(2)}
      >
        <span className="font-bold text-ink tabular-nums">10/14 – 10/16</span>
        <span className="text-muted">3 хоног</span>
      </div>

      <div
        className="tour-item mt-2 rounded-xl bg-bg-soft px-3 py-2.5 text-[10px] text-muted"
        style={at(3)}
      >
        Гэр бүлийн ажлаар
      </div>

      <div
        className="tour-item mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-[11px] font-bold text-white"
        style={at(4)}
      >
        <Send size={12} />
        Илгээх
      </div>
      <div
        className="tour-item mt-2 flex items-center justify-center gap-1 text-[10px] font-semibold text-emerald-600"
        style={at(8)}
      >
        <CheckCircle2 size={11} />
        Батлагдлаа
      </div>
    </div>
  );
}

// ── 3. Хуваарь ──────────────────────────────────────────────────────────────

const DAYS = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"];

/** Нэг мөр = нэг ажилтан. o = өглөө, d = өдөр, n = шөнө, - = амралт */
const SHIFTS = [
  { name: "Б. Номин", week: "ddddd--" },
  { name: "Э. Мөнх-Эрдэнэ", week: "ooonn-o" },
  { name: "Д. Ануужин", week: "ddddd--" },
  { name: "Ц. Билгүүн", week: "nn--ooo" },
  { name: "О. Батбаяр", week: "-ddddd-" },
];

const SHIFT = {
  o: { label: "07–15", tone: "bg-sky-100 text-sky-800" },
  d: { label: "09–18", tone: "bg-brand-soft text-brand-strong" },
  n: { label: "23–07", tone: "bg-ink text-white" },
  "-": { label: "", tone: "bg-transparent" },
} as const;

function ScheduleDesktop() {
  return (
    <div className="p-4 sm:p-5">
      <div
        className="tour-item flex items-center justify-between"
        style={at(0)}
      >
        <div>
          <p className="text-sm font-bold text-ink">Ээлж, хуваарь</p>
          <p className="text-[11px] text-muted">10-р сарын 6 – 12</p>
        </div>
        <span className="flex gap-1.5 text-[9px] font-semibold">
          <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-sky-800">
            Өглөө
          </span>
          <span className="rounded-md bg-brand-soft px-1.5 py-0.5 text-brand-strong">
            Өдөр
          </span>
          <span className="rounded-md bg-ink px-1.5 py-0.5 text-white">
            Шөнө
          </span>
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-line bg-white">
        <div
          className="tour-item grid grid-cols-[5.5rem_repeat(7,1fr)] gap-1 border-b border-line px-2 py-2 text-center text-[9px] font-semibold text-muted"
          style={at(1)}
        >
          <span />
          {DAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        {SHIFTS.map((row, index) => (
          <div
            key={row.name}
            className="grid grid-cols-[5.5rem_repeat(7,1fr)] items-center gap-1 border-b border-line px-2 py-1.5 last:border-0"
          >
            <span
              className="tour-item truncate text-[10px] font-semibold text-ink"
              style={at(index + 2)}
            >
              {row.name}
            </span>
            {row.week.split("").map((code, day) => {
              const shift = SHIFT[code as keyof typeof SHIFT];
              return (
                <span
                  key={day}
                  className={`tour-fill h-6 rounded-md text-center text-[8px] leading-6 font-bold tabular-nums ${shift.tone} ${
                    code === "-" ? "ring-1 ring-line ring-inset" : ""
                  }`}
                  style={at(index + day * 0.5 + 2)}
                >
                  {shift.label}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function SchedulePhone() {
  const mine = [
    ["Даваа", "09:00 – 18:00"],
    ["Мягмар", "09:00 – 18:00"],
    ["Лхагва", "09:00 – 18:00"],
    ["Пүрэв", "Зайнаас"],
    ["Баасан", "09:00 – 17:00"],
  ];
  return (
    <div className="flex h-full flex-col px-4 pb-5">
      <p
        className="tour-item mt-2 text-sm font-extrabold text-ink"
        style={at(0)}
      >
        Миний хуваарь
      </p>
      <p className="tour-item text-[10px] text-muted" style={at(0)}>
        Энэ долоо хоног
      </p>
      <div className="mt-4 space-y-2">
        {mine.map(([day, time], index) => (
          <div
            key={day}
            className={`tour-item flex items-center justify-between rounded-xl px-3 py-2.5 text-[10px] ${
              index === 1 ? "bg-brand text-white" : "bg-bg-soft"
            }`}
            style={at(index + 1)}
          >
            <span className={index === 1 ? "font-bold" : "text-muted"}>
              {day}
            </span>
            <span className="font-bold tabular-nums">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 4. Цалин ────────────────────────────────────────────────────────────────

const PAYROLL = [
  { name: "Б. Номин", base: "1,800,000", ot: 4, net: "1,642,600" },
  { name: "Г. Тэмүүлэн", base: "2,400,000", ot: 9, net: "2,281,300" },
  { name: "Д. Ануужин", base: "2,100,000", ot: 0, net: "1,869,000" },
  { name: "Э. Мөнх-Эрдэнэ", base: "1,600,000", ot: 12, net: "1,702,400" },
];

function PayrollDesktop() {
  return (
    <div className="p-4 sm:p-5">
      <div
        className="tour-item flex items-center justify-between"
        style={at(0)}
      >
        <div>
          <p className="text-sm font-bold text-ink">Цалин · 9-р сар</p>
          <p className="text-[11px] text-muted">Ирцээс автоматаар бодогдсон</p>
        </div>
        <span className="flex items-center gap-1 rounded-lg bg-brand px-2.5 py-1.5 text-[10px] font-bold text-white">
          <Send size={11} />
          Банк руу илгээх
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["Нийт олгох", "₮86.4сая"],
          ["НДШ", "₮11.2сая"],
          ["ХХОАТ", "₮8.1сая"],
        ].map(([label, value], index) => (
          <div
            key={label}
            className="tour-item rounded-xl border border-line bg-white p-2.5"
            style={at(index + 1)}
          >
            <p className="text-[9px] text-muted">{label}</p>
            <p className="mt-1 text-sm font-extrabold text-ink tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-line bg-white">
        <div className="grid grid-cols-[1fr_4.5rem_4rem_4.5rem] gap-2 border-b border-line px-3 py-2 text-[9px] font-semibold text-muted">
          <span>Ажилтан</span>
          <span className="text-right">Үндсэн</span>
          <span>Илүү цаг</span>
          <span className="text-right">Гарт</span>
        </div>
        {PAYROLL.map((row, index) => (
          <div
            key={row.name}
            className="tour-item grid grid-cols-[1fr_4.5rem_4rem_4.5rem] items-center gap-2 border-b border-line px-3 py-2 last:border-0"
            style={at(index + 4)}
          >
            <span className="truncate text-[10px] font-semibold text-ink">
              {row.name}
            </span>
            <span className="text-right text-[10px] text-muted tabular-nums">
              {row.base}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-soft">
                <span
                  className="tour-fill block h-full rounded-full bg-amber-400"
                  style={{ ...at(index + 5), width: `${(row.ot / 12) * 100}%` }}
                />
              </span>
              <span className="w-4 text-[9px] text-muted tabular-nums">
                {row.ot}ц
              </span>
            </span>
            <span className="text-right text-[10px] font-bold text-ink tabular-nums">
              {row.net}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PayrollPhone() {
  const lines = [
    ["Үндсэн цалин", "1,800,000"],
    ["Илүү цаг · 4ц", "+92,300"],
    ["НДШ", "−207,000"],
    ["ХХОАТ", "−42,700"],
  ];
  return (
    <div className="flex h-full flex-col px-4 pb-5">
      <p
        className="tour-item mt-2 text-sm font-extrabold text-ink"
        style={at(0)}
      >
        Цалингийн хуудас
      </p>
      <p className="tour-item text-[10px] text-muted" style={at(0)}>
        9-р сар
      </p>

      <div
        className="tour-item mt-4 rounded-2xl bg-gradient-to-br from-brand to-brand-strong p-4 text-white"
        style={at(1)}
      >
        <p className="text-[10px] opacity-80">Гарт олгох</p>
        <p className="mt-1 text-xl font-extrabold tabular-nums">₮1,642,600</p>
      </div>

      <div className="mt-3 space-y-2">
        {lines.map(([label, value], index) => (
          <div
            key={label}
            className="tour-item flex items-center justify-between text-[10px]"
            style={at(index + 2)}
          >
            <span className="text-muted">{label}</span>
            <span
              className={`font-bold tabular-nums ${
                value.startsWith("−") ? "text-red-500" : "text-ink"
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <div
        className="tour-item mt-auto flex items-center justify-center gap-1 rounded-xl bg-emerald-50 py-2 text-[10px] font-semibold text-emerald-700"
        style={at(6)}
      >
        <CheckCircle2 size={11} />
        Данс руу шилжсэн
      </div>
    </div>
  );
}

const SCREENS: Screen[] = [
  {
    id: "attendance",
    label: "Ирц",
    title: "Ирц шууд харагдана",
    text: "Ажилтан утаснаасаа «Ирлээ» гэж дармагц таны самбар дээр хэдхэн секундэд гарна.",
    icon: Users,
    path: "attendance",
    Desktop: AttendanceDesktop,
    Phone: AttendancePhone,
  },
  {
    id: "requests",
    label: "Хүсэлт",
    title: "Нэг товчоор батална",
    text: "Чөлөө, цаг засах, зайнаас ажиллах хүсэлт нэг дор ирж, батлагдмагц ирцэд тусна.",
    icon: Inbox,
    path: "requests",
    Desktop: RequestsDesktop,
    Phone: RequestsPhone,
  },
  {
    id: "schedule",
    label: "Хуваарь",
    title: "Ээлжээ төлөвлө",
    text: "Өглөө, өдөр, шөнийн ээлжийг долоо хоногоор нь зохион байгуулна.",
    icon: CalendarDays,
    path: "schedule",
    Desktop: ScheduleDesktop,
    Phone: SchedulePhone,
  },
  {
    id: "payroll",
    label: "Цалин",
    title: "Цалин өөрөө бодогдоно",
    text: "Ирц, илүү цаг, суутгалаас цалин автоматаар бодогдож, ажилтан утсаараа хуудсаа харна.",
    icon: Wallet,
    path: "payroll",
    Desktop: PayrollDesktop,
    Phone: PayrollPhone,
  },
];

// ── Хэсэг ───────────────────────────────────────────────────────────────────

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ScreenTour() {
  const [active, setActive] = useState(0);
  // Гарч буй дэлгэц — шинэ нь орж ирэх зуур хөдөлгөөнөөрөө алга болно
  const [leaving, setLeaving] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  /*
   * Утсан дээр алхмууд хэвтээ гүйдэг — идэвхтэй нь харагдахаар гүйлгэнэ.
   * `scrollIntoView` бус: тэр нь хуудсыг ч босоо гүйлгэж хэрэглэгчийг
   * уншиж байгаа газраас нь чирнэ.
   */
  useEffect(() => {
    const list = tabsRef.current;
    const tab = list?.children[active] as HTMLElement | undefined;
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({
      left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [active]);

  // Дэлгэцээс гарсан үед цаг зогсоно — буцаж ирэхэд дундаас нь үргэлжилнэ
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const go = (index: number, direction: 1 | -1) => {
    if (index === active) return;
    // Хөдөлгөөнгүй горимд гарах хөдөлгөөн ажиллахгүй тул давхарга үлдэнэ
    setLeaving(prefersReducedMotion() ? null : active);
    setDir(direction);
    setActive(index);
  };
  const next = () => go((active + 1) % SCREENS.length, 1);

  const screen = SCREENS[active];
  const paused = hovered || !visible;

  return (
    <section
      ref={rootRef}
      id="tour"
      className={`relative isolate overflow-hidden bg-bg-deep py-20 text-white sm:py-28 ${
        paused ? "tour-paused" : ""
      }`}
      style={
        {
          "--tour-duration": `${DURATION_MS}ms`,
          "--dir": dir,
        } as CSSProperties
      }
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute top-10 -right-32 size-[30rem] rounded-full bg-brand/35 blur-[120px]" />
        <div className="animate-drift-slow absolute -bottom-40 -left-32 size-[26rem] rounded-full bg-emerald-400/10 blur-[120px]" />
      </div>

      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              Системээр аялах
            </span>
            <h2 className="mt-5 text-3xl font-extrabold sm:text-5xl sm:leading-[1.1]">
              Өдөр тутмын ажил{" "}
              <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-emerald-300 bg-clip-text text-transparent">
                нэг дор
              </span>
            </h2>
            <p className="mt-4 text-white/60">
              Ажилтны утас, удирдлагын веб хоёр зэрэг шинэчлэгдэнэ.
            </p>
          </div>
        </Reveal>

        <div
          className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[17rem_1fr] lg:gap-12"
          // Зөвхөн хулганаар — утсан дээр хүрэхэд `mouseenter` гараад
          // `mouseleave` ирдэггүй тул үүрд зогсчихно
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setHovered(true);
          }}
          onPointerLeave={() => setHovered(false)}
        >
          {/* ── алхмууд ── */}
          <Reveal delay={80} className="min-w-0">
            <div
              ref={tabsRef}
              role="tablist"
              aria-label="Системийн дэлгэцүүд"
              className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0 lg:flex-col lg:overflow-visible"
            >
              {SCREENS.map((item, index) => {
                const selected = index === active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="tour-stage"
                    onClick={() => go(index, index > active ? 1 : -1)}
                    className={`group relative shrink-0 overflow-hidden rounded-2xl border px-4 py-3 text-left transition duration-300 lg:py-4 ${
                      selected
                        ? "border-white/15 bg-white/[0.07]"
                        : "border-transparent hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-xl transition duration-300 ${
                          selected
                            ? "bg-gradient-to-br from-brand to-brand-strong text-white shadow-lg shadow-brand/30"
                            : "bg-white/5 text-white/50 group-hover:text-white/80"
                        }`}
                      >
                        <item.icon size={17} />
                      </span>
                      <span
                        className={`text-sm font-semibold whitespace-nowrap ${
                          selected ? "text-white" : "text-white/55"
                        }`}
                      >
                        <span className="lg:hidden">{item.label}</span>
                        <span className="hidden lg:inline">{item.title}</span>
                      </span>
                    </span>

                    {/* Сонгогдсон алхмын тайлбар зөөлөн нээгдэнэ (зөвхөн том дэлгэцэд) */}
                    <span
                      className={`hidden transition-[grid-template-rows,opacity] duration-500 lg:grid ${
                        selected
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="block pt-2 pl-12 text-[13px] leading-relaxed text-white/55">
                          {item.text}
                        </span>
                      </span>
                    </span>

                    {/* Явцын шугам — дуусахад дараагийн дэлгэц */}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/5">
                      {selected && (
                        <span
                          key={active}
                          className="tour-progress block h-full bg-gradient-to-r from-brand to-emerald-400"
                          onAnimationEnd={next}
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            <p
              key={screen.id}
              className="animate-fade-up mt-4 text-sm leading-relaxed text-white/60 lg:hidden"
            >
              {screen.text}
            </p>
          </Reveal>

          {/* ── дэлгэцүүд ── */}
          <Reveal delay={160} className="min-w-0">
            <div id="tour-stage" role="tabpanel" className="relative lg:pr-28">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_40px_80px_-30px_rgb(0_0_0_/_0.6)]">
                <div className="flex items-center gap-2 border-b border-line bg-bg-soft px-4 py-3">
                  <span className="size-2.5 rounded-full bg-red-400/70" />
                  <span className="size-2.5 rounded-full bg-amber-400/70" />
                  <span className="size-2.5 rounded-full bg-emerald-400/70" />
                  <span className="ml-3 hidden rounded-md bg-white px-3 py-1 text-[11px] text-muted sm:block">
                    time-dev.gertu.mn/
                    <span
                      key={screen.path}
                      className="animate-fade-up inline-block text-ink"
                    >
                      {screen.path}
                    </span>
                  </span>
                </div>

                <div className="flex">
                  <SideNav active={active} />
                  <div className="relative h-[380px] min-w-0 flex-1 overflow-hidden bg-bg-soft sm:h-[400px]">
                    {/* Утас баруун талыг далдлах тул агуулгыг түүнээс зайтай байрлуулна */}
                    {leaving !== null && (
                      <Layer
                        key={`out-${leaving}`}
                        className="tour-out lg:right-[88px]"
                        onDone={() => setLeaving(null)}
                      >
                        {SCREENS[leaving].Desktop()}
                      </Layer>
                    )}
                    <Layer
                      key={`in-${active}`}
                      className="tour-in lg:right-[88px]"
                    >
                      {screen.Desktop()}
                    </Layer>
                  </div>
                </div>
              </div>

              {/* ── утас — вебтэй зэрэг солигдоно ── */}
              <div className="absolute right-0 -bottom-10 hidden w-[200px] rounded-[2.2rem] border-[6px] border-bg-deep bg-bg-deep shadow-[0_30px_60px_-20px_rgb(0_0_0_/_0.7)] ring-1 ring-white/10 lg:block">
                <div className="relative h-[400px] overflow-hidden rounded-[1.8rem] bg-white">
                  <div className="relative z-10 flex items-center justify-between bg-white px-5 pt-3 pb-1 text-[10px] font-semibold text-ink">
                    <span>9:41</span>
                    <span className="absolute top-1.5 left-1/2 h-4 w-14 -translate-x-1/2 rounded-full bg-bg-deep" />
                    <Bell size={11} className="text-muted" />
                  </div>
                  <div className="absolute inset-x-0 top-8 bottom-0">
                    {leaving !== null && (
                      <Layer key={`out-${leaving}`} className="tour-out-y">
                        {SCREENS[leaving].Phone()}
                      </Layer>
                    )}
                    <Layer key={`in-${active}`} className="tour-in-y">
                      {screen.Phone()}
                    </Layer>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/**
 * Дэлгэцийн давхарга. Гарч буй нь дуусахдаа `onDone` дуудна.
 *
 * ⚠️ `animationend` хүүхэд элементүүдээс ч хөөсөрч ирдэг (`.tour-item`
 * г.м) — зөвхөн ӨӨРИЙН хөдөлгөөн дууссаныг тоолно.
 */
function Layer({
  className,
  onDone,
  children,
}: {
  className: string;
  onDone?: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute inset-0 ${className}`}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) onDone?.();
      }}
    >
      {children}
    </div>
  );
}

/** Хажуугийн цэс — идэвхтэй тэмдэглэгээ дэлгэцийн хамт гулсана */
function SideNav({ active }: { active: number }) {
  return (
    <div className="relative hidden w-14 shrink-0 flex-col items-center gap-3 border-r border-line bg-white py-5 sm:flex">
      <span className="grid size-8 place-items-center rounded-lg bg-brand text-white">
        <Clock size={15} strokeWidth={2.5} />
      </span>
      <span
        aria-hidden
        className="absolute left-1/2 size-8 -translate-x-1/2 rounded-lg bg-brand-soft transition-[top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        // 20px дээд зай + лого (32) + 12px зай, мөр бүр 44px
        style={{ top: 20 + 44 + active * 44 }}
      />
      {SCREENS.map((item, index) => (
        <span
          key={item.id}
          className={`relative grid size-8 place-items-center rounded-lg transition-colors duration-500 ${
            index === active ? "text-brand" : "text-muted/50"
          }`}
        >
          <item.icon size={15} />
        </span>
      ))}
    </div>
  );
}
