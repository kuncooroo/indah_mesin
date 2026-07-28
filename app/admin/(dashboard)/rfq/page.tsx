import { redirect } from "next/navigation";

export default function AdminRfqRedirect() {
  redirect("/admin/orders?view=legacy");
}
