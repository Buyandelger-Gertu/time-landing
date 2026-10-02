import { Mail, MapPin, Phone } from "lucide-react";

import { BRAND, MODULES, NAV } from "@/content";
import { Container } from "./ui";
import { Logo } from "./logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-bg-deep pt-16 pb-8 text-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo tone="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              {BRAND.product}. Ирц, чөлөө, ажил, цалин — бүгдийг нэг дороос.
            </p>

            <div className="mt-6 space-y-2.5 text-sm text-white/60">
              <a
                href={`tel:${BRAND.phone}`}
                className="flex items-center gap-2.5 hover:text-white"
              >
                <Phone size={14} />
                {BRAND.phone}
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                className="flex items-center gap-2.5 hover:text-white"
              >
                <Mail size={14} />
                {BRAND.email}
              </a>
              <p className="flex items-center gap-2.5">
                <MapPin size={14} />
                {BRAND.address}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold">Хуудас</p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-white/50 hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold">Модулиуд</p>
            <ul className="mt-4 space-y-2.5">
              {/* Бүгдийг нь жагсаавал хөл хэсэг хэт урсана */}
              {MODULES.slice(0, 6).map((module) => (
                <li key={module.title}>
                  <a
                    href="#modules"
                    className="text-sm text-white/50 hover:text-white"
                  >
                    {module.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.name}. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <div className="flex gap-5">
            <a href="#signup" className="hover:text-white">
              Үйлчилгээний нөхцөл
            </a>
            <a href="#signup" className="hover:text-white">
              Нууцлалын бодлого
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
