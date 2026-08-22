import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const migrations = await prisma.$queryRawUnsafe<
    { migration_name: string; finished_at: Date | null }[]
  >("SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY started_at");
  console.log(
    "MIGRATIONS:",
    migrations.map((m) => `${m.migration_name}|${m.finished_at ? "done" : "pending"}`).join(", ")
  );

  const tables = await prisma.$queryRawUnsafe<{ [k: string]: string }[]>("SHOW TABLES");
  console.log(
    "TABLES:",
    tables.map((t) => Object.values(t)[0]).join(", ")
  );

  const [user, admin, product, category, company, order, article, faq] = await Promise.all([
    prisma.user.count(),
    prisma.admin.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.company.count(),
    prisma.order.count(),
    prisma.article.count(),
    prisma.faq.count(),
  ]);
  console.log("COUNTS:", { user, admin, product, category, company, order, article, faq });

  // Sample column audit for key tables
  const productCols = await prisma.$queryRawUnsafe<{ Field: string; Type: string; Null: string; Key: string }[]>(
    "SHOW COLUMNS FROM Product"
  );
  console.log(
    "Product.columns:",
    productCols.map((c) => `${c.Field}:${c.Type}:${c.Null}:${c.Key}`).join(" | ")
  );

  const companyAddressCols = await prisma.$queryRawUnsafe<
    { Field: string; Type: string; Null: string; Key: string }[]
  >("SHOW COLUMNS FROM CompanyAddress");
  console.log(
    "CompanyAddress.columns:",
    companyAddressCols.map((c) => `${c.Field}:${c.Type}:${c.Null}:${c.Key}`).join(" | ")
  );

  const categoryCols = await prisma.$queryRawUnsafe<{ Field: string; Type: string; Null: string; Key: string }[]>(
    "SHOW COLUMNS FROM Category"
  );
  console.log(
    "Category.columns:",
    categoryCols.map((c) => `${c.Field}:${c.Type}:${c.Null}:${c.Key}`).join(" | ")
  );
}

main()
  .catch((e) => {
    console.error("AUDIT_ERROR", e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
