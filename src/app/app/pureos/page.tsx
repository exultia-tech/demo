import { redirect } from "next/navigation";

// Consolidated into Daedelus Builder Console (Container mode)
export default function PureOsRedirectPage() {
  redirect("/app/daedelus?mode=container");
}
