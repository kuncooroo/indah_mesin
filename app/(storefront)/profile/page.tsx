import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

import { ProfileLogoutButton } from "@/components/storefront/profile/profile-logout-button";
import { ProfileAuthPanel } from "@/components/storefront/profile/profile-auth-panel";
import { ProfileSettingsHeader } from "@/components/storefront/profile/profile-settings-header";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { getStorefrontSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function AuthPanelFallback() {
  return (
    <main className="bg-background pb-0 pt-8">
      <div className="mx-auto flex w-full max-w-md flex-col px-margin-mobile py-16 text-center text-on-surface-variant">
        Memuat formulir masuk…
      </div>
    </main>
  );
}

export default async function ProfilePage() {
  // Session storefront terpisah dari cookie admin — bisa login berdampingan.
  const session = await getStorefrontSession();
  if (!session?.user?.id) {
    return (
      <Suspense fallback={<AuthPanelFallback />}>
        <ProfileAuthPanel />
      </Suspense>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      company: { include: { _count: { select: { addresses: true } } } },
      _count: { select: { orders: true, archiveDocuments: true } },
    },
  });
  if (!dbUser) {
    return (
      <Suspense fallback={<AuthPanelFallback />}>
        <ProfileAuthPanel />
      </Suspense>
    );
  }
  const company = dbUser.company?.companyName ?? dbUser.companyName ?? "Pembeli independen";
  const businessIncomplete =
    !dbUser.company?.npwpNumber ||
    !dbUser.company?.nibNumber ||
    !dbUser.company._count.addresses;
  const initials = dbUser.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <ProfileSettingsHeader backHref="/beranda-artikel" title="Profile" />
      <main className="min-h-screen bg-background pt-16">
        <div className="flex w-full flex-col pb-8">
          <section className="flex flex-col items-center bg-gradient-to-b from-primary/5 to-transparent px-margin-mobile py-8 text-center">
            <div className="group relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary-fixed p-1 font-headline-lg-mobile text-2xl text-primary shadow-sm">
                {dbUser.avatar ? (
                  <Image
                    src={dbUser.avatar}
                    alt={dbUser.name}
                    width={96}
                    height={96}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span aria-hidden="true">{initials}</span>
                )}
              </div>
              <Link
                href="/profile/settings"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary shadow-md transition-transform hover:scale-105"
                aria-label="Edit profile"
              >
                <MaterialSymbol name="photo_camera" className="text-[18px]" />
              </Link>
            </div>
            <div className="mt-4">
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                {dbUser.name}
              </h2>
              <p className="mt-1 flex items-center justify-center gap-1.5 font-body-md text-on-surface-variant">
                <MaterialSymbol name="domain" className="text-[18px] text-primary" />
                {company}
              </p>
            </div>
          </section>

          {businessIncomplete ? (
            <Link
              href="/profile/business"
              className="mx-margin-mobile mb-6 flex items-start gap-3 rounded-xl border border-status-indent/20 bg-status-indent/10 p-4"
            >
              <MaterialSymbol name="info" className="text-status-indent" />
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Lengkapi data legalitas &amp; alamat PT untuk mulai transaksi PO
              </p>
            </Link>
          ) : null}

          <section className="grid grid-cols-2 gap-gutter px-margin-mobile">
            <Link
              href="/profile/orders"
              className="group flex flex-col rounded-xl bg-surface-container-low p-4 text-left transition-colors hover:bg-surface-container"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-on-primary">
                <MaterialSymbol name="shopping_cart" />
              </div>
              <span className="font-button-text text-button-text text-on-surface">MY ORDERS</span>
              <span className="mt-1 font-label-technical text-label-technical text-primary">
                {dbUser._count.orders} PO Diproses
              </span>
            </Link>
            <Link
              href="/profile/docs"
              className="group flex flex-col rounded-xl bg-surface-container-low p-4 text-left transition-colors hover:bg-surface-container"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-on-primary">
                <MaterialSymbol name="description" />
              </div>
              <span className="font-button-text text-button-text text-on-surface">MY DOCS</span>
              <span className="mt-1 font-label-technical text-label-technical text-primary">
                {dbUser._count.archiveDocuments} File PDF
              </span>
            </Link>
          </section>

          <section className="mt-section-gap flex flex-col gap-1 px-margin-mobile">
            <Link
              href="/profile/settings"
              className="flex items-center rounded-xl bg-surface-container-lowest p-4 text-left transition-colors hover:bg-surface-container-low"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant">
                <MaterialSymbol name="manage_accounts" />
              </div>
              <div className="ml-4 flex-1">
                <div className="font-button-text text-button-text text-on-surface">
                  Account Settings
                </div>
                <div className="line-clamp-1 font-body-sm text-body-sm text-on-surface-variant">
                  Atur foto, nama, telepon, dan password
                </div>
              </div>
              <MaterialSymbol name="chevron_right" className="text-outline" />
            </Link>

            <Link
              href="/profile/business"
              className="flex items-center rounded-xl bg-surface-container-lowest p-4 text-left transition-colors hover:bg-surface-container-low"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant">
                <MaterialSymbol name="corporate_fare" />
              </div>
              <div className="ml-4 flex-1">
                <div className="font-button-text text-button-text text-on-surface">
                  Profil Perusahaan
                </div>
                <div className="line-clamp-1 font-body-sm text-body-sm text-on-surface-variant">
                  Detail legalitas, NPWP, NIB, dan alamat kantor
                </div>
              </div>
              <MaterialSymbol name="chevron_right" className="text-outline" />
            </Link>

            <Link
              href="/profile/help"
              className="flex items-center rounded-xl bg-surface-container-lowest p-4 text-left transition-colors hover:bg-surface-container-low"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant">
                <MaterialSymbol name="support_agent" />
              </div>
              <div className="ml-4 flex-1">
                <div className="font-button-text text-button-text text-on-surface">
                  Help Center / Support
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Pusat Bantuan &amp; CS
                </div>
              </div>
              <MaterialSymbol name="chevron_right" className="text-outline" />
            </Link>

            <Link
              href="/profile/privacy"
              className="flex items-center rounded-xl bg-surface-container-lowest p-4 text-left transition-colors hover:bg-surface-container-low"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant">
                <MaterialSymbol name="policy" />
              </div>
              <div className="ml-4 flex-1">
                <div className="font-button-text text-button-text text-on-surface">Privacy Policy</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Kebijakan Privasi
                </div>
              </div>
              <MaterialSymbol name="chevron_right" className="text-outline" />
            </Link>

            <ProfileLogoutButton />
          </section>

          <footer className="mt-12 px-margin-mobile text-center">
            <p className="font-label-technical text-label-technical uppercase tracking-widest text-outline">
              MesinBagus v2.4.0
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
