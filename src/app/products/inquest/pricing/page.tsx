import { redirect } from "next/navigation";

export default function InquestPricingRedirect() {
  redirect("/account/subscription?product=inquest");
}
