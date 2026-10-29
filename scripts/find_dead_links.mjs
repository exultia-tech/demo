import fs from "fs";
import path from "path";

function getRoutes(dir, baseDir = dir) {
  let routes = new Set();
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      for (const r of getRoutes(fullPath, baseDir)) routes.add(r);
    } else if (entry.name === "page.tsx") {
      let rel = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      let route = rel.replace(/\/page\.tsx$/, "");
      if (route === "page.tsx" || route === "") route = "/";
      else route = "/" + route;
      routes.add(route);
    }
  }
  return routes;
}

const appRoutes = getRoutes(path.resolve("src/app"));

// Add public static files as valid links
function getPublicFiles(dir, baseDir = dir) {
  let files = new Set();
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      for (const f of getPublicFiles(fullPath, baseDir)) files.add(f);
    } else {
      let rel = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      files.add("/" + rel);
    }
  }
  return files;
}

const publicFiles = getPublicFiles(path.resolve("public"));

function checkFiles(dir) {
  const deadLinks = [];
  const missingImages = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = checkFiles(fullPath);
      deadLinks.push(...sub.deadLinks);
      missingImages.push(...sub.missingImages);
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      const content = fs.readFileSync(fullPath, "utf8");
      // Check hrefs
      const regex = /href=["'](\/[^"'#?]+)/g;
      let m;
      while ((m = regex.exec(content)) !== null) {
        let link = m[1];
        if (link.startsWith("/_next") || link.startsWith("/api")) continue;
        if (publicFiles.has(link)) continue;
        let matched = appRoutes.has(link);
        if (!matched) {
          for (const r of appRoutes) {
            if (r.includes("[")) {
              const rRegex = new RegExp("^" + r.replace(/\[\w+\]/g, "[^/]+") + "$");
              if (rRegex.test(link)) { matched = true; break; }
            }
          }
        }
        if (!matched) {
          deadLinks.push({ file: path.relative(process.cwd(), fullPath).replace(/\\/g, "/"), link });
        }
      }

      // Check image src
      const imgRegex = /src=["'](\/[^"']+\.(?:png|jpg|jpeg|gif|svg|webp))["']/g;
      let imgMatch;
      while ((imgMatch = imgRegex.exec(content)) !== null) {
        let src = imgMatch[1];
        if (!publicFiles.has(src)) {
          missingImages.push({ file: path.relative(process.cwd(), fullPath).replace(/\\/g, "/"), src });
        }
      }
    }
  }
  return { deadLinks, missingImages };
}

const { deadLinks, missingImages } = checkFiles(path.resolve("src"));
console.log("Total potential dead links found in source:", deadLinks.length);
const unique = new Map();
for (const d of deadLinks) {
  if (!unique.has(d.link)) unique.set(d.link, []);
  unique.get(d.link).push(d.file);
}
for (const [l, files] of unique.entries()) {
  console.log(`- Link: ${l} (in ${[...new Set(files)].slice(0, 3).join(", ")})`);
}

console.log("\nTotal missing image assets:", missingImages.length);
const uniqueImgs = new Map();
for (const img of missingImages) {
  if (!uniqueImgs.has(img.src)) uniqueImgs.set(img.src, []);
  uniqueImgs.get(img.src).push(img.file);
}
for (const [src, files] of uniqueImgs.entries()) {
  console.log(`- Image: ${src} (in ${[...new Set(files)].slice(0, 3).join(", ")})`);
}
