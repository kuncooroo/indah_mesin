import { Prisma } from "@prisma/client";
import { fail, type ActionResult } from "@/lib/action-result";

const UNIQUE_FIELD_MESSAGES: Record<string, { field: string; message: string }> = {
  sku: { field: "sku", message: "SKU sudah digunakan." },
  slug: { field: "slug", message: "Slug sudah digunakan." },
  email: { field: "email", message: "Email sudah digunakan." },
  username: { field: "username", message: "Username sudah digunakan." },
  orderNumber: { field: "orderNumber", message: "Nomor order sudah digunakan." },
  customBuyerId: { field: "customBuyerId", message: "Buyer ID sudah digunakan." },
  token: { field: "token", message: "Token sudah digunakan." },
  label: { field: "label", message: "Label sudah digunakan." },
  name: { field: "name", message: "Nama sudah digunakan." },
};

function uniqueTargetFields(error: Prisma.PrismaClientKnownRequestError): string[] {
  const target = error.meta?.target;
  if (Array.isArray(target)) return target.map(String);
  if (typeof target === "string") return [target];
  return [];
}

export function mapPrismaError(error: unknown, fallback = "Terjadi kesalahan. Coba lagi."): ActionResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const fields = uniqueTargetFields(error);
        const fieldErrors: Record<string, string> = {};
        let message = "Data dengan nilai unik yang sama sudah ada.";
        for (const raw of fields) {
          const key = raw.includes("_") ? raw.split("_").pop()! : raw;
          const mapped = UNIQUE_FIELD_MESSAGES[key] ?? UNIQUE_FIELD_MESSAGES[raw];
          if (mapped) {
            fieldErrors[mapped.field] = mapped.message;
            message = mapped.message;
          } else {
            fieldErrors[key] = `${key} sudah digunakan.`;
            message = fieldErrors[key];
          }
        }
        return fail(message, { errorCode: "P2002", fieldErrors });
      }
      case "P2025":
        return fail("Data tidak ditemukan.", { errorCode: "P2025" });
      case "P2003":
        return fail("Data tidak dapat dihapus karena masih digunakan oleh data lain.", {
          errorCode: "P2003",
        });
      case "P2014":
        return fail("Operasi ditolak karena masih ada relasi data terkait.", {
          errorCode: "P2014",
        });
      default:
        return fail(fallback, { errorCode: error.code });
    }
  }

  if (error instanceof Error) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return fail(error.message === "Forbidden" ? "Akses ditolak." : "Anda harus login sebagai admin.", {
        errorCode: error.message,
      });
    }
    return fail(error.message || fallback);
  }

  return fail(fallback);
}

export async function runAdminAction(
  fn: () => Promise<ActionResult | void>,
  successMessage: string
): Promise<ActionResult> {
  try {
    const result = await fn();
    if (result && typeof result === "object" && "success" in result) {
      return result;
    }
    return { success: true, message: successMessage };
  } catch (error) {
    return mapPrismaError(error);
  }
}
