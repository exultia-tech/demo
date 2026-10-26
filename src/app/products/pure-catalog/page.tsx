import { Metadata } from "next";
import PureCatalogClientView from "./PureCatalogClientView";

export const metadata: Metadata = {
  title: "Pure Package Catalog | Zero Disclosed Vulnerabilities Guaranteed",
  description: "The world's first negative-admission package registry. Only packages with zero disclosed CVEs across 110+ registries are permitted for install.",
  openGraph: {
    title: "Pure Package Catalog | Zero Disclosed Vulnerabilities Guaranteed",
    description: "The world's first negative-admission package registry. Only packages with zero disclosed CVEs across 110+ registries are permitted for install.",
    url: "https://exultia.tech/products/pure-catalog",
    siteName: "Exultia",
    images: [{ url: "/branding/navbar_helm_cyan.png", width: 528, height: 604 }],
  }
};

export default function PureCatalogPage() {
  return <PureCatalogClientView />;
}
