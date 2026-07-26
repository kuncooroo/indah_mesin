import type { Role } from "@prisma/client";

/** Role akun PIC / pembeli (bukan panel admin). */
export const buyerRoles: Role[] = ["BUYER", "PURCHASING", "APPROVER"];
