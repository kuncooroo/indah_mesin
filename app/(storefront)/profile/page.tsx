import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { ProfileLogoutButton } from "@/components/storefront/profile/profile-logout-button";
import { ProfileAuthPanel } from "@/components/storefront/profile/profile-auth-panel";
import { ProfileSettingsHeader } from "@/components/storefront/profile/profile-settings-header";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { profileDemoUser } from "@/lib/storefront/profile-demo-data";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return <ProfileAuthPanel />;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      company: true,
      _count: { select: { orders: true, archiveDocuments: true } },
    },
  });
  if (!dbUser) {
    return <ProfileAuthPanel />;
  }
  const user = {
    ...profileDemoUser,
    name: dbUser.name,
    company: dbUser.company?.companyName ?? dbUser.companyName ?? "Independent Buyer",
    email: dbUser.email,
    phone: dbUser.phone ?? "",
    avatar: dbUser.avatar ?? profileDemoUser.avatar,
    processedPoCount: dbUser._count.orders,
    docCount: dbUser._count.archiveDocuments,
  };

  return (
    <>
      <ProfileSettingsHeader backHref="/beranda-artikel" />
      <main className="min-h-screen bg-background pt-16">
        <div className="flex w-full flex-col pb-8">
          <section className="flex flex-col items-center bg-gradient-to-b from-primary/5 to-transparent px-margin-mobile py-8 text-center">
            <div className="group relative">
              <div className="h-24 w-24 rounded-full bg-surface-container-highest p-1 shadow-sm">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={96}
                  height={96}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <Link
                href="/profile/settings"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary shadow-md transition-transform hover:scale-105"
                aria-label="Edit profile"
              >
                <MaterialSymbol name="edit" className="text-[18px]" />
              </Link>
            </div>
            <div className="mt-4">
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                {user.name}
              </h2>
              <p className="mt-1 flex items-center justify-center gap-1.5 font-body-md text-on-surface-variant">
                <MaterialSymbol name="domain" className="text-[18px] text-primary" />
                {user.company}
              </p>
            </div>
          </section>

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
                {user.processedPoCount} Purchase Orders
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
                {user.docCount} PDF Files
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
                  Manage photo, name, email, password, and address
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
                  Customer service and technical support
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
                  Privacy and data policy
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
