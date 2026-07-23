import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";
import { WHATSAPP_ADMIN } from "@/lib/design-tokens";

const waUrl = `https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(
  "Halo Admin Indah Mesin, saya ingin konsultasi pembelian mesin industri dan kunjungan showroom."
)}`;

export default function ContactPage() {
  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border-subtle bg-surface/95 px-4 backdrop-blur safe-top">
        <Link
          href="/home"
          className="rounded-full p-2 transition-colors hover:bg-surface-container"
        >
          <ArrowLeft className="size-5 text-primary" />
        </Link>
        <h1 className="text-lg font-bold text-primary">Hubungi Kami</h1>
      </header>

      <main className="pb-8">
        <section className="relative aspect-[16/9] overflow-hidden">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtTKLH6D5sgnWoHc5DaIFwdx-E0KHMwu_MYMUf8nMkIKlE38ozC3w_z-3zFg4gPZWmFOi25TF6eLiyXrMnZjqH1so1lQfbtIrs-CrlJ7tQDDlAoZmAaf7Dh-4h2Q3vd0GJdvpsnDa4UWkhoaVgVv6pwGQSpWamaMq-Twn_8dlYqRmqvdk5DXM3SLL6RhbZcWS4vOJZY2Kr7smo2-AhNQO-qy7JrmwesrC12k_fi9TYx8b3tZI5MAQ3Xf6jWX9-hM54LGbBZQnq-mtA"
            alt="Showroom Indah Mesin"
            fill
            className="object-cover"
            sizes="400px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
          <div className="absolute bottom-0 p-6 text-white">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest opacity-80">
              Showroom & Service Center
            </p>
            <h2 className="text-2xl font-bold">Kunjungi Showroom Kami</h2>
            <p className="mt-2 max-w-sm text-sm opacity-90">
              Lihat langsung mesin industri dan konsultasi dengan tim ahli kami.
            </p>
          </div>
        </section>

        <section className="px-4 py-6">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] text-base font-semibold text-white shadow-lg transition-transform active:scale-[0.98]"
          >
            <MessageCircle className="size-6 fill-current" />
            Chat WhatsApp Admin
          </a>

          <div className="mb-6 overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
            <div className="relative aspect-video bg-metallic-bg">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrxWJ6RNAaT_9R8pNdOeuWQjjfedjtlMWw-XKYmkUp1QACERTYrYdO8bHN3Qag6Kg-6lifiSzMpL24w4Iv5lXWbubKlRKu5VqCi7IpMznmVHJO8z-NA-vK9COPOWb3SD7A0iNc40CN_XPXgXdRflHq8Oyz_pxOj2SuD2N6Z2tgaoYoL-GQPccH1MCL8jTLz9PyO5ZpIe0hWojBfZDLHm3OKh5_81fFsuMMZbUSeL_Mlq6hy8MNryucEeG63keUzE3kVPFL-gxmgv6n"
                alt="Peta lokasi showroom"
                fill
                className="object-cover opacity-80"
                sizes="400px"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                  <MapPin className="size-6" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="mb-1 font-semibold text-primary">
                IndustrialX Showroom Jakarta
              </h3>
              <p className="mb-3 text-sm text-on-surface-variant">
                Jl. Industri Raya No. 88, Kawasan Pergudangan, Jakarta Barat
                11730, Indonesia
              </p>
              <a
                href="https://maps.google.com/?q=Jakarta+Industri"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                <Navigation className="size-4" />
                Buka di Google Maps
              </a>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-border-subtle bg-white p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary-container/10 text-primary">
                <Clock className="size-5" />
              </div>
              <h3 className="font-semibold text-on-surface">Jam Operasional</h3>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Senin – Jumat</dt>
                <dd className="font-medium text-on-surface">08:00 – 17:00 WIB</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Sabtu</dt>
                <dd className="font-medium text-on-surface">08:00 – 14:00 WIB</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Minggu & Libur</dt>
                <dd className="font-medium text-status-indent">Tutup</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: Phone,
                label: "Telepon",
                value: "+62 812-3456-7890",
                href: "tel:+6281234567890",
              },
              {
                icon: Mail,
                label: "Email",
                value: "admin@indahmesin.com",
                href: "mailto:admin@indahmesin.com",
              },
            ].map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-4 rounded-xl border border-border-subtle bg-white p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-metallic-bg text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant">{label}</p>
                  <p className="font-medium text-on-surface">{value}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
