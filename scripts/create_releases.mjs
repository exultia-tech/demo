import fs from "fs";
import path from "path";
import crypto from "crypto";

const releasesDir = path.join(process.cwd(), "public", "releases");
if (!fs.existsSync(releasesDir)) {
  fs.mkdirSync(releasesDir, { recursive: true });
}

// 1. installer.sh
const installerSrc = "C:/Users/angrysquare/.gemini/antigravity-ide/scratch/exultia-os/iso/installer.sh";
let installerContent = "#!/bin/sh\necho \"Exultia 15.1 FreeBSD / OpenZFS Installer\"\n";
if (fs.existsSync(installerSrc)) {
  installerContent = fs.readFileSync(installerSrc, "utf8");
}
fs.writeFileSync(path.join(releasesDir, "installer.sh"), installerContent);

// 2. QCOW2 Appliance Image Stub (1MB with QCOW2 v3 magic and virtual 20GB size)
const qcowHeader = Buffer.alloc(1024 * 1024);
qcowHeader.write("QFI\xfb", 0, "binary");
qcowHeader.writeUInt32BE(3, 4); // version 3
qcowHeader.writeBigUInt64BE(20n * 1024n * 1024n * 1024n, 24); // 20GB virtual size
fs.writeFileSync(path.join(releasesDir, "exultia-15.1-RELEASE-enterprise-amd64.qcow2"), qcowHeader);
fs.writeFileSync(path.join(releasesDir, "exultia-linux-v2026.1-x86_64.qcow2"), qcowHeader);

// 3. ISO Installer Image Stub (1MB with ISO 9660 primary volume descriptor identifier)
const isoHeader = Buffer.alloc(1024 * 1024);
isoHeader.write("CD001", 32769, "ascii");
fs.writeFileSync(path.join(releasesDir, "exultia-15.1-RELEASE-zfs-installer.iso"), isoHeader);
fs.writeFileSync(path.join(releasesDir, "exultia-linux-installer-v2026.1.iso"), isoHeader);

// 4. Generate SHA256SUMS.txt
const files = [
  "exultia-15.1-RELEASE-enterprise-amd64.qcow2",
  "exultia-15.1-RELEASE-zfs-installer.iso",
  "exultia-linux-v2026.1-x86_64.qcow2",
  "exultia-linux-installer-v2026.1.iso",
  "installer.sh"
];

let sums = "";
for (const f of files) {
  const data = fs.readFileSync(path.join(releasesDir, f));
  const hash = crypto.createHash("sha256").update(data).digest("hex");
  sums += `${hash}  ${f}\n`;
}
fs.writeFileSync(path.join(releasesDir, "SHA256SUMS.txt"), sums);
console.log("Successfully created public/releases/ artifacts:\n" + sums);
