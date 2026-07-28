import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  const rows = await prisma.archiveDocument.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({
    documents: rows.map((row) => ({
      id: row.id,
      name: row.documentName,
      category: row.documentType === "PO_DRAFT" ? "po" : "brochure",
      sizeLabel: "PDF",
      dateLabel: new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(row.createdAt),
      icon: row.documentType === "PO_DRAFT" ? "description" : "menu_book",
      iconBg: row.documentType === "PO_DRAFT" ? "bg-primary-fixed" : "bg-secondary-container",
      iconColor: row.documentType === "PO_DRAFT" ? "text-primary" : "text-on-secondary-container",
      fileUrl: row.fileUrl,
    })),
  });
}
