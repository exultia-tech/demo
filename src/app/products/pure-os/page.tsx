import { redirect } from "next/navigation";

// Consolidated into Daedelus Sovereign Developer Forge
export default function PureOsRedirectPage() {
  redirect("/products/daedelus?tab=containers");
}
