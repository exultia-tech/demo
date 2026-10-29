import { redirect } from "next/navigation";

// Consolidated into Daedelus Sovereign Developer Forge (Clean Packages)
export default function PureCatalogRedirectPage() {
  redirect("/products/daedelus?tab=packages");
}
