import { redirect } from "next/navigation";

export default function SecurityRedirectPage() {
  redirect("/features#security");
}
