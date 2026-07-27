"use client";



import Link from "next/link";

import { usePathname } from "next/navigation";

import { Ms } from "@/components/stitch/ms";

import { shopCanvasClassName, isPoCheckoutPath } from "@/lib/shop-layout-mode";

import { cn } from "@/lib/utils";



const navItems = [

  { href: "/beranda-artikel", label: "Home", icon: "home" as const },

  { href: "/categories", label: "Categories", icon: "category" as const },

  { href: "/favorites", label: "Saved", icon: "bookmark" as const },

  { href: "/contact", label: "Contact", icon: "chat_bubble" as const },

];



function BottomNavInner({ pathname }: { pathname: string }) {
  return (

    <>

      {navItems.map(({ href, label, icon }) => {

        const active =
          pathname === href ||
          pathname.startsWith(`${href}/`) ||
          (href === "/beranda-artikel" && pathname === "/home");



        return (

          <Link

            key={href}

            href={href}

            className={cn(

              "flex flex-col items-center justify-center transition-transform",

              active

                ? "scale-95 rounded-xl bg-secondary-container/20 px-3 py-1 text-primary"

                : "text-on-surface-variant transition-colors hover:text-primary active:scale-90"

            )}

          >

            <Ms name={icon} fill={active} />

            <span className="text-body-sm">{label}</span>

          </Link>

        );

      })}

    </>

  );

}



export function ShopBottomNav() {
  const pathname = usePathname();
  const canvasClass = shopCanvasClassName(pathname);
  if (isPoCheckoutPath(pathname)) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center">
      <nav
        className={cn(
          "pointer-events-auto flex h-16 w-full items-center justify-around border-t border-border-subtle bg-surface shadow-lg",
          canvasClass
        )}
      >
        <BottomNavInner pathname={pathname} />
      </nav>
    </div>
  );
}
