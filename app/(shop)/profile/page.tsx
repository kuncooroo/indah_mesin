import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Bookmark,
  Building2,
  ChevronRight,
  FileText,
  Globe,
  HelpCircle,
  History,
  LogOut,
  Pencil,
  Shield,
  User,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 mx-auto flex h-16 max-w-lg items-center justify-between border-b border-border-subtle bg-surface px-4 safe-top">
        <Link href="/home" className="flex size-10 items-center justify-center rounded-full hover:bg-surface-container">
          <ArrowLeft className="size-5 text-primary" />
        </Link>
        <h1 className="text-lg font-bold text-primary">My Profile</h1>
        <button type="button" className="flex size-10 items-center justify-center rounded-full hover:bg-surface-container">
          <Pencil className="size-5 text-primary" />
        </button>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-24 pt-20">
        <section className="mb-8 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="size-32 overflow-hidden rounded-full border-4 border-primary-container shadow-xl">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtTKLH6D5sgnWoHc5DaIFwdx-E0KHMwu_MYMUf8nMkIKlE38ozC3w_z-3zFg4gPZWmFOi25TF6eLiyXrMnZjqH1so1lQfbtIrs-CrlJ7tQDDlAoZmAaf7Dh-4h2Q3vd0GJdvpsnDa4UWkhoaVgVv6pwGQSpWamaMq-Twn_8dlYqRmqvdk5DXM3SLL6RhbZcWS4vOJZY2Kr7smo2-AhNQO-qy7JrmwesrC12k_fi9TYx8b3tZI5MAQ3Xf6jWX9-hM54LGbBZQnq-mtA"
                alt="Budi Santoso"
                width={128}
                height={128}
                className="size-full object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1 rounded-full border-2 border-surface bg-primary p-1.5 text-white shadow-md">
              <Shield className="size-4" />
            </div>
          </div>
          <h2 className="mb-1 text-2xl font-bold text-on-background">Budi Santoso</h2>
          <p className="mb-1 font-medium text-on-surface-variant">PT. Pangan Makmur Abadi</p>
          <div className="flex items-center gap-2">
            <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[13px] uppercase tracking-wider text-on-surface-variant">
              ID: 25030024
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-secondary-container/20 px-2 py-0.5 text-xs font-semibold text-secondary">
              <span className="size-2 rounded-full bg-secondary" />
              Verified Buyer
            </span>
          </div>
        </section>

        <section className="mb-8 grid grid-cols-3 gap-3">
          {[
            { icon: Bookmark, label: "Saved Items", href: "/favorites" },
            { icon: History, label: "Orders", href: "#" },
            { icon: FileText, label: "Docs", href: "#" },
          ].map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className="group flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-white p-4 transition-all hover:bg-primary-container"
            >
              <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary-container/10 group-hover:bg-white/20">
                <Icon className="size-5 text-primary group-hover:text-white" />
              </div>
              <span className="text-center text-sm text-on-surface-variant group-hover:text-white">
                {label}
              </span>
            </Link>
          ))}
        </section>

        <section className="mb-8 space-y-2">
          <p className="mb-2 border-b border-border-subtle px-2 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Account Management
          </p>
          {[
            { icon: User, label: "Account Settings" },
            { icon: Building2, label: "Company Profile" },
            { icon: Globe, label: "Language", extra: "Indonesia" },
          ].map(({ icon: Icon, label, extra }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-xl border border-border-subtle bg-white p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                  <Icon className="size-5" />
                </div>
                <span className="font-semibold text-on-surface">{label}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                {extra}
                <ChevronRight className="size-4 text-outline" />
              </div>
            </div>
          ))}
        </section>

        <button
          type="button"
          className="flex w-full items-center gap-4 rounded-xl border border-error/10 bg-error-container/20 p-4 text-error"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-white/50">
            <LogOut className="size-5" />
          </div>
          <span className="font-bold">Logout</span>
        </button>
      </main>
    </>
  );
}
