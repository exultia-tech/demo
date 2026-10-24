import { redirect } from "next/navigation";

export default function ValkyriePricingRedirect() {
  redirect("/account/subscription?product=valkyrie");
}
