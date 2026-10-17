import { redirect } from "next/navigation";

export default function PraxisPricingRedirect() {
  redirect("/account/subscription?product=praxis");
}
