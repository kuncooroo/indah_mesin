import { NextResponse } from "next/server";

import { listSavedSkusForShop, toggleSavedProductBySku } from "@/lib/storefront/catalog";

export async function GET() {
  const skus = await listSavedSkusForShop();
  return NextResponse.json({ skus });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { sku?: string };
    if (!body.sku) {
      return NextResponse.json({ error: "sku required" }, { status: 400 });
    }
    const result = await toggleSavedProductBySku(body.sku);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gagal menyimpan";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
