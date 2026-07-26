import { redirect } from "next/navigation";

/** PIC pengguna dikelola di detail perusahaan. */
export default function AdminCustomersRedirect() {
  redirect("/admin/companies");
}
