import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";
const HEADERS = {
  "x-operator-key": "exultia-preview-2026",
  "Cookie": "exultia_operator_key=exultia-preview-2026"
};

// 1. Gather all routes from src/app
function getRoutes(dir, baseDir = dir) {
  let routes = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      routes = routes.concat(getRoutes(fullPath, baseDir));
    } else if (entry.name === "page.tsx") {
      let rel = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      let route = rel.replace(/\/page\.tsx$/, "");
      if (route === "page.tsx" || route === "") route = "/";
      else route = "/" + route;
      routes.push(route);
    }
  }
  return routes;
}

const allAppRoutes = getRoutes(path.resolve("src/app"));
console.log(`Found ${allAppRoutes.length} route files in src/app.`);

async function audit() {
  const visited = new Set();
  const errors = [];
  const brokenLinks = [];
  const allFoundLinks = new Map(); // target -> [sources]

  // Test dynamic routes with mock param
  const routesToTest = allAppRoutes.map(r => {
    if (r.includes("[id]")) return r.replace("[id]", "CVE-2024-4577");
    return r;
  });

  for (const route of routesToTest) {
    try {
      const url = `${BASE_URL}${route}`;
      const res = await fetch(url, { headers: HEADERS });
      const status = res.status;
      const html = await res.text();

      if (status >= 400) {
        errors.push({ route, status, msg: `HTTP status ${status}` });
        console.log(`❌ ${route} -> ${status}`);
      } else {
        console.log(`✓ ${route} -> ${status}`);
      }

      // Check for Next.js error overlay or critical exceptions
      if (html.includes("Next.js Server Error") || html.includes("Application error: a client-side exception")) {
        errors.push({ route, status, msg: "Next.js server error / unhandled exception in HTML" });
      }

      // Extract hrefs
      const linkRegex = /href=["']([^"']+)["']/g;
      let match;
      while ((match = linkRegex.exec(html)) !== null) {
        const href = match[1];
        if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/_next") && !href.startsWith("/api")) {
          // Internal link
          const cleanHref = href.split("#")[0].split("?")[0] || "/";
          if (!allFoundLinks.has(cleanHref)) {
            allFoundLinks.set(cleanHref, []);
          }
          allFoundLinks.get(cleanHref).push(route);
        }
      }
    } catch (err) {
      errors.push({ route, status: 0, msg: err.message });
      console.log(`❌ ${route} -> FAILED: ${err.message}`);
    }
  }

  console.log(`\nVerifying ${allFoundLinks.size} unique discovered internal links...`);
  for (const [target, sources] of allFoundLinks.entries()) {
    try {
      const url = `${BASE_URL}${target}`;
      const res = await fetch(url, { headers: HEADERS });
      if (res.status === 404) {
        brokenLinks.push({ target, sources: [...new Set(sources)] });
        console.log(`🚨 404 DEAD LINK: ${target} (referenced in: ${[...new Set(sources)].slice(0, 3).join(", ")})`);
      } else if (res.status >= 400) {
        console.log(`⚠️ Status ${res.status}: ${target}`);
      }
    } catch (err) {
      brokenLinks.push({ target, sources: [...new Set(sources)], error: err.message });
    }
  }

  console.log("\n=== AUDIT SUMMARY ===");
  console.log(`Tested routes: ${routesToTest.length}`);
  console.log(`Route errors: ${errors.length}`);
  console.log(`Discovered internal links: ${allFoundLinks.size}`);
  console.log(`Broken / 404 internal links: ${brokenLinks.length}`);

  fs.writeFileSync("audit-report.json", JSON.stringify({ errors, brokenLinks }, null, 2));
}

audit();
