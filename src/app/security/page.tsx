import { redirect } from "next/navigation";

export default function SecurityRedirectPage() {
  redirect("/products/pure-ide#security");
}
