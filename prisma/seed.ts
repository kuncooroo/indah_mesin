import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, Role, StockStatus, RfqStatus, VerificationStatus } from "@prisma/client";
import { products, type ProductStatus } from "../lib/products";
import { stitchArticles, berandaMainCategories, stitchSavedSkus } from "../lib/stitch-screens";
import { mainCategories, filterCategories, quickFilters } from "../lib/categories";
import { indahMesinContact } from "../lib/contact";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is required for seeding");
}

const adapter = new PrismaMariaDb(url);
const prisma = new PrismaClient({ adapter });

const DEFAULT_PASSWORD = "Indah@2026";

function toStockStatus(status: ProductStatus): StockStatus {
  switch (status) {
    case "indent":
      return StockStatus.INDENT;
    case "contact":
      return StockStatus.OUT_OF_STOCK;
    default:
      return StockStatus.READY_STOCK;
  }
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function parsePriceLabel(label: string): number {
  const digits = label.replace(/[^\d]/g, "");
  return parseInt(digits, 10) || 0;
}

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const demoUser = await prisma.user.upsert({
    where: { email: "user@indahmesin.com" },
    create: {
      username: "user",
      name: "Budi Santoso",
      email: "user@indahmesin.com",
      password: passwordHash,
      role: Role.BUYER,
      verificationStatus: VerificationStatus.VERIFIED,
      companyName: "PT. Pangan Makmur Abadi",
      customBuyerId: "25030024",
      phone: indahMesinContact.phoneDisplay,
      companyAddress: "Jl. Industri Raya No. 45, Cikarang, Bekasi, Jawa Barat",
    },
    update: {
      username: "user",
      name: "Budi Santoso",
      password: passwordHash,
      role: Role.BUYER,
      verificationStatus: VerificationStatus.VERIFIED,
      companyName: "PT. Pangan Makmur Abadi",
      customBuyerId: "25030024",
      phone: indahMesinContact.phoneDisplay,
      companyAddress: "Jl. Industri Raya No. 45, Cikarang, Bekasi, Jawa Barat",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@indahmesin.com" },
    create: {
      username: "admin",
      name: "Admin Indah Mesin",
      email: "admin@indahmesin.com",
      password: passwordHash,
      role: Role.ADMIN,
    },
    update: {
      username: "admin",
      name: "Admin Indah Mesin",
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "superadmin@indahmesin.com" },
    create: {
      username: "superadmin",
      name: "Super Admin",
      email: "superadmin@indahmesin.com",
      password: passwordHash,
      role: Role.SUPERADMIN,
    },
    update: {
      username: "superadmin",
      name: "Super Admin",
      password: passwordHash,
      role: Role.SUPERADMIN,
    },
  });

  const categoryDefs = new Map<string, { name: string; icon: string }>();
  for (const c of [...mainCategories, ...filterCategories, ...berandaMainCategories]) {
    if (!categoryDefs.has(c.id)) {
      categoryDefs.set(c.id, { name: c.name, icon: c.icon });
    }
  }

  for (const [slug, meta] of categoryDefs) {
    await prisma.category.upsert({
      where: { slug },
      create: { slug, name: meta.name, icon: meta.icon },
      update: { name: meta.name, icon: meta.icon },
    });
  }

  const categoryBySlug = new Map(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  for (const p of products) {
    const categoryId = categoryBySlug.get(p.category);
    if (!categoryId) continue;

    const slug = slugify(p.name);
    const price = parsePriceLabel(p.priceLabel);

    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      create: {
        sku: p.sku,
        name: p.name,
        slug,
        categoryId,
        stockStatus: toStockStatus(p.status),
        currency: "IDR",
        price,
        priceNote: p.priceNote ?? p.subtitle,
        isPublished: true,
      },
      update: {
        name: p.name,
        slug,
        categoryId,
        stockStatus: toStockStatus(p.status),
        price,
        priceNote: p.priceNote ?? p.subtitle,
        isPublished: true,
      },
    });

    await prisma.productMedia.deleteMany({ where: { productId: product.id } });
    if (p.image) {
      await prisma.productMedia.create({
        data: {
          productId: product.id,
          url: p.image,
          isPrimary: true,
          sortOrder: 0,
        },
      });
      if (p.gallery?.length) {
        let order = 1;
        for (const url of p.gallery) {
          await prisma.productMedia.create({
            data: { productId: product.id, url, isPrimary: false, sortOrder: order++ },
          });
        }
      }
    }

    await prisma.productFeature.deleteMany({ where: { productId: product.id } });
    if (p.features?.length) {
      await prisma.productFeature.createMany({
        data: p.features.map((text, i) => ({
          productId: product.id,
          text,
          sortOrder: i,
        })),
      });
    }

    await prisma.productSpecification.deleteMany({ where: { productId: product.id } });
    if (p.specs?.length) {
      await prisma.productSpecification.createMany({
        data: p.specs.map((s, i) => ({
          productId: product.id,
          attribute: s.label,
          value: s.value,
          sortOrder: i,
        })),
      });
    }
  }

  const retort = await prisma.product.findUnique({ where: { sku: "FDP-RTR-500" } });
  if (retort) {
    await prisma.productDocument.deleteMany({ where: { productId: retort.id } });
    await prisma.productDocument.createMany({
      data: [
        {
          productId: retort.id,
          title: "Brosur Retort-Sterilizer.pdf",
          subtitle: "Download Brochure",
          fileUrl: "/uploads/placeholder-brosur.pdf",
        },
        {
          productId: retort.id,
          title: "SOP-Operasional-Retort.pdf",
          subtitle: "Technical Manual",
          fileUrl: "/uploads/placeholder-sop.pdf",
        },
      ],
    });
  }

  for (const a of stitchArticles) {
    const slug = slugify(a.title);
    const readMinutes = parseInt(a.readTime, 10) || 5;
    await prisma.article.upsert({
      where: { slug },
      create: {
        slug,
        category: a.category,
        title: a.title,
        imageUrl: a.image,
        publishedAt: new Date("2023-10-12"),
        readMinutes,
        published: true,
      },
      update: {
        category: a.category,
        title: a.title,
        imageUrl: a.image,
        readMinutes,
        published: true,
      },
    });
  }

  let order = 0;
  for (const label of quickFilters) {
    await prisma.quickFilter.upsert({
      where: { label },
      create: { label, sortOrder: order++, active: true },
      update: { sortOrder: order - 1, active: true },
    });
  }

  await prisma.siteSetting.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      brandName: indahMesinContact.brandName,
      phoneDisplay: indahMesinContact.phoneDisplay,
      phoneTel: indahMesinContact.phoneTel,
      email: indahMesinContact.email,
      salesEmail: indahMesinContact.salesEmail,
      hoursWeekdayLabel: indahMesinContact.hours.weekday.label,
      hoursWeekdayValue: indahMesinContact.hours.weekday.value,
      hoursSaturdayLabel: indahMesinContact.hours.saturday.label,
      hoursSaturdayValue: indahMesinContact.hours.saturday.value,
      hoursSundayLabel: indahMesinContact.hours.sunday.label,
      hoursSundayValue: indahMesinContact.hours.sunday.value,
      headOfficeTitle: indahMesinContact.headOffice.title,
      headOfficeLines: indahMesinContact.headOffice.lines,
      showroomTitle: indahMesinContact.showroom.title,
      showroomLines: indahMesinContact.showroom.lines,
    },
    update: {
      brandName: indahMesinContact.brandName,
      phoneDisplay: indahMesinContact.phoneDisplay,
      phoneTel: indahMesinContact.phoneTel,
      email: indahMesinContact.email,
      salesEmail: indahMesinContact.salesEmail,
      hoursWeekdayLabel: indahMesinContact.hours.weekday.label,
      hoursWeekdayValue: indahMesinContact.hours.weekday.value,
      hoursSaturdayLabel: indahMesinContact.hours.saturday.label,
      hoursSaturdayValue: indahMesinContact.hours.saturday.value,
      hoursSundayLabel: indahMesinContact.hours.sunday.label,
      hoursSundayValue: indahMesinContact.hours.sunday.value,
      headOfficeTitle: indahMesinContact.headOffice.title,
      headOfficeLines: indahMesinContact.headOffice.lines,
      showroomTitle: indahMesinContact.showroom.title,
      showroomLines: indahMesinContact.showroom.lines,
    },
  });

  for (const sku of stitchSavedSkus) {
    const product = await prisma.product.findUnique({ where: { sku } });
    if (!product) continue;
    await prisma.savedItem.upsert({
      where: {
        userId_productId: { userId: demoUser.id, productId: product.id },
      },
      create: { userId: demoUser.id, productId: product.id },
      update: {},
    });
  }

  const poProduct = await prisma.product.findUnique({ where: { sku: "FDP-RTR-500" } });
  if (poProduct) {
    const rfqNumber = "RFQ-202607-0001";
    const existing = await prisma.rfqRequest.findUnique({ where: { rfqNumber } });
    if (!existing) {
      const price = Number(poProduct.price);
      await prisma.rfqRequest.create({
        data: {
          rfqNumber,
          userId: demoUser.id,
          status: RfqStatus.PENDING,
          picName: demoUser.name,
          companyName: demoUser.companyName ?? "PT. Pangan Makmur Abadi",
          phoneNumber: demoUser.phone ?? indahMesinContact.phoneDisplay,
          companyAddress: demoUser.companyAddress ?? "",
          totalEstimated: price,
          items: {
            create: {
              productId: poProduct.id,
              productName: poProduct.name,
              productSku: poProduct.sku,
              quantity: 1,
              variant: "380V / 3 Phase",
              price,
            },
          },
        },
      });
    }
  }

  console.log("Seed selesai.");
  console.log(`Users: user / admin / superadmin — password: ${DEFAULT_PASSWORD}`);
  console.log(`Admin: http://localhost:3000/admin/login → /admin/dashboard`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
