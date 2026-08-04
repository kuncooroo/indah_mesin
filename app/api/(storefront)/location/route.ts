import { NextResponse } from "next/server";

const WILAYAH_BASE = "https://www.emsifa.com/api-wilayah-indonesia/api";

type WilayahItem = { id: string; name: string };

async function fetchWilayah(path: string) {
  const response = await fetch(`${WILAYAH_BASE}/${path}`, {
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!response.ok) throw new Error("Gagal memuat data wilayah.");
  return (await response.json()) as WilayahItem[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level") ?? "provinces";
  const parentId = searchParams.get("parentId") ?? "";

  try {
    if (level === "provinces") {
      return NextResponse.json({ items: await fetchWilayah("provinces.json") });
    }
    if (level === "regencies" && parentId) {
      return NextResponse.json({
        items: await fetchWilayah(`regencies/${parentId}.json`),
      });
    }
    if (level === "districts" && parentId) {
      return NextResponse.json({
        items: await fetchWilayah(`districts/${parentId}.json`),
      });
    }
    if (level === "villages" && parentId) {
      return NextResponse.json({
        items: await fetchWilayah(`villages/${parentId}.json`),
      });
    }
    return NextResponse.json({ error: "Parameter wilayah tidak valid." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Layanan wilayah sedang tidak tersedia." }, { status: 502 });
  }
}
