import { redirect } from "next/navigation";

/** Alamat PT dikelola di detail perusahaan. */
export default function AdminCompanyAddressesRedirect() {
  redirect("/admin/companies");
}
