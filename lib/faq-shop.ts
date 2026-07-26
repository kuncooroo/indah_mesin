import { prisma } from "@/lib/prisma";

export type ShopFaqItem = {
  question: string;
  answer: string;
};

const FALLBACK_FAQ: ShopFaqItem[] = [
  {
    question: "What is the standard lead time for indent orders?",
    answer:
      "Standard indent orders typically take between 4-8 weeks depending on the complexity of the machinery and customs clearance requirements. Our logistics team provides weekly updates.",
  },
  {
    question: "Do you offer on-site installation?",
    answer:
      "Yes, our technical team provides on-site installation and operator training for all heavy machinery purchases across industrial zones.",
  },
  {
    question: "Can I request a customized technical manual?",
    answer:
      "Custom manuals tailored to your specific plant configuration are available upon request through your account manager.",
  },
];

export async function listPublishedFaqs(): Promise<ShopFaqItem[]> {
  try {
    const rows = await prisma.faq.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((r) => ({ question: r.question, answer: r.answer }));
    }
  } catch {
    /* fallback */
  }
  return FALLBACK_FAQ;
}
