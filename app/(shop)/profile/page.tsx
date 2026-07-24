import Link from "next/link";

import Image from "next/image";

import { Ms } from "@/components/stitch/ms";



const menuLinkClass =

  "flex items-center justify-between rounded-xl border border-border-subtle bg-white p-4 transition-all hover:border-primary/30 active:scale-[0.98]";



export default function ProfilePage() {

  return (

    <>

      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border-subtle bg-surface px-margin-mobile">

        <Link

          href="/beranda-artikel"

          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container"

        >

          <Ms name="arrow_back" className="text-primary" />

        </Link>

        <h1 className="font-headline-md text-headline-md font-bold text-primary">My Profile</h1>

        <button

          type="button"

          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container"

        >

          <Ms name="edit" className="text-primary" />

        </button>

      </header>



      <main className="mx-auto max-w-2xl px-margin-mobile pb-24 pt-20">

        <section className="mb-8 flex flex-col items-center">

          <div className="relative mb-4">

            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-primary-container shadow-xl">

              <Image

                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtTKLH6D5sgnWoHc5DaIFwdx-E0KHMwu_MYMUf8nMkIKlE38ozC3w_z-3zFg4gPZWmFOi25TF6eLiyXrMnZjqH1so1lQfbtIrs-CrlJ7tQDDlAoZmAaf7Dh-4h2Q3vd0GJdvpsnDa4UWkhoaVgVv6pwGQSpWamaMq-Twn_8dlYqRmqvdk5DXM3SLL6RhbZcWS4vOJZY2Kr7smo2-AhNQO-qy7JrmwesrC12k_fi9TYx8b3tZI5MAQ3Xf6jWX9-hM54LGbBZQnq-mtA"

                alt="Budi Santoso"

                width={128}

                height={128}

                className="h-full w-full object-cover"

              />

            </div>

            <div className="absolute bottom-1 right-1 rounded-full border-2 border-surface bg-primary p-1.5 text-white shadow-md">

              <Ms name="verified" className="text-[18px]" />

            </div>

          </div>

          <div className="text-center">

            <h2 className="mb-1 font-headline-lg-mobile text-headline-lg-mobile text-on-background">

              Budi Santoso

            </h2>

            <p className="mb-1 font-medium text-on-surface-variant">PT. Pangan Makmur Abadi</p>

            <div className="flex items-center justify-center gap-2">

              <span className="rounded bg-surface-container-high px-2 py-0.5 font-label-technical text-label-technical uppercase tracking-wider text-on-surface-variant">

                ID: 25030024

              </span>

              <span className="inline-flex items-center gap-1 rounded bg-secondary-container/20 px-2 py-0.5 text-[12px] font-semibold text-secondary">

                <span className="h-2 w-2 rounded-full bg-secondary" />

                Verified Buyer

              </span>

            </div>

          </div>

        </section>



        <section className="bento-grid mb-8">

          {[

            { icon: "bookmark", label: "Saved Items", href: "/favorites" },

            { icon: "history", label: "Orders", href: "#" },

            { icon: "description", label: "Docs", href: "#" },

          ].map(({ icon, label, href }) => (

            <Link

              key={label}

              href={href}

              className="group flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-surface-container-lowest p-4 transition-all duration-300 hover:bg-primary-container"

            >

              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary-container/10 transition-colors group-hover:bg-white/20">

                <Ms name={icon} className="text-primary group-hover:text-white" />

              </div>

              <span className="text-center font-body-sm text-body-sm text-on-surface-variant group-hover:text-white">

                {label}

              </span>

            </Link>

          ))}

        </section>



        <section className="mb-8 space-y-2">

          <div className="mb-2 border-b border-border-subtle px-2 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">

            Account Management

          </div>

          {[

            { icon: "person_outline", label: "Account Settings", href: "#" },

            { icon: "business", label: "Company Profile", href: "#" },

          ].map(({ icon, label, href }) => (

            <Link key={label} href={href} className={menuLinkClass}>

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">

                  <Ms name={icon} />

                </div>

                <span className="font-body-md text-body-md font-semibold text-on-surface">

                  {label}

                </span>

              </div>

              <Ms name="chevron_right" className="text-outline" />

            </Link>

          ))}

          <Link href="#" className={menuLinkClass}>

            <div className="flex items-center gap-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">

                <Ms name="language" />

              </div>

              <span className="font-body-md text-body-md font-semibold text-on-surface">

                Language

              </span>

            </div>

            <div className="flex items-center gap-1 text-sm font-medium text-on-surface-variant">

              English (US)

              <Ms name="chevron_right" className="text-outline" />

            </div>

          </Link>



          <div className="mb-2 mt-6 border-b border-border-subtle px-2 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">

            Support &amp; Legal

          </div>

          {[

            { icon: "help_center", label: "Help Center", href: "#" },

            { icon: "policy", label: "Privacy Policy", href: "#" },

          ].map(({ icon, label, href }) => (

            <Link key={label} href={href} className={menuLinkClass}>

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">

                  <Ms name={icon} />

                </div>

                <span className="font-body-md text-body-md font-semibold text-on-surface">

                  {label}

                </span>

              </div>

              <Ms name="chevron_right" className="text-outline" />

            </Link>

          ))}



          <button

            type="button"

            className="mt-4 flex w-full items-center gap-4 rounded-xl border border-error/10 bg-error-container/20 p-4 text-error transition-all hover:bg-error-container/30 active:scale-[0.98]"

          >

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/50">

              <Ms name="logout" />

            </div>

            <span className="font-body-md text-body-md font-bold">Logout</span>

          </button>

        </section>



        <div className="mb-8 mt-4 text-center text-xs text-outline">

          IndustrialX v2.4.1 (Enterprise Edition)

        </div>

      </main>

    </>

  );

}

