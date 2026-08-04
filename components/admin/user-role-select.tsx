"use client";

import { useTransition } from "react";
import type { AdminRole } from "@prisma/client";
import { toast } from "sonner";
import { updateUserRole } from "@/lib/admin-actions";

const adminRoles: AdminRole[] = ["ADMIN", "SUPERADMIN"];

export function UserRoleSelect({
  userId,
  currentRole,
  disabled,
}: {
  userId: string;
  currentRole: AdminRole;
  disabled?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      disabled={disabled || pending}
      value={currentRole}
      onChange={(e) => {
        const role = e.target.value as AdminRole;
        startTransition(async () => {
          try {
            await updateUserRole(userId, role);
            toast.success("Role admin diperbarui");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Gagal memperbarui role");
          }
        });
      }}
      className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm disabled:opacity-50"
    >
      {adminRoles.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
}
