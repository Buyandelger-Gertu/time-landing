import { Bell, Fingerprint, MapPin, Wifi } from "lucide-react";

/*
 * Ажилтны апп-ын дүрслэл. `MockDashboard`-тай ижил зарчим — жинхэнэ
 * screenshot биш, бүтцийг нь давтсан загвар.
 */

const TODAY = [
  { label: "Ирсэн", time: "08:52", tone: "bg-emerald-500" },
  { label: "Завсарлага", time: "12:30", tone: "bg-slate-400" },
  { label: "Эргэж ирсэн", time: "13:28", tone: "bg-emerald-500" },
];

export function MockPhone() {
  return (
    <div className="mx-auto w-[248px] rounded-[2.4rem] border-[7px] border-bg-deep bg-bg-deep shadow-[var(--shadow-lg)]">
      <div className="relative overflow-hidden rounded-[1.9rem] bg-white">
        {/* дэлгэцийн дээд хэсэг */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[10px] font-semibold text-ink">
          <span>9:41</span>
          <span className="absolute left-1/2 top-1.5 h-4 w-16 -translate-x-1/2 rounded-full bg-bg-deep" />
          <Bell size={11} className="text-muted" />
        </div>

        <div className="px-4 pb-5">
          <p className="mt-2 text-[11px] text-muted">Өглөөний мэнд,</p>
          <p className="text-sm font-extrabold text-ink">Б. Номин</p>

          {/* ── бүртгүүлэх товч ── */}
          <div className="mt-4 rounded-2xl bg-gradient-to-b from-brand to-brand-strong p-4 text-center text-white">
            <p className="text-[10px] opacity-80">Ажилласан хугацаа</p>
            <p className="mt-0.5 text-2xl font-extrabold tabular-nums">04:36</p>
            <div className="mt-3 rounded-xl bg-white/15 py-2.5 text-[11px] font-bold backdrop-blur-sm">
              Явлаа гэж бүртгүүлэх
            </div>
          </div>

          {/* ── баталгаажуулалт ── */}
          <div className="mt-3 flex gap-1.5">
            {[
              { icon: MapPin, label: "Байршил" },
              { icon: Wifi, label: "Wi-Fi" },
              { icon: Fingerprint, label: "Төхөөрөмж" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-emerald-50 py-2 text-emerald-700"
              >
                <item.icon size={12} />
                <span className="text-[8px] font-semibold">{item.label}</span>
              </div>
            ))}
          </div>

          {/* ── өнөөдрийн түүх ── */}
          <p className="mt-4 text-[10px] font-bold text-ink">Өнөөдөр</p>
          <div className="mt-2 space-y-2">
            {TODAY.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`size-1.5 rounded-full ${item.tone}`} />
                <span className="flex-1 text-[10px] text-ink-soft">
                  {item.label}
                </span>
                <span className="text-[10px] font-bold tabular-nums text-ink">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
