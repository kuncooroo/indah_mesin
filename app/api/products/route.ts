import { NextResponse } from "next/server";
import { listPublishedProducts } from "@/lib/catalog";

export async function GET() {
  const products = await listPublishedProducts();
  return NextResponse.json(products);
}
