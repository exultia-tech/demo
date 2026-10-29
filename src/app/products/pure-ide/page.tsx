import { redirect } from "next/navigation";

// Consolidated into Daedelus Sovereign Developer Forge
export default function PureIdeRedirectPage() {
  redirect("/products/daedelus?tab=blueprints");
}
