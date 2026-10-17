import { redirect } from "next/navigation";

export default function PureOsPricingRedirect() {
  redirect("/account/subscription?product=pureos");
}
