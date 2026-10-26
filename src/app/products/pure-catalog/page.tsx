import { redirect } from "next/navigation";

export default function PureCatalogRedirectPage() {
  redirect("/products/daedelus?tab=catalog");
}
