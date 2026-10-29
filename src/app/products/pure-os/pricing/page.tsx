import { redirect } from "next/navigation";

// Pricing included in main enterprise entitlement plan
export default function PureOsPricingRedirect() {
  redirect("/products/daedelus");
}
