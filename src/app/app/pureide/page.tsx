import { redirect } from "next/navigation";
export { IDE_ENGINES, generateStackBlueprintName } from "../daedelus/IdeConsoleView";
export type { IdeEngine, IdeEngineMeta } from "../daedelus/IdeConsoleView";

// Consolidated into Daedelus Builder Console (IDE mode)
export default function PureIdeRedirectPage() {
  redirect("/app/daedelus?mode=ide");
}
