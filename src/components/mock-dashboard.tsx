import {
  CalendarOff,
  CheckCircle2,
  Clock,
  Gauge,
  Inbox,
  ListChecks,
  MapPin,
  TreePalm,
  Users,
  Wallet,
} from "lucide-react";

/*
 * Системийн ДҮРСЛЭЛ — дэлгэцийн зураг биш.
 *
 * Жинхэнэ screenshot тавихад (а) хэрэглэгчийн жинхэнэ нэр, тоо задарч
 * болзошгүй, (б) дэлгэц өөрчлөгдөх бүрд зураг хуучирдаг. Тиймээс бодит
 * дэлгэцийн БҮТЦИЙГ давтсан, өгөгдөл нь зохиомол загварыг HTML-ээр зурсан.
 *
 * ⚠️ Доорх нэр, тоонууд нь ҮЗҮҮЛЭНГИЙН утга — жинхэнэ үзүүлэлт биш.
 */

const SIDEBAR = [Gauge, Inbox, ListChecks, Clock, Users, MapPin, Wallet];

const STATS = [
  {
    label: "Ирсэн",
    value: "42",
    tone: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: CheckCircle2,
  },
  {
    label: "Хоцорсон",
    value: "3",
    tone: "text-amber-600",
    bg: "bg-amber-50",
    icon: Clock,
  },
  {
    label: "Чөлөөтэй",
    value: "5",
    tone: "text-violet-600",
    bg: "bg-violet-50",
    icon: TreePalm,
  },
];

/** Долоо хоногийн багана — [ирсэн, хоцорсон] хувиар */
const WEEK = [
  { day: "Да", on: 88, late: 6 },
  { day: "Мя", on: 92, late: 4 },
  { day: "Лх", on: 76, late: 14 },
  { day: "Пү", on: 95, late: 3 },
  { day: "Ба", on: 84, late: 9 },
  { day: "Бя", on: 40, late: 0 },
  { day: "Ня", on: 22, late: 0 },
];

const REQUESTS = [
  { name: "Б. Номин", kind: "Чөлөө · 2 хоног", icon: CalendarOff },
  { name: "Г. Тэмүүлэн", kind: "Цаг засах · 09:10", icon: Clock },
  { name: "Д. Ануужин", kind: "Зайнаас · Даваа", icon: MapPin },
];

export function MockDashboard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-lg)]">
      {/* ── хөтчийн толгой ── */}
      <div className="flex items-center gap-2 border-b border-line bg-bg-soft px-4 py-3">
        <span className="size-2.5 rounded-full bg-red-400/70" />
        <span className="size-2.5 rounded-full bg-amber-400/70" />
        <span className="size-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 hidden rounded-md bg-white px-3 py-1 text-[11px] text-muted sm:block">
          app.gertu.mn/dashboard
        </span>
      </div>

      <div className="flex">
        {/* ── хажуугийн цэс ── */}
        <div className="hidden w-14 shrink-0 flex-col items-center gap-3 border-r border-line bg-white py-5 sm:flex">
          <span className="grid size-8 place-items-center rounded-lg bg-brand text-white">
            <Clock size={15} strokeWidth={2.5} />
          </span>
          {SIDEBAR.map((Icon, index) => (
            <span
              key={index}
              className={`grid size-8 place-items-center rounded-lg ${
                index === 0 ? "bg-brand-soft text-brand" : "text-muted/50"
              }`}
            >
              <Icon size={15} />
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1 bg-bg-soft p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-ink">Хяналтын самбар</p>
              <p className="text-[11px] text-muted">Өнөөдөр · 50 ажилтан</p>
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-muted ring-1 ring-line">
              9-р сар
            </span>
          </div>

          {/* ── үзүүлэлт ── */}
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-line bg-white p-2.5 sm:p-3"
              >
                <span
                  className={`grid size-6 place-items-center rounded-lg ${stat.bg} ${stat.tone}`}
                >
                  <stat.icon size={13} />
                </span>
                <p className="mt-2 text-lg leading-none font-extrabold text-ink sm:text-xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-5">
            {/* ── долоо хоногийн график ── */}
            <div className="rounded-xl border border-line bg-white p-3 sm:col-span-3">
              <p className="text-[11px] font-semibold text-ink">
                Долоо хоногийн ирц
              </p>
              <div className="mt-3 flex h-24 items-end gap-1.5">
                {WEEK.map((item) => (
                  <div
                    key={item.day}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <div className="flex h-20 w-full flex-col justify-end gap-0.5">
                      {item.late > 0 && (
                        <div
                          className="w-full rounded-t-sm bg-amber-300"
                          style={{ height: `${item.late}%` }}
                        />
                      )}
                      <div
                        className="w-full rounded-t-sm bg-brand/85"
                        style={{ height: `${item.on}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-muted">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── хүлээгдэж буй хүсэлт ── */}
            <div className="rounded-xl border border-line bg-white p-3 sm:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-ink">Хүсэлтүүд</p>
                <span className="rounded-full bg-red-500 px-1.5 text-[9px] font-bold text-white">
                  3
                </span>
              </div>
              <div className="mt-2.5 space-y-2">
                {REQUESTS.map((request) => (
                  <div key={request.name} className="flex items-center gap-2">
                    <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-bg-soft text-muted">
                      <request.icon size={12} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-semibold text-ink">
                        {request.name}
                      </p>
                      <p className="truncate text-[9px] text-muted">
                        {request.kind}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md bg-brand-soft px-1.5 py-0.5 text-[9px] font-bold text-brand-strong">
                      Батлах
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
