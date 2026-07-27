import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, Role, StockStatus, RfqStatus, VerificationStatus, CompanyType, OrderStatus, ArchiveDocumentType } from "@prisma/client";
import { MARKETPLACE_CATEGORIES, MARKETPLACE_PRODUCTS, MARKETPLACE_SKUS, MARKETPLACE_QUICK_FILTERS, catalogProductToSeedStatus, parseCatalogPriceIdr } from "../lib/marketplace-catalog";
import { stitchArticles } from "../lib/stitch-screens";
import { indahMesinContact } from "../lib/contact";
import { getProductDetailEnrichment } from "../lib/product-detail-enrichment";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is required for seeding");
}

const adapter = new PrismaMariaDb(url);
const prisma = new PrismaClient({ adapter });

const DEFAULT_PASSWORD = "Indah@2026";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
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
      role: Role.PURCHASING,
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
      role: Role.PURCHASING,
      verificationStatus: VerificationStatus.VERIFIED,
      companyName: "PT. Pangan Makmur Abadi",
      customBuyerId: "25030024",
      phone: indahMesinContact.phoneDisplay,
      companyAddress: "Jl. Industri Raya No. 45, Cikarang, Bekasi, Jawa Barat",
    },
  });

  const demoCompany =
    (await prisma.company.findFirst({
      where: { companyName: "PT. Pangan Makmur Abadi" },
    })) ??
    (await prisma.company.create({
      data: {
        companyName: "PT. Pangan Makmur Abadi",
        type: CompanyType.BUYER,
        npwpNumber: "01.234.567.8-901.000",
        nibNumber: "0123456789012345",
        isVerified: true,
      },
    }));

  const demoAddress =
    (await prisma.companyAddress.findFirst({
      where: { companyId: demoCompany.id, label: "Gudang Cikarang" },
    })) ??
    (await prisma.companyAddress.create({
      data: {
        companyId: demoCompany.id,
        label: "Gudang Cikarang",
        addressDetail: "Jl. Industri Raya No. 45, Cikarang",
        city: "Bekasi",
        postalCode: "17530",
        isPrimary: true,
      },
    }));

  await prisma.user.update({
    where: { id: demoUser.id },
    data: { companyId: demoCompany.id },
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

  const categorySlugs = MARKETPLACE_CATEGORIES.map((c) => c.id);

  for (const c of MARKETPLACE_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.id },
      create: { slug: c.id, name: c.name, icon: c.icon },
      update: { name: c.name, icon: c.icon },
    });
  }

  await prisma.product.deleteMany({
    where: { sku: { notIn: [...MARKETPLACE_SKUS] } },
  });

  await prisma.category.deleteMany({
    where: { slug: { notIn: categorySlugs } },
  });

  const categoryBySlug = new Map(
    (await prisma.category.findMany({ where: { slug: { in: categorySlugs } } })).map((c) => [
      c.slug,
      c.id,
    ])
  );

  for (const p of MARKETPLACE_PRODUCTS) {
    const categoryId = categoryBySlug.get(p.category);
    if (!categoryId) continue;

    const slug = p.id;
    const price = parseCatalogPriceIdr(p.priceLabel);
    const stockStatus = catalogProductToSeedStatus(p.status);
    const indentDays =
      p.status === "indent"
        ? p.sku === "IMS-CAN-LINE"
          ? 45
          : p.sku === "IMS-PROD-1000"
            ? 60
            : 21
        : null;

    const detail = getProductDetailEnrichment(p.sku);
    const featureTexts = detail?.features ?? p.features ?? [];
    const specRows = detail?.specs ?? p.specs ?? [];
    const galleryUrls = detail?.gallery?.length ? detail.gallery : p.image ? [p.image] : [];
    const brochureDoc = detail?.downloads.find((d) => d.icon === "picture_as_pdf");
    const sopDoc = detail?.downloads.find((d) => d.icon === "description");

    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      create: {
        sku: p.sku,
        name: p.name,
        slug,
        categoryId,
        stockStatus,
        indentDays,
        currency: "IDR",
        price,
        priceNote: p.priceNote ?? p.subtitle,
        brochureUrl: brochureDoc ? "/uploads/placeholder-brosur.pdf" : undefined,
        sopUrl: sopDoc ? "/uploads/placeholder-sop.pdf" : undefined,
        isPublished: true,
      },
      update: {
        name: p.name,
        slug,
        categoryId,
        stockStatus,
        indentDays,
        price,
        priceNote: p.priceNote ?? p.subtitle,
        brochureUrl: brochureDoc ? "/uploads/placeholder-brosur.pdf" : undefined,
        sopUrl: sopDoc ? "/uploads/placeholder-sop.pdf" : undefined,
        isPublished: true,
      },
    });

    await prisma.productMedia.deleteMany({ where: { productId: product.id } });
    if (galleryUrls.length) {
      await prisma.productMedia.createMany({
        data: galleryUrls.map((url, i) => ({
          productId: product.id,
          url,
          isPrimary: i === 0,
          sortOrder: i,
        })),
      });
    }

    await prisma.productFeature.deleteMany({ where: { productId: product.id } });
    if (featureTexts.length) {
      await prisma.productFeature.createMany({
        data: featureTexts.map((text, i) => ({
          productId: product.id,
          text,
          sortOrder: i,
        })),
      });
    }

    await prisma.productSpecification.deleteMany({ where: { productId: product.id } });
    if (specRows.length) {
      await prisma.productSpecification.createMany({
        data: specRows.map((s, i) => ({
          productId: product.id,
          attribute: s.label,
          value: s.value,
          sortOrder: i,
        })),
      });
    }

    if (detail?.downloads.length) {
      await prisma.productDocument.deleteMany({ where: { productId: product.id } });
      await prisma.productDocument.createMany({
        data: detail.downloads.map((d) => ({
          productId: product.id,
          title: d.title,
          subtitle: d.subtitle,
          fileUrl:
            d.icon === "picture_as_pdf" ? "/uploads/placeholder-brosur.pdf" : "/uploads/placeholder-sop.pdf",
        })),
      });
    }
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
  for (const { label } of MARKETPLACE_QUICK_FILTERS) {
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

  const defaultSavedSkus = ["FDP-RTR-500", "IMS-STEAM-200", "IMS-CAN-80"] as const;
  for (const sku of defaultSavedSkus) {
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

    const orderNumber = "PO-20260726-001";
    const existingOrder = await prisma.order.findUnique({ where: { orderNumber } });
    if (!existingOrder) {
      const price = Number(poProduct.price);
      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId: demoUser.id,
          companyId: demoCompany.id,
          status: OrderStatus.DRAFT,
          totalEstimatedPrice: price,
          shippingAddressId: demoAddress.id,
          notes: "Permintaan quotation retort — shipping Jakarta",
          items: {
            create: {
              productId: poProduct.id,
              quantity: 1,
              priceAtTime: price,
            },
          },
        },
      });

      await prisma.archiveDocument.create({
        data: {
          userId: demoUser.id,
          orderId: order.id,
          documentName: `Draf PO Batch #${orderNumber}.pdf`,
          documentType: ArchiveDocumentType.PO_DRAFT,
          fileUrl: "/stitch/po-a4.html",
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
