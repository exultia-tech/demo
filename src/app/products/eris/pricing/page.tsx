import { redirect } from "next/navigation";

export default function ErisPricingRedirect() {
  redirect("/account/subscription?product=eris");
}
