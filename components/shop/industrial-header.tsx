import Link from "next/link";

import { Ms } from "@/components/stitch/ms";



interface IndustrialHeaderProps {

  showAccount?: boolean;

}



/** Top App Bar — Stitch 752245e124a9439b82a70f682ba883b4 */

export function IndustrialHeader({ showAccount = true }: IndustrialHeaderProps) {

  return (

    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border-subtle bg-surface px-margin-mobile md:px-margin-desktop">

      <div className="flex items-center gap-4">

        <button

          type="button"

          className="text-primary transition-opacity active:opacity-80"

          aria-label="Menu"

        >

          <Ms name="menu" />

        </button>

        <h1 className="font-headline-md text-headline-md font-bold text-primary">

          IndustrialX

        </h1>

      </div>

      <div className="flex items-center gap-4">

        <button type="button" className="cursor-pointer text-primary" aria-label="Cari">

          <Ms name="search" />

        </button>

        {showAccount ? (

          <Link href="/profile" className="cursor-pointer text-primary" aria-label="Profil">

            <Ms name="account_circle" />

          </Link>

        ) : null}

      </div>

    </header>

  );

}

