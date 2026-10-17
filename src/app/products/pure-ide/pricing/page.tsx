import { redirect } from "next/navigation";

export default function PureIdePricingRedirect() {
  redirect("/account/subscription?product=pureide");
}
