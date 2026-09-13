import { redirect } from "next/navigation";

export default function SecureIdeRedirect() {
  redirect("/products/pure-ide");
}
