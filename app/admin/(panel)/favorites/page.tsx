import { redirect } from "next/navigation";

export default function AdminFavoritesRedirect() {
  redirect("/admin/dashboard");
}
