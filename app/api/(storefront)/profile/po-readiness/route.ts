import { NextResponse } from "next/server";

import { getStorefrontSession } from "@/lib/auth";
import { getPoBuyerContext } from "@/lib/storefront/po-buyer-context";

export async function GET() {
  const session = await getStorefrontSession();
  if (!session?.user?.id) {
    return NextResponse.json(
      {
        authenticated: false,
        ready: false,
        missingFields: ["login"],
        completionPath: "/profile",
        message: "Silakan login atau daftar untuk membuat Purchase Order.",
      },
      { status: 401 }
    );
  }

  const buyer = await getPoBuyerContext(session.user.id);
  if (!buyer) {
    return NextResponse.json(
      {
        authenticated: true,
        ready: false,
        missingFields: ["akun pembeli"],
        completionPath: "/profile",
        message: "Akun ini tidak dapat membuat Purchase Order.",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    ready: buyer.poReady,
    missingFields: buyer.missingFields,
    completionPath: buyer.completionPath,
    message: buyer.poReady
      ? "Data siap untuk membuat Purchase Order."
      : `Lengkapi ${buyer.missingFields.join(", ")} sebelum membuat Purchase Order.`,
  });
}
