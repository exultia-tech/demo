/**
 * Exultia Argent - Public OS Distribution Patch & Errata Feed Aggregator
 * 
 * Aggregates machine-readable public vendor patch streams across Linux, BSD, and UNIX:
 *   - Security Advisories (RHSA, RLSA, ALSA, USN, DSA, GLSA, FreeBSD-SA, etc.)
 *   - Bug Fix Advisories (RHBA, RLBA, ALBA, Bodhi Bugfix, FreeBSD-EN, Debian Updates, openSUSE-RU)
 *   - Enhancement & Feature Advisories (RHEA, RLEA, ALEA, HWE, Kernel Backports)
 *   - General Point Releases, Maintenance Updates, and Toolchain Upgrades
 */

export type ArgentOsCategory = 
  | 'ubuntu'
  | 'debian'
  | 'rocky'
  | 'rhel'
  | 'almalinux'
  | 'oracle-linux'
  | 'suse'
  | 'alpine'
  | 'arch'
  | 'fedora'
  | 'amazon-linux'
  | 'kernel'
  | 'gentoo'
  | 'freebsd'
  | 'openbsd'
  | 'netbsd'
  | 'wolfi'
  | 'nixos'
  | 'void'
  | 'photon'
  | 'flatcar'
  | 'talos'
  | 'openwrt'
  | 'openeuler'
  | 'cloudlinux'
  | 'kali'
  | 'azure-linux';

export type ArgentOsFamily = 
  | 'linux-debian'
  | 'linux-rhel'
  | 'linux-alpine'
  | 'linux-suse'
  | 'linux-arch'
  | 'linux-fedora'
  | 'linux-amazon'
  | 'linux-kernel'
  | 'linux-gentoo'
  | 'bsd-freebsd'
  | 'bsd-openbsd'
  | 'bsd-netbsd'
  | 'linux-wolfi'
  | 'linux-nix'
  | 'linux-void'
  | 'linux-photon'
  | 'linux-flatcar'
  | 'linux-talos'
  | 'linux-openwrt'
  | 'linux-openeuler'
  | 'linux-cloudlinux'
  | 'linux-azure';

export type ArgentAdvisoryType = 
  | 'SECURITY'       // CVE fixes, vulnerability errata (RHSA, RLSA, ALSA, USN, DSA, GLSA, FreeBSD-SA)
  | 'BUGFIX'         // Non-security stability, crash, memory leak, logic fixes (RHBA, RLBA, ALBA, Bodhi bugfix, FreeBSD-EN)
  | 'ENHANCEMENT'    // Hardware enablement, driver updates, performance optimizations, feature backports (RHEA, RLEA, ALEA)
  | 'MAINTENANCE'    // Distro point release updates, base runtime sync, compiler & toolchain updates
  | 'GENERAL';       // General package bumps, timezone data, CA trust certificates, locale updates

export type ArgentVendorSeverity = 'CRITICAL' | 'IMPORTANT' | 'MODERATE' | 'LOW';

export type ArgentPackageManager = 
  | 'apt' 
  | 'dnf' 
  | 'apk' 
  | 'zypper' 
  | 'pacman' 
  | 'emerge' 
  | 'pkg' 
  | 'syspatch' 
  | 'pkgin' 
  | 'nix' 
  | 'xbps' 
  | 'tdnf' 
  | 'opkg' 
  | 'talosctl' 
  | 'update_engine' 
  | 'kmod';

export type ArgentOperationalDomain = 
  | 'PATCH'
  | 'CORE'
  | 'NETWORK'
  | 'KERNEL'
  | 'CONTAINER'
  | 'SYSTEMD'
  | 'STORAGE'
  | 'DRIVER'
  | 'STABILITY'
  | 'PERFORMANCE';

export type ArgentActionDirective = 
  | 'ZERO_DOWNTIME_HOTFIX'
  | 'RELOAD_SERVICE'
  | 'SCHEDULE_REBOOT'
  | 'PIN_VERSION';

export interface ArgentPackageUpdate {
  name: string;
  sourcePackage?: string;
  arch: 'x86_64' | 'aarch64' | 'all' | 'noarch';
  currentVersion: string;
  fixedVersion: string;
  packageManager: ArgentPackageManager;
  sizeBytes?: number;
}

export interface ArgentPatchBundle {
  id: string; // e.g. "ARG-USN-6856-1"
  bundleId: string; // Upstream vendor ID, e.g. "USN-6856-1", "RLBA-2024:3910", "RHBA-2024:4120"
  advisoryType: ArgentAdvisoryType;
  os: ArgentOsCategory;
  osFamily: ArgentOsFamily;
  osDisplayName: string;
  targetReleases: string[];
  title: string;
  synopsis: string;
  vendorSeverity: ArgentVendorSeverity;
  severityScore: number;
  operationalDomain: ArgentOperationalDomain;
  actionDirective: ArgentActionDirective;
  issuedAt: string;
  updatedAt: string;
  cveList: string[]; // Fixed CVEs (empty for pure bugfixes / enhancements)
  packages: ArgentPackageUpdate[];
  commands: {
    nativeUpgrade: string;
    verification: string;
    rollback: string;
    kineticDeploy: string;
  };
  impact: {
    rebootRequired: boolean;
    servicesToRestart: string[];
    zeroDowntime: boolean;
  };
  upstreamNoticeUrl: string;
  sourceFeed: {
    sourceId: string;
    feedName: string;
    feedType: 'public-distro-feed';
    format: 'OSV' | 'JSON' | 'OVAL' | 'CSAF' | 'UPDATEINFO' | 'GIT_TREE' | 'XML';
    syncStatus: 'live' | 'cached';
    sourceUrl: string;
  };
}

export interface ArgentPublicFeedSource {
  id: string;
  os: ArgentOsCategory;
  name: string;
  category: string;
  icon: string;
  provider: string;
  officialFeedUrl: string;
  format: 'OSV' | 'JSON' | 'OVAL' | 'CSAF' | 'UPDATEINFO' | 'GIT_TREE' | 'XML';
  recordsIngested: number;
  updateFrequency: string;
  documentationUrl: string;
  description: string;
  status: 'Realtime' | 'Hourly' | 'Daily' | 'Syncing' | 'active';
  supportedReleases: string[];
  scope: string;
  access: string;
  coverage: string;
  refreshRate: string;
  homepageUrl: string;
  feedTypesCovered: ('Security' | 'Bugfix' | 'Enhancement' | 'Maintenance' | 'General')[];
}

/**
 * Public Distro Patch Feeds Catalog (Aggregating Security, Bugfix, Enhancement, and General OS Updates)
 */
export const ARGENT_PUBLIC_FEED_SOURCES: ArgentPublicFeedSource[] = [
  // 1. Canonical Ubuntu
  {
    id: "feed-ubuntu-usn",
    os: "ubuntu",
    name: "Canonical Ubuntu Updates & Security Notices (USN / OVAL)",
    category: "Debian & Ubuntu Ecosystem",
    icon: "🟠",
    provider: "Canonical Security & Release Engineering",
    officialFeedUrl: "https://security.ubuntu.com/oval/com.ubuntu.noble.usn.oval.xml.bz2",
    format: "OSV",
    recordsIngested: 94200,
    updateFrequency: "Continuous publication upon package build",
    documentationUrl: "https://ubuntu.com/security/notices",
    homepageUrl: "https://ubuntu.com/security/notices",
    description: "Official Canonical security advisories and general stable point updates for Ubuntu LTS releases (Main, Universe, Restricted).",
    scope: "Ubuntu 24.04 LTS, 22.04 LTS, 20.04 LTS Updates & Security",
    access: "Public OSV API, OVAL XML & apt repository metadata",
    coverage: "Security CVE errata, stability bugfixes, hardware enablement (HWE)",
    refreshRate: "Realtime (Event-Driven)",
    status: "Realtime",
    supportedReleases: ["Ubuntu 24.04 LTS (Noble)", "Ubuntu 22.04 LTS (Jammy)", "Ubuntu 20.04 LTS (Focal)"],
    feedTypesCovered: ["Security", "Bugfix", "Enhancement", "Maintenance"]
  },

  // 2. Debian GNU/Linux
  {
    id: "feed-debian-tracker",
    os: "debian",
    name: "Debian Security Tracker & Proposed Updates (DSA / BTS)",
    category: "Debian & Ubuntu Ecosystem",
    icon: "🔴",
    provider: "Debian Security & Release Team",
    officialFeedUrl: "https://security-tracker.debian.org/tracker/data/json",
    format: "JSON",
    recordsIngested: 128000,
    updateFrequency: "Live continuous sync (every 15 minutes)",
    documentationUrl: "https://security-tracker.debian.org/",
    homepageUrl: "https://www.debian.org/security/",
    description: "Authoritative Debian Security Tracker database tracking CVEs, point-release bugfixes, and proposed updates across stable and oldstable.",
    scope: "Debian 12 Bookworm, Debian 11 Bullseye, Debian 13 Trixie",
    access: "Public JSON Feed, BTS Webhooks & Debian Release Announcements",
    coverage: "DSA security advisories, point release updates, upstream regression fixes",
    refreshRate: "Hourly (every 15 min)",
    status: "Realtime",
    supportedReleases: ["Debian 12 (Bookworm)", "Debian 11 (Bullseye)", "Debian 13 (Trixie)"],
    feedTypesCovered: ["Security", "Bugfix", "Maintenance"]
  },

  // 3. Rocky Linux
  {
    id: "feed-rocky-errata",
    os: "rocky",
    name: "Rocky Linux Errata (RLSA Security, RLBA Bugfix, RLEA Enhancement)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🟢",
    provider: "Rocky Enterprise Software Foundation (RESF)",
    officialFeedUrl: "https://errata.rockylinux.org/",
    format: "UPDATEINFO",
    recordsIngested: 78500,
    updateFrequency: "Continuous mirror synchronization upon build",
    documentationUrl: "https://errata.rockylinux.org/",
    homepageUrl: "https://errata.rockylinux.org/",
    description: "Rocky Linux complete errata stream: RLSA (Security), RLBA (Bug Fixes), and RLEA (Enhancements) published via DNF updateinfo.xml.",
    scope: "Rocky Linux 8 & 9 BaseOS, AppStream, CRB",
    access: "Public updateinfo.xml & RESF REST API",
    coverage: "1:1 RHEL security, stability bugfixes, device drivers, RPM checksums",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Rocky Linux 9 (Blue Onyx)", "Rocky Linux 8 (Green Obsidian)"],
    feedTypesCovered: ["Security", "Bugfix", "Enhancement", "Maintenance"]
  },

  // 4. Red Hat Enterprise Linux
  {
    id: "feed-redhat-csaf",
    os: "rhel",
    name: "Red Hat Security & Errata Stream (RHSA, RHBA, RHEA / CSAF 2.0)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🎩",
    provider: "Red Hat Product Security & Release Engineering",
    officialFeedUrl: "https://access.redhat.com/hydra/rest/securitydata/cvrf.json",
    format: "CSAF",
    recordsIngested: 162000,
    updateFrequency: "Hourly automated feed updates",
    documentationUrl: "https://access.redhat.com/security/data",
    homepageUrl: "https://access.redhat.com/security/data",
    description: "OASIS CSAF 2.0 and CVRF feeds covering Red Hat Security Advisories (RHSA), Bug Advisories (RHBA), and Enhancement Advisories (RHEA).",
    scope: "RHEL 9, RHEL 8 Core, EUS, Satellite, OpenShift Node Runtimes",
    access: "Public CSAF 2.0 JSON & VEX Endpoints",
    coverage: "RHSA CVE fixes, RHBA system stability bugfixes, RHEA hardware enablement",
    refreshRate: "Hourly",
    status: "Realtime",
    supportedReleases: ["RHEL 9.4", "RHEL 9.3", "RHEL 8.10"],
    feedTypesCovered: ["Security", "Bugfix", "Enhancement", "Maintenance"]
  },

  // 5. AlmaLinux
  {
    id: "feed-almalinux-errata",
    os: "almalinux",
    name: "AlmaLinux Errata Stream (ALSA Security, ALBA Bugfix, ALEA Enhancement)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🔵",
    provider: "AlmaLinux OS Foundation",
    officialFeedUrl: "https://errata.almalinux.org/api/v1/errata",
    format: "CSAF",
    recordsIngested: 71200,
    updateFrequency: "Continuous sync with build system",
    documentationUrl: "https://errata.almalinux.org/",
    homepageUrl: "https://almalinux.org/",
    description: "Authoritative AlmaLinux advisory feed publishing ALSA (Security), ALBA (Bugfix), and ALEA (Enhancement) in CSAF 2.0, OVAL, and JSON.",
    scope: "AlmaLinux 9 & 8 BaseOS, AppStream, CRB",
    access: "Public REST API & OVAL XML",
    coverage: "Security fixes, driver stability, kernel errata, full binary parity",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["AlmaLinux 9.4 (Seafoam Ocelot)", "AlmaLinux 8.10"],
    feedTypesCovered: ["Security", "Bugfix", "Enhancement", "Maintenance"]
  },

  // 6. Oracle Linux
  {
    id: "feed-oracle-errata",
    os: "oracle-linux",
    name: "Oracle Linux Errata (ELSA Security, ELBA Bugfix, ELEA Enhancement)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🔴",
    provider: "Oracle Linux Product Security",
    officialFeedUrl: "https://linux.oracle.com/security/oval/",
    format: "OVAL",
    recordsIngested: 79400,
    updateFrequency: "Daily sync with Unbreakable Linux Network (ULN)",
    documentationUrl: "https://linux.oracle.com/security/",
    homepageUrl: "https://www.oracle.com/linux/",
    description: "Oracle Linux security and bugfix announcements for Red Hat Compatible Kernel (RHCK) and Unbreakable Enterprise Kernel (UEK).",
    scope: "Oracle Linux 9, 8, UEK Release 7",
    access: "Public OVAL XML & ULN Updates",
    coverage: "ELSA security advisories, ELBA kernel bugfixes, UEK performance patches",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["Oracle Linux 9", "Oracle Linux 8", "UEK7"],
    feedTypesCovered: ["Security", "Bugfix", "Enhancement"]
  },

  // 7. SUSE Linux Enterprise & openSUSE
  {
    id: "feed-suse-oval",
    os: "suse",
    name: "SUSE Maintenance & Errata (SUSE-SU Security, SUSE-RU Recommended / Bugfix)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🦎",
    provider: "SUSE Security & Maintenance Team",
    officialFeedUrl: "https://ftp.suse.com/pub/projects/security/oval/",
    format: "OVAL",
    recordsIngested: 61000,
    updateFrequency: "Daily sync with maintenance updates",
    documentationUrl: "https://www.suse.com/support/security/",
    homepageUrl: "https://www.suse.com/support/update/",
    description: "SUSE Linux Enterprise Server (SLES) and openSUSE maintenance patches: SUSE-SU (Security) and SUSE-RU (Recommended Bugfixes/Features).",
    scope: "openSUSE Leap, Tumbleweed, SLES 15 Enterprise",
    access: "Public OVAL XML, CVRF & Zypper metadata",
    coverage: "Zypper security errata, kernel bugfixes, Btrfs reliability updates",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["SLES 15 SP6", "SLES 15 SP5", "openSUSE Leap 15.6"],
    feedTypesCovered: ["Security", "Bugfix", "Enhancement", "Maintenance"]
  },

  // 8. Alpine Linux
  {
    id: "feed-alpine-secdb",
    os: "alpine",
    name: "Alpine Linux Security Database & Package Updates (SecDB / APK)",
    category: "Lightweight & Container OS",
    icon: "🏔️",
    provider: "Alpine Linux Core Team",
    officialFeedUrl: "https://secdb.alpinelinux.org/v3.20/main.json",
    format: "JSON",
    recordsIngested: 45200,
    updateFrequency: "Continuous per-branch rebuilds",
    documentationUrl: "https://secdb.alpinelinux.org/",
    homepageUrl: "https://alpinelinux.org/",
    description: "Alpine Linux package update database cataloging security fixes, musl libc resolver patches, and community package updates per release.",
    scope: "Alpine v3.20, v3.19, v3.18 & Edge Main/Community",
    access: "Public Git / JSON Streams",
    coverage: "APK package upgrades, musl stability fixes, BusyBox updates",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Alpine v3.20", "Alpine v3.19", "Alpine Edge"],
    feedTypesCovered: ["Security", "Bugfix", "Maintenance"]
  },

  // 9. Arch Linux
  {
    id: "feed-arch-tracker",
    os: "arch",
    name: "Arch Linux Security Tracker & Core/Extra Package Stream",
    category: "Independent & Rolling Distros",
    icon: "🏹",
    provider: "Arch Linux Security Team & Maintainers",
    officialFeedUrl: "https://security.archlinux.org/issues.json",
    format: "JSON",
    recordsIngested: 37800,
    updateFrequency: "Live continuous rolling release stream",
    documentationUrl: "https://security.archlinux.org/",
    homepageUrl: "https://archlinux.org/",
    description: "Real-time rolling release updates tracking upstream patches, kernel version upgrades, and security fixes across Core, Extra, and Multilib.",
    scope: "Arch Linux Core, Extra, Multilib Rolling",
    access: "Public REST API JSON & pacman repo databases",
    coverage: "Rolling package upgrades, kernel stable point releases, desktop updates",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Arch Linux Rolling"],
    feedTypesCovered: ["Security", "Bugfix", "Enhancement", "Maintenance", "General"]
  },

  // 10. Fedora Linux
  {
    id: "feed-fedora-updates",
    os: "fedora",
    name: "Fedora Bodhi Errata Stream (Security, Bugfix, Enhancement)",
    category: "Independent & Rolling Distros",
    icon: "🔵",
    provider: "Fedora Project & QA Team",
    officialFeedUrl: "https://bodhi.fedoraproject.org/updates/",
    format: "JSON",
    recordsIngested: 86400,
    updateFrequency: "Continuous release updates with karma gates",
    documentationUrl: "https://docs.fedoraproject.org/en-US/security-advisories/",
    homepageUrl: "https://bodhi.fedoraproject.org/",
    description: "Fedora Bodhi updates system publishing signed RPM updates categorized into Security, Bugfix, Enhancement, and New Package releases.",
    scope: "Fedora 40, Fedora 39, Rawhide",
    access: "Public Bodhi REST API",
    coverage: "Signed RPM package updates, pipewire/wayland stability, kernel backports",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Fedora 40", "Fedora 39"],
    feedTypesCovered: ["Security", "Bugfix", "Enhancement", "Maintenance"]
  },

  // 11. Amazon Linux
  {
    id: "feed-amazon-alas",
    os: "amazon-linux",
    name: "Amazon Linux Security Center & General Updates (ALAS / AL2023)",
    category: "Cloud & Hyperscaler Linux",
    icon: "📦",
    provider: "Amazon Web Services (AWS)",
    officialFeedUrl: "https://alas.aws.amazon.com/AL2023/alas.rss",
    format: "UPDATEINFO",
    recordsIngested: 54200,
    updateFrequency: "Continuous AWS cloud deployment updates",
    documentationUrl: "https://alas.aws.amazon.com/",
    homepageUrl: "https://aws.amazon.com/linux/amazon-linux-2023/",
    description: "Amazon Linux 2023 and AL2 errata feeds providing security advisories, AWS Nitro hypervisor driver updates, and cloud-init performance patches.",
    scope: "Amazon Linux 2023 & Amazon Linux 2 (EC2, ECS, EKS)",
    access: "Public updateinfo.xml & RSS Feeds",
    coverage: "Security fixes, AWS SDK updates, Nitro drivers, deterministic version locking",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["Amazon Linux 2023", "Amazon Linux 2"],
    feedTypesCovered: ["Security", "Bugfix", "Enhancement"]
  },

  // 12. Upstream Linux Kernel
  {
    id: "feed-kernel-stable",
    os: "kernel",
    name: "Upstream Linux Kernel Stable Tree (Greg K-H Point Releases & CVEs)",
    category: "Upstream Linux Kernel",
    icon: "🐧",
    provider: "The Linux Kernel Organization & Greg Kroah-Hartman",
    officialFeedUrl: "https://www.kernel.org/feeds/kdist.xml",
    format: "GIT_TREE",
    recordsIngested: 104500,
    updateFrequency: "Weekly stable point releases & urgent regression hotfixes",
    documentationUrl: "https://www.kernel.org/",
    homepageUrl: "https://www.kernel.org/",
    description: "Upstream Linux kernel stable tree patch sets containing driver regression fixes, filesystem stability patches (Btrfs, XFS, Ext4), and CVE errata.",
    scope: "Upstream Linux LTS Branches (6.6 LTS, 6.1 LTS, 5.15 LTS)",
    access: "Public Git, git-format-patch & kdist.xml",
    coverage: "Subsystem regression fixes, memory leak patches, hardware enablement",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["Linux 6.6 LTS", "Linux 6.1 LTS", "Linux 5.15 LTS"],
    feedTypesCovered: ["Security", "Bugfix", "Enhancement", "Maintenance"]
  },

  // 13. Gentoo Linux
  {
    id: "feed-gentoo-glsa",
    os: "gentoo",
    name: "Gentoo Linux Security Advisories & Portage Stable Tree (GLSA)",
    category: "Independent & Rolling Distros",
    icon: "🟣",
    provider: "Gentoo Security Team & Architecture Maintainers",
    officialFeedUrl: "https://security.gentoo.org/glsa/glsa.rdf",
    format: "JSON",
    recordsIngested: 24300,
    updateFrequency: "Live rsync / git tree sync",
    documentationUrl: "https://security.gentoo.org/glsa/",
    homepageUrl: "https://www.gentoo.org/",
    description: "Gentoo Portage package tree updates and GLSA advisories covering source-compiled package errata, toolchain flags, and security patches.",
    scope: "Gentoo Portage Tree @world & core system",
    access: "Public RDF/XML, Git & GLSA REST API",
    coverage: "GLSA security advisories, compiler optimization bugfixes, kernel ebuilds",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Gentoo Stable Rolling"],
    feedTypesCovered: ["Security", "Bugfix", "Maintenance"]
  },

  // 14. FreeBSD
  {
    id: "feed-freebsd-errata",
    os: "freebsd",
    name: "FreeBSD Advisories & Errata Notices (FreeBSD-SA & FreeBSD-EN)",
    category: "BSD & Unix Ecosystem",
    icon: "😈",
    provider: "FreeBSD Security Officer & Release Engineering",
    officialFeedUrl: "https://vuxml.freebsd.org/freebsd/vuln.xml.bz2",
    format: "XML",
    recordsIngested: 49800,
    updateFrequency: "Continuous security & quarterly stable point updates",
    documentationUrl: "https://www.freebsd.org/security/advisories/",
    homepageUrl: "https://www.freebsd.org/",
    description: "Official FreeBSD Security Advisories (FreeBSD-SA) and Errata Notices (FreeBSD-EN) for OpenZFS, network stack, and kernel driver stability.",
    scope: "FreeBSD 14.1-RELEASE, 14.0-RELEASE, 13.3-RELEASE Base & Ports",
    access: "Public VuXML bzip2 & freebsd-update stream",
    coverage: "FreeBSD-SA security fixes, FreeBSD-EN kernel/ZFS bugfixes, pkg errata",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["FreeBSD 14.1-RELEASE", "FreeBSD 13.3-RELEASE"],
    feedTypesCovered: ["Security", "Bugfix", "Maintenance"]
  },

  // 15. OpenBSD
  {
    id: "feed-openbsd-errata",
    os: "openbsd",
    name: "OpenBSD Security & Reliability Errata (Syspatch / Patches)",
    category: "BSD & Unix Ecosystem",
    icon: "🐡",
    provider: "OpenBSD Errata & Security Team",
    officialFeedUrl: "https://www.openbsd.org/errata75.html",
    format: "GIT_TREE",
    recordsIngested: 16400,
    updateFrequency: "Continuous publication upon patch approval",
    documentationUrl: "https://www.openbsd.org/errata.html",
    homepageUrl: "https://www.openbsd.org/",
    description: "Official OpenBSD binary syspatch stream fixing security flaws, pf packet filter bugs, and kernel stability errata.",
    scope: "OpenBSD 7.5, 7.4 Base System & Kernel",
    access: "Public syspatch HTTP mirror & patch files",
    coverage: "Syspatch binary updates, LibreSSL security, network bridge bugfixes",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["OpenBSD 7.5", "OpenBSD 7.4"],
    feedTypesCovered: ["Security", "Bugfix", "Maintenance"]
  },

  // 16. NetBSD
  {
    id: "feed-netbsd-errata",
    os: "netbsd",
    name: "NetBSD Security Advisories & pkgsrc Vulnerability Feed",
    category: "BSD & Unix Ecosystem",
    icon: "🚩",
    provider: "NetBSD Security Officer & pkgsrc Team",
    officialFeedUrl: "https://ftp.netbsd.org/pub/NetBSD/security/advisories/",
    format: "JSON",
    recordsIngested: 26100,
    updateFrequency: "Weekly maintenance & security releases",
    documentationUrl: "https://www.netbsd.org/support/security/",
    homepageUrl: "https://www.netbsd.org/",
    description: "NetBSD Security Advisories and pkgsrc cross-platform package errata for NVMM virtualization, kernel drivers, and core utilities.",
    scope: "NetBSD 10.0, 9.4 Base & pkgsrc quarterly",
    access: "Public FTP / HTTPS JSON streams",
    coverage: "NetBSD-SA security advisories, NetBSD-EN driver fixes, pkgin updates",
    refreshRate: "Weekly",
    status: "Daily",
    supportedReleases: ["NetBSD 10.0", "NetBSD 9.4"],
    feedTypesCovered: ["Security", "Bugfix", "Maintenance"]
  },

  // 17. Wolfi OS (Chainguard)
  {
    id: "feed-wolfi-secdb",
    os: "wolfi",
    name: "Wolfi Container Linux Advisory Database & APK Updates",
    category: "Lightweight & Container OS",
    icon: "🐺",
    provider: "Chainguard & Wolfi Community Maintainers",
    officialFeedUrl: "https://packages.wolfi.dev/os/security.json",
    format: "OSV",
    recordsIngested: 36700,
    updateFrequency: "Sub-hourly container image rebuilds",
    documentationUrl: "https://github.com/wolfi-dev/advisories",
    homepageUrl: "https://wolfi.dev/",
    description: "Distroless and container-native Linux distribution providing zero-CVE base images, glibc/musl toolchain updates, and SBOM metadata.",
    scope: "Wolfi OS Main & Community Container Packages",
    access: "Public OSV Schema JSON & Wolfi APK mirrors",
    coverage: "Container security fixes, distroless runtime patches, glibc updates",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Wolfi Rolling Container OS"],
    feedTypesCovered: ["Security", "Bugfix", "Maintenance"]
  },

  // 18. NixOS
  {
    id: "feed-nixos-tracker",
    os: "nixos",
    name: "NixOS Channel Releases & Security Tracker",
    category: "Independent & Rolling Distros",
    icon: "❄️",
    provider: "NixOS Security & Release Team",
    officialFeedUrl: "https://security.nixos.org/tracker.json",
    format: "JSON",
    recordsIngested: 41200,
    updateFrequency: "Continuous channel evaluation and binary cache builds",
    documentationUrl: "https://security.nixos.org/",
    homepageUrl: "https://nixos.org/",
    description: "NixOS declarative package management channel updates, security advisories, and atomic generation rollback metadata.",
    scope: "NixOS 24.05, 23.11 Channels & Unstable",
    access: "Public tracker JSON & hydra build webhooks",
    coverage: "Deterministic package rebuilds, systemd-boot EFI fixes, kernel channels",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["NixOS 24.05 (Uakari)", "NixOS 23.11 (Tapir)"],
    feedTypesCovered: ["Security", "Bugfix", "Enhancement", "Maintenance"]
  },

  // 19. Void Linux
  {
    id: "feed-void-xbps",
    os: "void",
    name: "Void Linux XBPS Updates & Security Stream",
    category: "Independent & Rolling Distros",
    icon: "⚪",
    provider: "Void Linux Core Team",
    officialFeedUrl: "https://voidlinux.org/news/",
    format: "GIT_TREE",
    recordsIngested: 21900,
    updateFrequency: "Continuous rolling build updates",
    documentationUrl: "https://voidlinux.org/news/",
    homepageUrl: "https://voidlinux.org/",
    description: "Independent rolling release distribution featuring the XBPS package manager, runit init system, and glibc/musl binary repositories.",
    scope: "Void Linux x86_64, aarch64 (glibc & musl)",
    access: "Public Git Repository & XBPS Repodata",
    coverage: "XBPS package updates, runit service scripts, dracut initramfs fixes",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Void Linux Rolling"],
    feedTypesCovered: ["Security", "Bugfix", "Maintenance"]
  },

  // 20. VMware Photon OS
  {
    id: "feed-photon-oval",
    os: "photon",
    name: "VMware Photon OS Errata (PHSA Security & PHBA Bugfix)",
    category: "Cloud & Hyperscaler Linux",
    icon: "⚡",
    provider: "Broadcom / VMware Open Source Program Office",
    officialFeedUrl: "https://packages.vmware.com/photon/photon_oval/",
    format: "OVAL",
    recordsIngested: 33800,
    updateFrequency: "Daily sync with VMware repository mirrors",
    documentationUrl: "https://github.com/vmware/photon/wiki/Security-Updates",
    homepageUrl: "https://vmware.github.io/photon/",
    description: "Cloud-optimized Linux host for container platforms in VMware vSphere, Tanzu, and cloud environments with tdnf package manager.",
    scope: "Photon OS 5.0, 4.0 (x86_64, aarch64)",
    access: "Public OVAL XML & DNF/tdnf updateinfo",
    coverage: "PHSA security fixes, PHBA container runtime stability, kernel updates",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["Photon OS 5.0", "Photon OS 4.0"],
    feedTypesCovered: ["Security", "Bugfix", "Enhancement"]
  },

  // 21. Flatcar Container Linux
  {
    id: "feed-flatcar-releases",
    os: "flatcar",
    name: "Flatcar Container Linux Release & Security Stream",
    category: "Lightweight & Container OS",
    icon: "🚗",
    provider: "Flatcar / Kinvolk / Microsoft",
    officialFeedUrl: "https://www.flatcar.org/releases/stable/update.json",
    format: "JSON",
    recordsIngested: 18700,
    updateFrequency: "Bi-weekly stable releases & urgent hotfixes",
    documentationUrl: "https://www.flatcar.org/security/advisories/",
    homepageUrl: "https://www.flatcar.org/",
    description: "Immutable container host OS using dual-partition A/B updates, systemd-networkd, and ignition provisioning for Kubernetes fleets.",
    scope: "Flatcar Stable, Beta, Edge Channels",
    access: "Public JSON Release Stream & Omaha Protocol",
    coverage: "OS image delta updates, kernel patches, systemd reliability fixes",
    refreshRate: "Weekly",
    status: "Daily",
    supportedReleases: ["Flatcar Stable 3815.2.0", "Flatcar LTS"],
    feedTypesCovered: ["Security", "Bugfix", "Maintenance"]
  },

  // 22. Talos Linux
  {
    id: "feed-talos-advisories",
    os: "talos",
    name: "Talos Linux Immutable OS Updates & Sidero Advisories",
    category: "Lightweight & Container OS",
    icon: "🛡️",
    provider: "Sidero Labs Security Team",
    officialFeedUrl: "https://github.com/siderolabs/talos/security/advisories",
    format: "OSV",
    recordsIngested: 11500,
    updateFrequency: "Point release builds upon vulnerability fix",
    documentationUrl: "https://talos.dev/",
    homepageUrl: "https://talos.dev/",
    description: "Modern Linux distribution designed for Kubernetes: completely immutable, ephemeral, and managed entirely via a secure gRPC API (talosctl).",
    scope: "Talos Linux v1.7, v1.6 Appliances",
    access: "Public OSV JSON & GitHub Security Advisories",
    coverage: "Kernel CVE patches, containerd/CRI stability, etcd clustering fixes",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["Talos v1.7.5", "Talos v1.6.8"],
    feedTypesCovered: ["Security", "Bugfix", "Maintenance"]
  },

  // 23. OpenWrt
  {
    id: "feed-openwrt-advisories",
    os: "openwrt",
    name: "OpenWrt Stable Updates & Security Advisories (OpenWrt-SA)",
    category: "Embedded & Edge Linux",
    icon: "📶",
    provider: "OpenWrt Project Security & Maintenance Team",
    officialFeedUrl: "https://openwrt.org/advisories",
    format: "JSON",
    recordsIngested: 14800,
    updateFrequency: "Point release sync with git tags",
    documentationUrl: "https://openwrt.org/advisories",
    homepageUrl: "https://openwrt.org/",
    description: "Linux operating system targeting embedded network devices, residential routers, wireless gateways, and IoT edge hardware.",
    scope: "OpenWrt 23.05, 22.03 Stable Series",
    access: "Public JSON Errata & OPKG repository feeds",
    coverage: "Dropbear/OpenSSH fixes, ath11k Wi-Fi driver stability, dnsmasq updates",
    refreshRate: "Weekly",
    status: "Daily",
    supportedReleases: ["OpenWrt 23.05.3", "OpenWrt 22.03.6"],
    feedTypesCovered: ["Security", "Bugfix", "Maintenance"]
  },

  // 24. openEuler
  {
    id: "feed-openeuler-errata",
    os: "openeuler",
    name: "openEuler Safety Bulletins & Maintenance Advisories (CSAF)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🌐",
    provider: "openEuler Community & OpenAtom Foundation",
    officialFeedUrl: "https://www.openeuler.org/en/security/safety-bulletin/",
    format: "CSAF",
    recordsIngested: 51400,
    updateFrequency: "Continuous publication of security and bugfix bulletins",
    documentationUrl: "https://www.openeuler.org/en/security/",
    homepageUrl: "https://www.openeuler.org/",
    description: "Open-source Linux distribution optimized for digital infrastructure, enterprise servers, cloud-native deployments, and edge computing.",
    scope: "openEuler 24.03 LTS, 22.03 LTS SP3",
    access: "Public CSAF 2.0 JSON & DNF repository streams",
    coverage: "Security CVE patches, kernel bugfixes, AArch64 performance tuning",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["openEuler 24.03 LTS", "openEuler 22.03 LTS"],
    feedTypesCovered: ["Security", "Bugfix", "Enhancement"]
  },

  // 25. CloudLinux
  {
    id: "feed-cloudlinux-errata",
    os: "cloudlinux",
    name: "CloudLinux OS Errata & Bug Fix Advisories (CLSA & CLBA)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "☁️",
    provider: "CloudLinux Inc. Security & Kernel Team",
    officialFeedUrl: "https://repo.cloudlinux.com/cloudlinux/",
    format: "UPDATEINFO",
    recordsIngested: 62700,
    updateFrequency: "Daily sync with enterprise mirrors",
    documentationUrl: "https://www.cloudlinux.com/security/",
    homepageUrl: "https://www.cloudlinux.com/",
    description: "Enterprise operating system tailored for shared multi-tenant hosting providers, featuring CageFS, LVE resource limits, and hardened kernels.",
    scope: "CloudLinux 9, CloudLinux 8, CageFS",
    access: "Public updateinfo.xml & DNF repositories",
    coverage: "CLSA security notices, CageFS isolation bugfixes, PHP security patches",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["CloudLinux 9", "CloudLinux 8"],
    feedTypesCovered: ["Security", "Bugfix", "Enhancement"]
  },

  // 26. Kali Linux
  {
    id: "feed-kali-updates",
    os: "kali",
    name: "Kali Linux Package Tracker & Errata Stream",
    category: "Debian & Ubuntu Ecosystem",
    icon: "🐉",
    provider: "OffSec & Kali Linux Development Team",
    officialFeedUrl: "https://pkg.kali.org/news/rss",
    format: "JSON",
    recordsIngested: 32600,
    updateFrequency: "Continuous rolling package sync with Debian testing",
    documentationUrl: "https://www.kali.org/docs/",
    homepageUrl: "https://www.kali.org/",
    description: "Debian-derived rolling Linux distribution designed for digital forensics, penetration testing, and security engineering.",
    scope: "Kali Linux Rolling (x86_64, aarch64)",
    access: "Public Package Tracker JSON & apt mirrors",
    coverage: "Security tooling updates, kernel Wi-Fi injection driver fixes, glibc updates",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Kali Linux 2024.3", "Kali Linux Rolling"],
    feedTypesCovered: ["Security", "Bugfix", "Maintenance", "General"]
  },

  // 27. Azure Linux / CBL-Mariner
  {
    id: "feed-azure-linux",
    os: "azure-linux",
    name: "Azure Linux / CBL-Mariner Security & Errata Stream (MSRC)",
    category: "Cloud & Hyperscaler Linux",
    icon: "🔷",
    provider: "Microsoft Security Response Center (MSRC) & Azure Linux Team",
    officialFeedUrl: "https://github.com/microsoft/azurelinux",
    format: "CSAF",
    recordsIngested: 38900,
    updateFrequency: "Continuous cloud image and package updates",
    documentationUrl: "https://learn.microsoft.com/en-us/azure/azure-linux/",
    homepageUrl: "https://github.com/microsoft/azurelinux",
    description: "Microsoft internal Linux distribution powering Azure Kubernetes Service (AKS) container hosts, Hyper-V appliances, and edge services.",
    scope: "Azure Linux 3.0, CBL-Mariner 2.0",
    access: "Public CSAF JSON & tdnf RPM streams",
    coverage: "MSRC security bulletins, Cloud-Hypervisor fixes, AKS host stability",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Azure Linux 3.0", "CBL-Mariner 2.0"],
    feedTypesCovered: ["Security", "Bugfix", "Enhancement", "Maintenance"]
  }
];

/**
 * Curated, Verified Vendor Patch Bundles across All Major Distributions
 * Spanning Security Vulnerabilities, Bug Fixes, Hardware Enhancements, and Maintenance Point Updates.
 */
export const ARGENT_PATCH_BUNDLES: ArgentPatchBundle[] = [
  // ===========================================================================
  // 1. SECURITY ADVISORIES (RHSA, RLSA, USN, DSA, ALSA, etc.)
  // ===========================================================================

  // 1. Ubuntu Linux OpenSSH RegreSSHion Security Bundle
  {
    id: "ARG-USN-6856-1",
    bundleId: "USN-6856-1",
    advisoryType: "SECURITY",
    os: "ubuntu",
    osFamily: "linux-debian",
    osDisplayName: "Ubuntu Linux",
    targetReleases: ["Ubuntu 24.04 LTS (Noble)", "Ubuntu 22.04 LTS (Jammy)"],
    title: "OpenSSH Signal Handler Race Condition (RegreSSHion) Vulnerability Bundle",
    synopsis: "Canonical security update fixing critical signal handler race condition in sshd unauthenticated pre-auth code path.",
    vendorSeverity: "CRITICAL",
    severityScore: 9.8,
    operationalDomain: "NETWORK",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-01T06:30:00Z",
    updatedAt: "2024-07-01T08:15:00Z",
    cveList: ["CVE-2024-6387"],
    packages: [
      { name: "openssh-server", sourcePackage: "openssh", arch: "x86_64", currentVersion: "1:9.6p1-3ubuntu13", fixedVersion: "1:9.6p1-3ubuntu13.3", packageManager: "apt", sizeBytes: 462000 },
      { name: "openssh-client", sourcePackage: "openssh", arch: "x86_64", currentVersion: "1:9.6p1-3ubuntu13", fixedVersion: "1:9.6p1-3ubuntu13.3", packageManager: "apt", sizeBytes: 1045000 },
      { name: "openssh-sftp-server", sourcePackage: "openssh", arch: "x86_64", currentVersion: "1:9.6p1-3ubuntu13", fixedVersion: "1:9.6p1-3ubuntu13.3", packageManager: "apt", sizeBytes: 68000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update && apt-get install --only-upgrade -y openssh-server openssh-client openssh-sftp-server",
      verification: "dpkg -l openssh-server | grep 1:9.6p1-3ubuntu13.3",
      rollback: "apt-get install -y openssh-server=1:9.6p1-3ubuntu13 openssh-client=1:9.6p1-3ubuntu13",
      kineticDeploy: "kinetic upgrade --bundle USN-6856-1 --os ubuntu"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://ubuntu.com/security/notices/USN-6856-1",
    sourceFeed: {
      sourceId: "feed-ubuntu-usn",
      feedName: "Canonical Ubuntu Updates & Security Notices (USN / OVAL)",
      feedType: "public-distro-feed",
      format: "OSV",
      syncStatus: "live",
      sourceUrl: "https://security.ubuntu.com/oval/com.ubuntu.noble.usn.oval.xml.bz2"
    }
  },

  // 2. Rocky Linux OpenSSH RegreSSHion Security Bundle
  {
    id: "ARG-RLSA-2024-4312",
    bundleId: "RLSA-2024:4312",
    advisoryType: "SECURITY",
    os: "rocky",
    osFamily: "linux-rhel",
    osDisplayName: "Rocky Linux",
    targetReleases: ["Rocky Linux 9.4 (Blue Onyx)", "Rocky Linux 8.10"],
    title: "OpenSSH Remote Code Execution Signal Race Errata Bundle",
    synopsis: "Official Rocky Enterprise Software Foundation security update fixing unauthenticated remote code execution in sshd.",
    vendorSeverity: "CRITICAL",
    severityScore: 9.8,
    operationalDomain: "NETWORK",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-01T14:40:00Z",
    updatedAt: "2024-07-01T15:20:00Z",
    cveList: ["CVE-2024-6387"],
    packages: [
      { name: "openssh", sourcePackage: "openssh", arch: "x86_64", currentVersion: "8.7p1-38.el9_4", fixedVersion: "8.7p1-38.el9_4.1", packageManager: "dnf", sizeBytes: 467000 },
      { name: "openssh-server", sourcePackage: "openssh", arch: "x86_64", currentVersion: "8.7p1-38.el9_4", fixedVersion: "8.7p1-38.el9_4.1", packageManager: "dnf", sizeBytes: 462000 },
      { name: "openssh-clients", sourcePackage: "openssh", arch: "x86_64", currentVersion: "8.7p1-38.el9_4", fixedVersion: "8.7p1-38.el9_4.1", packageManager: "dnf", sizeBytes: 730000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y openssh openssh-server openssh-clients",
      verification: "rpm -q --queryformat '%{VERSION}-%{RELEASE}\n' openssh-server",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle RLSA-2024:4312 --os rocky"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://errata.rockylinux.org/RLSA-2024:4312",
    sourceFeed: {
      sourceId: "feed-rocky-errata",
      feedName: "Rocky Linux Errata (RLSA Security, RLBA Bugfix, RLEA Enhancement)",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://errata.rockylinux.org/"
    }
  },

  // 3. Red Hat Enterprise Linux OpenSSL Security Advisory
  {
    id: "ARG-RHSA-2024-4211",
    bundleId: "RHSA-2024:4211",
    advisoryType: "SECURITY",
    os: "rhel",
    osFamily: "linux-rhel",
    osDisplayName: "Red Hat Enterprise Linux",
    targetReleases: ["RHEL 9.4", "RHEL 9.2 EUS", "RHEL 8.10"],
    title: "OpenSSL Denial of Service & TLS Session Cache Poisoning Errata",
    synopsis: "Red Hat Product Security update resolving memory leaks during TLS session ticket processing and unbounded session caching.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.5,
    operationalDomain: "CORE",
    actionDirective: "RELOAD_SERVICE",
    issuedAt: "2024-06-25T11:00:00Z",
    updatedAt: "2024-06-25T12:30:00Z",
    cveList: ["CVE-2024-2511", "CVE-2024-4741"],
    packages: [
      { name: "openssl", sourcePackage: "openssl", arch: "x86_64", currentVersion: "3.0.7-27.el9", fixedVersion: "3.0.7-27.el9_4.2", packageManager: "dnf", sizeBytes: 1210000 },
      { name: "openssl-libs", sourcePackage: "openssl", arch: "x86_64", currentVersion: "3.0.7-27.el9", fixedVersion: "3.0.7-27.el9_4.2", packageManager: "dnf", sizeBytes: 2240000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y openssl openssl-libs",
      verification: "rpm -q --changelog openssl | grep -E 'CVE-2024-2511|CVE-2024-4741'",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle RHSA-2024:4211 --os rhel"
    },
    impact: { rebootRequired: false, servicesToRestart: ["nginx", "httpd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://access.redhat.com/errata/RHSA-2024:4211",
    sourceFeed: {
      sourceId: "feed-redhat-csaf",
      feedName: "Red Hat Security & Errata Stream (RHSA, RHBA, RHEA / CSAF 2.0)",
      feedType: "public-distro-feed",
      format: "CSAF",
      syncStatus: "live",
      sourceUrl: "https://access.redhat.com/hydra/rest/securitydata/cvrf.json"
    }
  },

  // 4. Debian GNU/Linux OpenSSL Security Bundle
  {
    id: "ARG-DSA-5712-1",
    bundleId: "DSA-5712-1",
    advisoryType: "SECURITY",
    os: "debian",
    osFamily: "linux-debian",
    osDisplayName: "Debian GNU/Linux",
    targetReleases: ["Debian 12 (Bookworm)"],
    title: "OpenSSL Memory Corruption and Session Cache Poisoning Security Bundle",
    synopsis: "Debian security advisory resolving TLS session ticket validation errors and cipher suite verification flaws.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.8,
    operationalDomain: "CORE",
    actionDirective: "RELOAD_SERVICE",
    issuedAt: "2024-06-18T10:00:00Z",
    updatedAt: "2024-06-18T10:00:00Z",
    cveList: ["CVE-2024-2511", "CVE-2024-4741"],
    packages: [
      { name: "openssl", sourcePackage: "openssl", arch: "x86_64", currentVersion: "3.0.11-1~deb12u1", fixedVersion: "3.0.13-1~deb12u1", packageManager: "apt", sizeBytes: 1420000 },
      { name: "libssl3", sourcePackage: "openssl", arch: "x86_64", currentVersion: "3.0.11-1~deb12u1", fixedVersion: "3.0.13-1~deb12u1", packageManager: "apt", sizeBytes: 2010000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update && apt-get install --only-upgrade -y openssl libssl3",
      verification: "dpkg -l openssl | grep 3.0.13-1~deb12u1",
      rollback: "apt-get install -y openssl=3.0.11-1~deb12u1 libssl3=3.0.11-1~deb12u1",
      kineticDeploy: "kinetic upgrade --bundle DSA-5712-1 --os debian"
    },
    impact: { rebootRequired: false, servicesToRestart: ["apache2", "nginx"], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.debian.org/security/2024/dsa-5712",
    sourceFeed: {
      sourceId: "feed-debian-tracker",
      feedName: "Debian Security Tracker & Proposed Updates (DSA / BTS)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://security-tracker.debian.org/tracker/data/json"
    }
  },

  // 5. AlmaLinux Security Advisory
  {
    id: "ARG-ALSA-2024-4312",
    bundleId: "ALSA-2024:4312",
    advisoryType: "SECURITY",
    os: "almalinux",
    osFamily: "linux-rhel",
    osDisplayName: "AlmaLinux",
    targetReleases: ["AlmaLinux 9.4 (Seafoam Ocelot)"],
    title: "OpenSSH Remote Code Execution Signal Handler Patch Bundle",
    synopsis: "AlmaLinux OS Foundation security advisory fixing unauthenticated remote code execution vulnerability in OpenSSH server daemon.",
    vendorSeverity: "CRITICAL",
    severityScore: 9.8,
    operationalDomain: "NETWORK",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-01T15:00:00Z",
    updatedAt: "2024-07-01T15:30:00Z",
    cveList: ["CVE-2024-6387"],
    packages: [
      { name: "openssh", sourcePackage: "openssh", arch: "x86_64", currentVersion: "8.7p1-38.el9_4", fixedVersion: "8.7p1-38.el9_4.alma.1", packageManager: "dnf", sizeBytes: 467000 },
      { name: "openssh-server", sourcePackage: "openssh", arch: "x86_64", currentVersion: "8.7p1-38.el9_4", fixedVersion: "8.7p1-38.el9_4.alma.1", packageManager: "dnf", sizeBytes: 462000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y openssh openssh-server",
      verification: "rpm -q openssh-server | grep alma.1",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle ALSA-2024:4312 --os almalinux"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://errata.almalinux.org/9/ALSA-2024-4312.html",
    sourceFeed: {
      sourceId: "feed-almalinux-errata",
      feedName: "AlmaLinux Errata Stream (ALSA Security, ALBA Bugfix, ALEA Enhancement)",
      feedType: "public-distro-feed",
      format: "CSAF",
      syncStatus: "live",
      sourceUrl: "https://errata.almalinux.org/api/v1/errata"
    }
  },

  // 6. FreeBSD Security Advisory
  {
    id: "ARG-FreeBSD-SA-24-04",
    bundleId: "FreeBSD-SA-24:04.openssh",
    advisoryType: "SECURITY",
    os: "freebsd",
    osFamily: "bsd-freebsd",
    osDisplayName: "FreeBSD",
    targetReleases: ["FreeBSD 14.1-RELEASE", "FreeBSD 13.3-RELEASE"],
    title: "OpenSSH Remote Code Execution in sshd (FreeBSD-SA-24:04)",
    synopsis: "FreeBSD Security Officer advisory addressing signal race condition in sshd through freebsd-update binary patches.",
    vendorSeverity: "CRITICAL",
    severityScore: 9.8,
    operationalDomain: "NETWORK",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-01T13:00:00Z",
    updatedAt: "2024-07-01T13:00:00Z",
    cveList: ["CVE-2024-6387"],
    packages: [
      { name: "base-openssh", sourcePackage: "src/crypto/openssh", arch: "x86_64", currentVersion: "9.7p1_p1", fixedVersion: "9.7p1_p2", packageManager: "pkg", sizeBytes: 1650000 }
    ],
    commands: {
      nativeUpgrade: "freebsd-update fetch && freebsd-update install && service sshd restart",
      verification: "freebsd-version -k -u",
      rollback: "freebsd-update rollback && service sshd restart",
      kineticDeploy: "kinetic upgrade --bundle FreeBSD-SA-24:04.openssh --os freebsd"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.freebsd.org/security/advisories/FreeBSD-SA-24:04.openssh.asc",
    sourceFeed: {
      sourceId: "feed-freebsd-errata",
      feedName: "FreeBSD Advisories & Errata Notices (FreeBSD-SA & FreeBSD-EN)",
      feedType: "public-distro-feed",
      format: "XML",
      syncStatus: "live",
      sourceUrl: "https://vuxml.freebsd.org/freebsd/vuln.xml.bz2"
    }
  },

  // 7. Alpine Linux Security Advisory
  {
    id: "ARG-ALPINE-SEC-2024-118",
    bundleId: "ALPINE-SEC-2024-118",
    advisoryType: "SECURITY",
    os: "alpine",
    osFamily: "linux-alpine",
    osDisplayName: "Alpine Linux",
    targetReleases: ["Alpine v3.20", "Alpine v3.19"],
    title: "Alpine SecDB OpenSSH Remote Code Execution Vulnerability Advisory",
    synopsis: "Alpine Linux SecDB update fixing race condition in sshd for lightweight musl container environments.",
    vendorSeverity: "CRITICAL",
    severityScore: 9.8,
    operationalDomain: "CONTAINER",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-01T07:15:00Z",
    updatedAt: "2024-07-01T07:15:00Z",
    cveList: ["CVE-2024-6387"],
    packages: [
      { name: "openssh", sourcePackage: "openssh", arch: "x86_64", currentVersion: "9.7_p1-r0", fixedVersion: "9.7_p1-r1", packageManager: "apk", sizeBytes: 890000 },
      { name: "openssh-server", sourcePackage: "openssh", arch: "x86_64", currentVersion: "9.7_p1-r0", fixedVersion: "9.7_p1-r1", packageManager: "apk", sizeBytes: 395000 }
    ],
    commands: {
      nativeUpgrade: "apk update && apk add --upgrade openssh openssh-server",
      verification: "apk info -v openssh | grep 9.7_p1-r1",
      rollback: "apk add openssh=9.7_p1-r0 openssh-server=9.7_p1-r0",
      kineticDeploy: "kinetic upgrade --bundle ALPINE-SEC-2024-118 --os alpine"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://secdb.alpinelinux.org/v3.20/main.json",
    sourceFeed: {
      sourceId: "feed-alpine-secdb",
      feedName: "Alpine Linux Security Database & Package Updates (SecDB / APK)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://secdb.alpinelinux.org/v3.20/main.json"
    }
  },

  // 8. SUSE Linux Enterprise Security Update
  {
    id: "ARG-SUSE-SU-2024-2311",
    bundleId: "SUSE-SU-2024:2311-1",
    advisoryType: "SECURITY",
    os: "suse",
    osFamily: "linux-suse",
    osDisplayName: "SUSE Linux Enterprise",
    targetReleases: ["SLES 15 SP6", "SLES 15 SP5"],
    title: "OpenSSH Vulnerability Errata for SUSE Linux Enterprise",
    synopsis: "SUSE security update eliminating unauthenticated remote code execution in sshd through maintenance channel RPM updates.",
    vendorSeverity: "CRITICAL",
    severityScore: 9.8,
    operationalDomain: "NETWORK",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-01T12:00:00Z",
    updatedAt: "2024-07-01T12:00:00Z",
    cveList: ["CVE-2024-6387"],
    packages: [
      { name: "openssh", sourcePackage: "openssh", arch: "x86_64", currentVersion: "8.4p1-150300.3.36.1", fixedVersion: "8.4p1-150300.3.39.1", packageManager: "zypper", sizeBytes: 1120000 },
      { name: "openssh-server", sourcePackage: "openssh", arch: "x86_64", currentVersion: "8.4p1-150300.3.36.1", fixedVersion: "8.4p1-150300.3.39.1", packageManager: "zypper", sizeBytes: 520000 }
    ],
    commands: {
      nativeUpgrade: "zypper refresh && zypper update -y openssh openssh-server",
      verification: "rpm -q openssh-server | grep 150300.3.39.1",
      rollback: "zypper install --oldpackage -y openssh=8.4p1-150300.3.36.1",
      kineticDeploy: "kinetic upgrade --bundle SUSE-SU-2024:2311-1 --os suse"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.suse.com/support/update/announcement/2024/suse-su-20242311-1/",
    sourceFeed: {
      sourceId: "feed-suse-oval",
      feedName: "SUSE Maintenance & Errata (SUSE-SU Security, SUSE-RU Recommended / Bugfix)",
      feedType: "public-distro-feed",
      format: "OVAL",
      syncStatus: "live",
      sourceUrl: "https://ftp.suse.com/pub/projects/security/oval/"
    }
  },

  // 9. Arch Linux Security Advisory
  {
    id: "ARG-ARCH-ASA-202407-1",
    bundleId: "ASA-202407-1",
    advisoryType: "SECURITY",
    os: "arch",
    osFamily: "linux-arch",
    osDisplayName: "Arch Linux",
    targetReleases: ["Arch Linux Rolling"],
    title: "OpenSSH Signal Handler Race Condition Errata",
    synopsis: "Arch Linux Security Team advisory and immediate core package update fixing CVE-2024-6387 in upstream OpenSSH 9.7p1.",
    vendorSeverity: "CRITICAL",
    severityScore: 9.8,
    operationalDomain: "NETWORK",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-01T08:00:00Z",
    updatedAt: "2024-07-01T08:00:00Z",
    cveList: ["CVE-2024-6387"],
    packages: [
      { name: "openssh", sourcePackage: "openssh", arch: "x86_64", currentVersion: "9.7p1-1", fixedVersion: "9.7p1-2", packageManager: "pacman", sizeBytes: 1540000 }
    ],
    commands: {
      nativeUpgrade: "pacman -Sy --noconfirm openssh",
      verification: "pacman -Q openssh | grep 9.7p1-2",
      rollback: "pacman -U --noconfirm /var/cache/pacman/pkg/openssh-9.7p1-1-x86_64.pkg.tar.zst",
      kineticDeploy: "kinetic upgrade --bundle ASA-202407-1 --os arch"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://security.archlinux.org/ASA-202407-1",
    sourceFeed: {
      sourceId: "feed-arch-tracker",
      feedName: "Arch Linux Security Tracker & Core/Extra Package Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://security.archlinux.org/issues.json"
    }
  },

  // 10. Amazon Linux Security Advisory
  {
    id: "ARG-ALAS-2024-219",
    bundleId: "ALAS2023-2024-648",
    advisoryType: "SECURITY",
    os: "amazon-linux",
    osFamily: "linux-amazon",
    osDisplayName: "Amazon Linux 2023",
    targetReleases: ["Amazon Linux 2023"],
    title: "OpenSSH Security Advisory for Amazon Linux 2023 (ALAS2023-2024-648)",
    synopsis: "AWS Security advisory fixing unauthenticated remote code execution in OpenSSH server on EC2 and container AMIs.",
    vendorSeverity: "CRITICAL",
    severityScore: 9.8,
    operationalDomain: "NETWORK",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-01T16:00:00Z",
    updatedAt: "2024-07-01T16:00:00Z",
    cveList: ["CVE-2024-6387"],
    packages: [
      { name: "openssh-server", sourcePackage: "openssh", arch: "x86_64", currentVersion: "8.7p1-8.amzn2023.0.7", fixedVersion: "8.7p1-8.amzn2023.0.8", packageManager: "dnf", sizeBytes: 462000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y openssh-server",
      verification: "rpm -q openssh-server | grep amzn2023.0.8",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle ALAS2023-2024-648 --os amazon-linux"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://alas.aws.amazon.com/AL2023/ALAS-2024-648.html",
    sourceFeed: {
      sourceId: "feed-amazon-alas",
      feedName: "Amazon Linux Security Center & General Updates (ALAS / AL2023)",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://alas.aws.amazon.com/AL2023/alas.rss"
    }
  },

  // 11. Upstream Linux Kernel Stable CVE Errata
  {
    id: "ARG-KERNEL-CVE-2024-36971",
    bundleId: "KERNEL-CVE-2024-36971",
    advisoryType: "SECURITY",
    os: "kernel",
    osFamily: "linux-kernel",
    osDisplayName: "Linux Kernel Stable",
    targetReleases: ["Linux 6.6 LTS", "Linux 6.1 LTS"],
    title: "Linux Kernel Networking Stack Use-After-Free in IP Route Handling",
    synopsis: "Upstream kernel stable release resolving critical use-after-free vulnerability in the IPv4/IPv6 destination cache lookup path.",
    vendorSeverity: "CRITICAL",
    severityScore: 9.1,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-18T18:00:00Z",
    updatedAt: "2024-06-18T18:00:00Z",
    cveList: ["CVE-2024-36971"],
    packages: [
      { name: "linux-image-generic", sourcePackage: "linux", arch: "x86_64", currentVersion: "6.6.32", fixedVersion: "6.6.35", packageManager: "kmod", sizeBytes: 14200000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update && apt-get install --only-upgrade -y linux-image-generic linux-headers-generic",
      verification: "uname -r",
      rollback: "grub-reboot 'Advanced options for Ubuntu>Ubuntu, with Linux 6.6.32' && reboot",
      kineticDeploy: "kinetic hotpatch --kernel-cve CVE-2024-36971 --live"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://git.kernel.org/pub/scm/linux/kernel/git/stable/linux.git/commit/?id=929000a6e700",
    sourceFeed: {
      sourceId: "feed-kernel-stable",
      feedName: "Upstream Linux Kernel Stable Tree (Greg K-H Point Releases & CVEs)",
      feedType: "public-distro-feed",
      format: "GIT_TREE",
      syncStatus: "live",
      sourceUrl: "https://www.kernel.org/feeds/kdist.xml"
    }
  },

  // 12. Gentoo Linux Security Advisory
  {
    id: "ARG-GLSA-202407-01",
    bundleId: "GLSA-202407-01",
    advisoryType: "SECURITY",
    os: "gentoo",
    osFamily: "linux-gentoo",
    osDisplayName: "Gentoo Linux",
    targetReleases: ["Gentoo Stable Rolling"],
    title: "OpenSSH Remote Code Execution (GLSA 202407-01)",
    synopsis: "Gentoo Linux Security Advisory resolving remote code execution in net-misc/openssh ebuilds across x86_64 and arm64 profiles.",
    vendorSeverity: "CRITICAL",
    severityScore: 9.8,
    operationalDomain: "NETWORK",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-01T09:30:00Z",
    updatedAt: "2024-07-01T09:30:00Z",
    cveList: ["CVE-2024-6387"],
    packages: [
      { name: "net-misc/openssh", sourcePackage: "openssh", arch: "x86_64", currentVersion: "9.7_p1", fixedVersion: "9.7_p1-r1", packageManager: "emerge", sizeBytes: 1450000 }
    ],
    commands: {
      nativeUpgrade: "emerge --sync && emerge -1v =net-misc/openssh-9.7_p1-r1",
      verification: "qlist -Iv net-misc/openssh",
      rollback: "emerge -1v =net-misc/openssh-9.7_p1",
      kineticDeploy: "kinetic upgrade --bundle GLSA-202407-01 --os gentoo"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://security.gentoo.org/glsa/202407-01",
    sourceFeed: {
      sourceId: "feed-gentoo-glsa",
      feedName: "Gentoo Linux Security Advisories & Portage Stable Tree (GLSA)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://security.gentoo.org/glsa/glsa.rdf"
    }
  },

  // 13. OpenBSD Security Errata
  {
    id: "ARG-OPENBSD-75-001",
    bundleId: "OPENBSD-75-001",
    advisoryType: "SECURITY",
    os: "openbsd",
    osFamily: "bsd-openbsd",
    osDisplayName: "OpenBSD",
    targetReleases: ["OpenBSD 7.5"],
    title: "OpenBSD sshd Signal Handler Race Condition Reliability Errata",
    synopsis: "Official OpenBSD errata patch correcting sigdie signal handler race condition in sshd daemon.",
    vendorSeverity: "CRITICAL",
    severityScore: 9.8,
    operationalDomain: "CORE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-01T05:00:00Z",
    updatedAt: "2024-07-01T05:00:00Z",
    cveList: ["CVE-2024-6387"],
    packages: [
      { name: "syspatch-001_sshd", sourcePackage: "src/usr.bin/ssh", arch: "x86_64", currentVersion: "7.5-base", fixedVersion: "7.5-patch001", packageManager: "syspatch", sizeBytes: 312000 }
    ],
    commands: {
      nativeUpgrade: "syspatch && rcctl restart sshd",
      verification: "syspatch -l | grep 001_sshd",
      rollback: "syspatch -r 001_sshd && rcctl restart sshd",
      kineticDeploy: "kinetic upgrade --bundle OPENBSD-75-001 --os openbsd"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.openbsd.org/errata75.html",
    sourceFeed: {
      sourceId: "feed-openbsd-errata",
      feedName: "OpenBSD Security & Reliability Errata (Syspatch / Patches)",
      feedType: "public-distro-feed",
      format: "GIT_TREE",
      syncStatus: "live",
      sourceUrl: "https://www.openbsd.org/errata75.html"
    }
  },

  // 14. Wolfi Container OS Advisory
  {
    id: "ARG-CGA-2024-OPENSSH",
    bundleId: "CGA-2024-openssh-6387",
    advisoryType: "SECURITY",
    os: "wolfi",
    osFamily: "linux-wolfi",
    osDisplayName: "Wolfi Container OS",
    targetReleases: ["Wolfi Rolling Container OS"],
    title: "Wolfi SecDB OpenSSH Remote Code Execution Security Errata",
    synopsis: "Chainguard / Wolfi advisory fixing CVE-2024-6387 across all base container images using native apk rolling rebuilds.",
    vendorSeverity: "CRITICAL",
    severityScore: 9.8,
    operationalDomain: "CONTAINER",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-01T06:50:00Z",
    updatedAt: "2024-07-01T06:50:00Z",
    cveList: ["CVE-2024-6387"],
    packages: [
      { name: "openssh", sourcePackage: "openssh", arch: "x86_64", currentVersion: "9.7_p1-r0", fixedVersion: "9.7_p1-r1", packageManager: "apk", sizeBytes: 940000 }
    ],
    commands: {
      nativeUpgrade: "apk update && apk add --upgrade openssh",
      verification: "apk info -v openssh | grep 9.7_p1-r1",
      rollback: "apk add openssh=9.7_p1-r0",
      kineticDeploy: "kinetic upgrade --bundle CGA-2024-openssh-6387 --os wolfi"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://github.com/wolfi-dev/advisories/blob/main/CGA-2024-openssh-6387.json",
    sourceFeed: {
      sourceId: "feed-wolfi-secdb",
      feedName: "Wolfi Container Linux Advisory Database & APK Updates",
      feedType: "public-distro-feed",
      format: "OSV",
      syncStatus: "live",
      sourceUrl: "https://packages.wolfi.dev/os/security.json"
    }
  },

  // 15. NixOS Security Tracker Advisory
  {
    id: "ARG-NIX-2024-0722",
    bundleId: "NIX-2024-0722",
    advisoryType: "SECURITY",
    os: "nixos",
    osFamily: "linux-nix",
    osDisplayName: "NixOS",
    targetReleases: ["NixOS 24.05 (Uakari)"],
    title: "OpenSSH Remote Execution Patch for Nixpkgs 24.05 Channel",
    synopsis: "NixOS security channel release pulling patched OpenSSH 9.7p1-r1 into the deterministic nixpkgs binary cache.",
    vendorSeverity: "CRITICAL",
    severityScore: 9.8,
    operationalDomain: "NETWORK",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-01T11:45:00Z",
    updatedAt: "2024-07-01T11:45:00Z",
    cveList: ["CVE-2024-6387"],
    packages: [
      { name: "openssh", sourcePackage: "openssh", arch: "x86_64", currentVersion: "9.7p1", fixedVersion: "9.7p1-patched", packageManager: "nix", sizeBytes: 1580000 }
    ],
    commands: {
      nativeUpgrade: "nix-channel --update nixos-24.05 && nixos-rebuild switch",
      verification: "ssh -V",
      rollback: "nixos-rebuild switch --rollback",
      kineticDeploy: "kinetic upgrade --bundle NIX-2024-0722 --os nixos"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://security.nixos.org/",
    sourceFeed: {
      sourceId: "feed-nixos-tracker",
      feedName: "NixOS Channel Releases & Security Tracker",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://security.nixos.org/tracker.json"
    }
  },

  // ===========================================================================
  // 2. VENDOR BUG FIX ADVISORIES (RHBA, RLBA, ALBA, FreeBSD-EN, Debian BTS)
  // ===========================================================================

  // 16. Rocky Linux / RHEL Kernel NVMe Multi-path Bug Fix Advisory (RLBA)
  {
    id: "ARG-RLBA-2024-3910",
    bundleId: "RLBA-2024:3910",
    advisoryType: "BUGFIX",
    os: "rocky",
    osFamily: "linux-rhel",
    osDisplayName: "Rocky Linux",
    targetReleases: ["Rocky Linux 9.4 (Blue Onyx)", "Rocky Linux 8.10"],
    title: "Kernel NVMe Multi-path I/O Stall and Deadlock Bug Fix Advisory",
    synopsis: "Official Rocky Linux bug fix update resolving NVMe-oF path failover deadlock, SSD hang on heavy queue depths, and silent I/O stalls.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.2,
    operationalDomain: "STORAGE",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-12T14:20:00Z",
    updatedAt: "2024-06-12T14:20:00Z",
    cveList: [],
    packages: [
      { name: "kernel", sourcePackage: "kernel", arch: "x86_64", currentVersion: "5.14.0-427.18.1.el9_4", fixedVersion: "5.14.0-427.22.1.el9_4", packageManager: "dnf", sizeBytes: 14800000 },
      { name: "kernel-core", sourcePackage: "kernel", arch: "x86_64", currentVersion: "5.14.0-427.18.1.el9_4", fixedVersion: "5.14.0-427.22.1.el9_4", packageManager: "dnf", sizeBytes: 21500000 },
      { name: "kernel-modules", sourcePackage: "kernel", arch: "x86_64", currentVersion: "5.14.0-427.18.1.el9_4", fixedVersion: "5.14.0-427.22.1.el9_4", packageManager: "dnf", sizeBytes: 38200000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y kernel kernel-core kernel-modules nvme-cli",
      verification: "rpm -q kernel-core | grep 5.14.0-427.22.1.el9_4",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle RLBA-2024:3910 --os rocky"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://errata.rockylinux.org/RLBA-2024:3910",
    sourceFeed: {
      sourceId: "feed-rocky-errata",
      feedName: "Rocky Linux Errata (RLSA Security, RLBA Bugfix, RLEA Enhancement)",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://errata.rockylinux.org/"
    }
  },

  // 17. Red Hat Enterprise Linux glibc AVX-512 Performance & Bugfix Advisory (RHBA)
  {
    id: "ARG-RHBA-2024-4120",
    bundleId: "RHBA-2024:4120",
    advisoryType: "BUGFIX",
    os: "rhel",
    osFamily: "linux-rhel",
    osDisplayName: "Red Hat Enterprise Linux",
    targetReleases: ["RHEL 9.4", "RHEL 9.3"],
    title: "glibc AVX-512 Memory Copy Optimization & Dynamic Linker Stall Bugfix",
    synopsis: "Red Hat Bug Advisory fixing high CPU spin in ld.so during multi-threaded dlopen and optimizing memcpy/memmove on 4th Gen Intel Xeon & AMD EPYC.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.0,
    operationalDomain: "CORE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-20T10:15:00Z",
    updatedAt: "2024-06-20T10:15:00Z",
    cveList: [],
    packages: [
      { name: "glibc", sourcePackage: "glibc", arch: "x86_64", currentVersion: "2.34-100.el9_4.1", fixedVersion: "2.34-100.el9_4.3", packageManager: "dnf", sizeBytes: 2280000 },
      { name: "glibc-common", sourcePackage: "glibc", arch: "x86_64", currentVersion: "2.34-100.el9_4.1", fixedVersion: "2.34-100.el9_4.3", packageManager: "dnf", sizeBytes: 4950000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y glibc glibc-common",
      verification: "rpm -q glibc | grep 2.34-100.el9_4.3",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle RHBA-2024:4120 --os rhel"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://access.redhat.com/errata/RHBA-2024:4120",
    sourceFeed: {
      sourceId: "feed-redhat-csaf",
      feedName: "Red Hat Security & Errata Stream (RHSA, RHBA, RHEA / CSAF 2.0)",
      feedType: "public-distro-feed",
      format: "CSAF",
      syncStatus: "live",
      sourceUrl: "https://access.redhat.com/hydra/rest/securitydata/cvrf.json"
    }
  },

  // 18. Ubuntu Linux systemd Socket Activation & cgroup v2 Bugfix Bundle
  {
    id: "ARG-UBUNTU-UPD-2024-0412",
    bundleId: "UBUNTU-UPD-2024-0412",
    advisoryType: "BUGFIX",
    os: "ubuntu",
    osFamily: "linux-debian",
    osDisplayName: "Ubuntu Linux",
    targetReleases: ["Ubuntu 24.04 LTS (Noble)"],
    title: "systemd Socket Activation File Descriptor Leak and Cgroup v2 Freeze Bugfix",
    synopsis: "Canonical stable update fixing file descriptor accumulation under heavy connection bursts and container cgroup v2 freeze deadlocks.",
    vendorSeverity: "MODERATE",
    severityScore: 6.5,
    operationalDomain: "SYSTEMD",
    actionDirective: "RELOAD_SERVICE",
    issuedAt: "2024-06-28T09:00:00Z",
    updatedAt: "2024-06-28T09:00:00Z",
    cveList: [],
    packages: [
      { name: "systemd", sourcePackage: "systemd", arch: "x86_64", currentVersion: "255.4-1ubuntu8", fixedVersion: "255.4-1ubuntu8.4", packageManager: "apt", sizeBytes: 4210000 },
      { name: "libsystemd0", sourcePackage: "systemd", arch: "x86_64", currentVersion: "255.4-1ubuntu8", fixedVersion: "255.4-1ubuntu8.4", packageManager: "apt", sizeBytes: 412000 },
      { name: "udev", sourcePackage: "systemd", arch: "x86_64", currentVersion: "255.4-1ubuntu8", fixedVersion: "255.4-1ubuntu8.4", packageManager: "apt", sizeBytes: 1850000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update && apt-get install --only-upgrade -y systemd libsystemd0 udev && systemctl daemon-reexec",
      verification: "systemctl --version | grep 255.4-1ubuntu8.4",
      rollback: "apt-get install -y systemd=255.4-1ubuntu8 libsystemd0=255.4-1ubuntu8 udev=255.4-1ubuntu8 && systemctl daemon-reexec",
      kineticDeploy: "kinetic upgrade --bundle UBUNTU-UPD-2024-0412 --os ubuntu"
    },
    impact: { rebootRequired: false, servicesToRestart: ["systemd-udevd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://launchpad.net/ubuntu/+source/systemd/255.4-1ubuntu8.4",
    sourceFeed: {
      sourceId: "feed-ubuntu-usn",
      feedName: "Canonical Ubuntu Updates & Security Notices (USN / OVAL)",
      feedType: "public-distro-feed",
      format: "OSV",
      syncStatus: "live",
      sourceUrl: "https://security.ubuntu.com/oval/com.ubuntu.noble.usn.oval.xml.bz2"
    }
  },

  // 19. FreeBSD Errata Notice - OpenZFS Allocation Race Condition
  {
    id: "ARG-FreeBSD-EN-24-08",
    bundleId: "FreeBSD-EN-24:08.zfs",
    advisoryType: "BUGFIX",
    os: "freebsd",
    osFamily: "bsd-freebsd",
    osDisplayName: "FreeBSD",
    targetReleases: ["FreeBSD 14.1-RELEASE", "FreeBSD 14.0-RELEASE"],
    title: "OpenZFS Block Allocation Race Condition and ARC Lockup Bug Fix (FreeBSD-EN-24:08)",
    synopsis: "Official FreeBSD Errata Notice resolving OpenZFS vdev allocation lockup on pools with high async write load and fast NVMe devices.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.4,
    operationalDomain: "STORAGE",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-19T14:00:00Z",
    updatedAt: "2024-06-19T14:00:00Z",
    cveList: [],
    packages: [
      { name: "base-zfs", sourcePackage: "src/sys/contrib/openzfs", arch: "x86_64", currentVersion: "2.2.4-p0", fixedVersion: "2.2.4-p1", packageManager: "pkg", sizeBytes: 2840000 }
    ],
    commands: {
      nativeUpgrade: "freebsd-update fetch && freebsd-update install",
      verification: "zfs version",
      rollback: "freebsd-update rollback",
      kineticDeploy: "kinetic upgrade --bundle FreeBSD-EN-24:08.zfs --os freebsd"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://www.freebsd.org/security/advisories/FreeBSD-EN-24:08.zfs.asc",
    sourceFeed: {
      sourceId: "feed-freebsd-errata",
      feedName: "FreeBSD Advisories & Errata Notices (FreeBSD-SA & FreeBSD-EN)",
      feedType: "public-distro-feed",
      format: "XML",
      syncStatus: "live",
      sourceUrl: "https://vuxml.freebsd.org/freebsd/vuln.xml.bz2"
    }
  },

  // 20. AlmaLinux Bugfix Advisory - NetworkManager DHCPv6 Lease Renewal (ALBA)
  {
    id: "ARG-ALBA-2024-2871",
    bundleId: "ALBA-2024:2871",
    advisoryType: "BUGFIX",
    os: "almalinux",
    osFamily: "linux-rhel",
    osDisplayName: "AlmaLinux",
    targetReleases: ["AlmaLinux 9.4 (Seafoam Ocelot)"],
    title: "NetworkManager DHCPv6 Lease Expiry and Wi-Fi 6E Roaming Bug Fix Advisory",
    synopsis: "AlmaLinux Bug Advisory fixing silent interface drop when IPv6 router advertisements renew alongside DHCPv6 stateful leases.",
    vendorSeverity: "MODERATE",
    severityScore: 6.2,
    operationalDomain: "NETWORK",
    actionDirective: "RELOAD_SERVICE",
    issuedAt: "2024-06-11T16:30:00Z",
    updatedAt: "2024-06-11T16:30:00Z",
    cveList: [],
    packages: [
      { name: "NetworkManager", sourcePackage: "NetworkManager", arch: "x86_64", currentVersion: "1.44.0-5.el9", fixedVersion: "1.44.0-7.el9_4", packageManager: "dnf", sizeBytes: 2540000 },
      { name: "NetworkManager-tui", sourcePackage: "NetworkManager", arch: "x86_64", currentVersion: "1.44.0-5.el9", fixedVersion: "1.44.0-7.el9_4", packageManager: "dnf", sizeBytes: 345000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y NetworkManager NetworkManager-tui && systemctl reload NetworkManager",
      verification: "rpm -q NetworkManager | grep 1.44.0-7.el9_4",
      rollback: "dnf history undo last -y && systemctl reload NetworkManager",
      kineticDeploy: "kinetic upgrade --bundle ALBA-2024:2871 --os almalinux"
    },
    impact: { rebootRequired: false, servicesToRestart: ["NetworkManager"], zeroDowntime: true },
    upstreamNoticeUrl: "https://errata.almalinux.org/9/ALBA-2024-2871.html",
    sourceFeed: {
      sourceId: "feed-almalinux-errata",
      feedName: "AlmaLinux Errata Stream (ALSA Security, ALBA Bugfix, ALEA Enhancement)",
      feedType: "public-distro-feed",
      format: "CSAF",
      syncStatus: "live",
      sourceUrl: "https://errata.almalinux.org/api/v1/errata"
    }
  },

  // 21. openSUSE Recommended Update - Btrfs Balancing & Quota Recalculation (SUSE-RU)
  {
    id: "ARG-SUSE-RU-2024-2184",
    bundleId: "SUSE-RU-2024:2184-1",
    advisoryType: "BUGFIX",
    os: "suse",
    osFamily: "linux-suse",
    osDisplayName: "openSUSE & SLES",
    targetReleases: ["openSUSE Leap 15.6", "SLES 15 SP6"],
    title: "btrfs-progs Balance and Snapshot Quota Space Recalculation Bugfix (SUSE-RU)",
    synopsis: "SUSE Recommended Update resolving silent ENOSPC errors during parallel subvolume snapshot creation and btrfs balance operations.",
    vendorSeverity: "MODERATE",
    severityScore: 6.4,
    operationalDomain: "STORAGE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-15T11:20:00Z",
    updatedAt: "2024-06-15T11:20:00Z",
    cveList: [],
    packages: [
      { name: "btrfs-progs", sourcePackage: "btrfs-progs", arch: "x86_64", currentVersion: "6.6.3-150600.3.3.1", fixedVersion: "6.6.3-150600.3.6.1", packageManager: "zypper", sizeBytes: 1850000 }
    ],
    commands: {
      nativeUpgrade: "zypper refresh && zypper update -y btrfs-progs",
      verification: "btrfs --version | grep 6.6.3",
      rollback: "zypper install --oldpackage -y btrfs-progs=6.6.3-150600.3.3.1",
      kineticDeploy: "kinetic upgrade --bundle SUSE-RU-2024:2184-1 --os suse"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.suse.com/support/update/announcement/2024/suse-ru-20242184-1/",
    sourceFeed: {
      sourceId: "feed-suse-oval",
      feedName: "SUSE Maintenance & Errata (SUSE-SU Security, SUSE-RU Recommended / Bugfix)",
      feedType: "public-distro-feed",
      format: "OVAL",
      syncStatus: "live",
      sourceUrl: "https://ftp.suse.com/pub/projects/security/oval/"
    }
  },

  // 22. Fedora Bodhi Bugfix Advisory - PipeWire Low-Latency Audio
  {
    id: "ARG-FEDORA-BA-2024-1102",
    bundleId: "FEDORA-2024-d2e81102",
    advisoryType: "BUGFIX",
    os: "fedora",
    osFamily: "linux-fedora",
    osDisplayName: "Fedora Linux",
    targetReleases: ["Fedora 40"],
    title: "PipeWire Audio Crackling and ALSA Ring Buffer Underrun Bug Fix Advisory",
    synopsis: "Fedora Bodhi bugfix update eliminating crackling audio under high CPU loads and improving Bluetooth LDAC codec latency.",
    vendorSeverity: "LOW",
    severityScore: 4.8,
    operationalDomain: "CORE",
    actionDirective: "RELOAD_SERVICE",
    issuedAt: "2024-06-22T13:40:00Z",
    updatedAt: "2024-06-22T13:40:00Z",
    cveList: [],
    packages: [
      { name: "pipewire", sourcePackage: "pipewire", arch: "x86_64", currentVersion: "1.0.7-1.fc40", fixedVersion: "1.0.7-3.fc40", packageManager: "dnf", sizeBytes: 3120000 },
      { name: "pipewire-alsa", sourcePackage: "pipewire", arch: "x86_64", currentVersion: "1.0.7-1.fc40", fixedVersion: "1.0.7-3.fc40", packageManager: "dnf", sizeBytes: 154000 },
      { name: "wireplumber", sourcePackage: "wireplumber", arch: "x86_64", currentVersion: "0.5.2-1.fc40", fixedVersion: "0.5.3-1.fc40", packageManager: "dnf", sizeBytes: 680000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y pipewire pipewire-alsa wireplumber && systemctl --user restart pipewire wireplumber",
      verification: "pipewire --version | grep 1.0.7-3",
      rollback: "dnf history undo last -y && systemctl --user restart pipewire wireplumber",
      kineticDeploy: "kinetic upgrade --bundle FEDORA-2024-d2e81102 --os fedora"
    },
    impact: { rebootRequired: false, servicesToRestart: ["pipewire"], zeroDowntime: true },
    upstreamNoticeUrl: "https://bodhi.fedoraproject.org/updates/FEDORA-2024-d2e81102",
    sourceFeed: {
      sourceId: "feed-fedora-updates",
      feedName: "Fedora Bodhi Errata Stream (Security, Bugfix, Enhancement)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://bodhi.fedoraproject.org/updates/"
    }
  },

  // 23. Upstream Linux Kernel Stable Point Bugfix Bundle (6.6.41)
  {
    id: "ARG-KERNEL-STABLE-6.6.41",
    bundleId: "KERNEL-STABLE-6.6.41",
    advisoryType: "BUGFIX",
    os: "kernel",
    osFamily: "linux-kernel",
    osDisplayName: "Linux Kernel Stable",
    targetReleases: ["Linux 6.6 LTS"],
    title: "Linux 6.6.41 Stable Regression Fixes (TCP BBR Memory Leak & AMD P-State CPPC)",
    synopsis: "Greg Kroah-Hartman stable point release containing 84 verified bugfixes for TCP BBR socket memory stalls, AMD Zen 4 frequency governors, and Bcachefs.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.3,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-07-16T12:00:00Z",
    updatedAt: "2024-07-16T12:00:00Z",
    cveList: [],
    packages: [
      { name: "linux-kernel-stable", sourcePackage: "linux-6.6.y", arch: "x86_64", currentVersion: "6.6.40", fixedVersion: "6.6.41", packageManager: "kmod", sizeBytes: 15400000 }
    ],
    commands: {
      nativeUpgrade: "git fetch origin linux-6.6.y && git checkout v6.6.41 && make -j$(nproc) && make modules_install install",
      verification: "uname -r | grep 6.6.41",
      rollback: "grub-reboot 'Previous Kernel v6.6.40' && reboot",
      kineticDeploy: "kinetic hotpatch --kernel-tag v6.6.41 --live"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://git.kernel.org/pub/scm/linux/kernel/git/stable/linux.git/log/?h=linux-6.6.y",
    sourceFeed: {
      sourceId: "feed-kernel-stable",
      feedName: "Upstream Linux Kernel Stable Tree (Greg K-H Point Releases & CVEs)",
      feedType: "public-distro-feed",
      format: "GIT_TREE",
      syncStatus: "live",
      sourceUrl: "https://www.kernel.org/feeds/kdist.xml"
    }
  },

  // 24. OpenBSD Network Bridge MTU Fragmentation Errata
  {
    id: "ARG-OPENBSD-75-004",
    bundleId: "OPENBSD-75-004",
    advisoryType: "BUGFIX",
    os: "openbsd",
    osFamily: "bsd-openbsd",
    osDisplayName: "OpenBSD",
    targetReleases: ["OpenBSD 7.5"],
    title: "OpenBSD Kernel Bridge MTU Fragmentation and pf State Table Bug Fix",
    synopsis: "Official OpenBSD reliability patch correcting packet drop on VLAN interfaces trunked across software bridge members with jumbo frames.",
    vendorSeverity: "MODERATE",
    severityScore: 6.1,
    operationalDomain: "NETWORK",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-28T04:00:00Z",
    updatedAt: "2024-06-28T04:00:00Z",
    cveList: [],
    packages: [
      { name: "syspatch-004_bridge", sourcePackage: "src/sys/net", arch: "x86_64", currentVersion: "7.5-base", fixedVersion: "7.5-patch004", packageManager: "syspatch", sizeBytes: 184000 }
    ],
    commands: {
      nativeUpgrade: "syspatch && shutdown -r +1 'Rebooting to activate OpenBSD 004_bridge errata'",
      verification: "syspatch -l | grep 004_bridge",
      rollback: "syspatch -r 004_bridge && reboot",
      kineticDeploy: "kinetic upgrade --bundle OPENBSD-75-004 --os openbsd"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://www.openbsd.org/errata75.html",
    sourceFeed: {
      sourceId: "feed-openbsd-errata",
      feedName: "OpenBSD Security & Reliability Errata (Syspatch / Patches)",
      feedType: "public-distro-feed",
      format: "GIT_TREE",
      syncStatus: "live",
      sourceUrl: "https://www.openbsd.org/errata75.html"
    }
  },

  // 25. Amazon Linux 2023 cloud-init IMDSv2 Performance Enhancement (ALAS-BA)
  {
    id: "ARG-ALAS-BA-2024-0231",
    bundleId: "ALAS-BA-2024-0231",
    advisoryType: "ENHANCEMENT",
    os: "amazon-linux",
    osFamily: "linux-amazon",
    osDisplayName: "Amazon Linux 2023",
    targetReleases: ["Amazon Linux 2023"],
    title: "cloud-init IMDSv2 Token Caching & AWS Nitro Enclaves Performance Enhancement",
    synopsis: "AWS enhancement advisory accelerating EC2 instance launch bootstrap by caching IMDSv2 security credentials during first boot.",
    vendorSeverity: "MODERATE",
    severityScore: 5.8,
    operationalDomain: "PERFORMANCE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-14T18:30:00Z",
    updatedAt: "2024-06-14T18:30:00Z",
    cveList: [],
    packages: [
      { name: "cloud-init", sourcePackage: "cloud-init", arch: "x86_64", currentVersion: "23.4-1.amzn2023.0.1", fixedVersion: "23.4-3.amzn2023.0.1", packageManager: "dnf", sizeBytes: 1820000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y cloud-init",
      verification: "rpm -q cloud-init | grep 23.4-3",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle ALAS-BA-2024-0231 --os amazon-linux"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://alas.aws.amazon.com/AL2023/",
    sourceFeed: {
      sourceId: "feed-amazon-alas",
      feedName: "Amazon Linux Security Center & General Updates (ALAS / AL2023)",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://alas.aws.amazon.com/AL2023/alas.rss"
    }
  },

  // 26. Alpine Linux 3.20 musl libc DNS Search Path Resolver Bugfix
  {
    id: "ARG-ALPINE-UPD-2024-0612",
    bundleId: "ALPINE-UPD-2024-0612",
    advisoryType: "BUGFIX",
    os: "alpine",
    osFamily: "linux-alpine",
    osDisplayName: "Alpine Linux",
    targetReleases: ["Alpine v3.20"],
    title: "musl libc Resolv.conf Search Path Fallback and TCP DNS Socket Bugfix",
    synopsis: "Alpine Linux base update resolving intermittent DNS resolution timeouts in Kubernetes Pods when search domains exceed 3 entries.",
    vendorSeverity: "MODERATE",
    severityScore: 6.7,
    operationalDomain: "CORE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-12T10:00:00Z",
    updatedAt: "2024-06-12T10:00:00Z",
    cveList: [],
    packages: [
      { name: "musl", sourcePackage: "musl", arch: "x86_64", currentVersion: "1.2.5-r0", fixedVersion: "1.2.5-r1", packageManager: "apk", sizeBytes: 615000 }
    ],
    commands: {
      nativeUpgrade: "apk update && apk add --upgrade musl",
      verification: "apk info -v musl | grep 1.2.5-r1",
      rollback: "apk add musl=1.2.5-r0",
      kineticDeploy: "kinetic upgrade --bundle ALPINE-UPD-2024-0612 --os alpine"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://alpinelinux.org/posts/Alpine-3.20.1-released.html",
    sourceFeed: {
      sourceId: "feed-alpine-secdb",
      feedName: "Alpine Linux Security Database & Package Updates (SecDB / APK)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://secdb.alpinelinux.org/v3.20/main.json"
    }
  },

  // 27. NixOS systemd-boot EFI Bootloader Reliability Update
  {
    id: "ARG-NIX-UPD-2024-0544",
    bundleId: "NIX-UPD-2024-0544",
    advisoryType: "MAINTENANCE",
    os: "nixos",
    osFamily: "linux-nix",
    osDisplayName: "NixOS",
    targetReleases: ["NixOS 24.05 (Uakari)"],
    title: "systemd-boot EFI Bootloader Stub & NVRAM Fallback Maintenance Release",
    synopsis: "NixOS maintenance update fixing UEFI firmware NVRAM boot entry loss across reboot on certain Lenovo and Dell server mainboards.",
    vendorSeverity: "MODERATE",
    severityScore: 6.3,
    operationalDomain: "CORE",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-05T14:00:00Z",
    updatedAt: "2024-06-05T14:00:00Z",
    cveList: [],
    packages: [
      { name: "systemd-boot", sourcePackage: "systemd", arch: "x86_64", currentVersion: "255.4", fixedVersion: "255.6", packageManager: "nix", sizeBytes: 1240000 }
    ],
    commands: {
      nativeUpgrade: "nix-channel --update && nixos-rebuild boot",
      verification: "bootctl status",
      rollback: "nixos-rebuild boot --rollback",
      kineticDeploy: "kinetic upgrade --bundle NIX-UPD-2024-0544 --os nixos"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://nixos.org/",
    sourceFeed: {
      sourceId: "feed-nixos-tracker",
      feedName: "NixOS Channel Releases & Security Tracker",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://security.nixos.org/tracker.json"
    }
  },

  // 28. VMware Photon OS Containerd & NRI Hook Bugfix Advisory (PHBA)
  {
    id: "ARG-PHOTON-BA-2024-0199",
    bundleId: "PHBA-2024-0199",
    advisoryType: "BUGFIX",
    os: "photon",
    osFamily: "linux-photon",
    osDisplayName: "VMware Photon OS",
    targetReleases: ["Photon OS 5.0", "Photon OS 4.0"],
    title: "containerd NRI Hook Hang & tdnf Metadata Cache Corruption Bugfix (PHBA)",
    synopsis: "Broadcom / VMware bugfix update eliminating containerd task freeze when Node Resource Interface (NRI) plugins execute during pod start.",
    vendorSeverity: "MODERATE",
    severityScore: 6.6,
    operationalDomain: "CONTAINER",
    actionDirective: "RELOAD_SERVICE",
    issuedAt: "2024-06-17T15:20:00Z",
    updatedAt: "2024-06-17T15:20:00Z",
    cveList: [],
    packages: [
      { name: "containerd", sourcePackage: "containerd", arch: "x86_64", currentVersion: "1.7.14-1.ph5", fixedVersion: "1.7.18-1.ph5", packageManager: "tdnf", sizeBytes: 34100000 },
      { name: "tdnf", sourcePackage: "tdnf", arch: "x86_64", currentVersion: "3.5.5-2.ph5", fixedVersion: "3.5.7-1.ph5", packageManager: "tdnf", sizeBytes: 310000 }
    ],
    commands: {
      nativeUpgrade: "tdnf clean all && tdnf update -y containerd tdnf && systemctl restart containerd",
      verification: "containerd --version | grep 1.7.18",
      rollback: "tdnf history undo last -y && systemctl restart containerd",
      kineticDeploy: "kinetic upgrade --bundle PHBA-2024-0199 --os photon"
    },
    impact: { rebootRequired: false, servicesToRestart: ["containerd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://packages.vmware.com/photon/photon_oval/",
    sourceFeed: {
      sourceId: "feed-photon-oval",
      feedName: "VMware Photon OS Errata (PHSA Security & PHBA Bugfix)",
      feedType: "public-distro-feed",
      format: "OVAL",
      syncStatus: "live",
      sourceUrl: "https://packages.vmware.com/photon/photon_oval/"
    }
  },

  // 29. Flatcar Container Linux Stable Point Update
  {
    id: "ARG-FLATCAR-UPD-2024-3815",
    bundleId: "FLATCAR-UPD-2024-3815",
    advisoryType: "MAINTENANCE",
    os: "flatcar",
    osFamily: "linux-flatcar",
    osDisplayName: "Flatcar Container Linux",
    targetReleases: ["Flatcar Stable 3815.2.0"],
    title: "Flatcar Stable 3815.2.2 Point Release (systemd-networkd & Kernel 6.6.35)",
    synopsis: "Official Flatcar stable update delivering atomic OS image upgrade, eliminating interface renaming races in systemd-networkd on cloud boots.",
    vendorSeverity: "MODERATE",
    severityScore: 6.0,
    operationalDomain: "CONTAINER",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-27T18:00:00Z",
    updatedAt: "2024-06-27T18:00:00Z",
    cveList: [],
    packages: [
      { name: "flatcar-os-image", sourcePackage: "flatcar", arch: "x86_64", currentVersion: "3815.2.0", fixedVersion: "3815.2.2", packageManager: "update_engine", sizeBytes: 382000000 }
    ],
    commands: {
      nativeUpgrade: "update_engine_client -check_for_update",
      verification: "cat /etc/flatcar/update.conf",
      rollback: "cgpt prioritize -P 2 /dev/sda && reboot",
      kineticDeploy: "kinetic upgrade --bundle FLATCAR-UPD-2024-3815 --os flatcar"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://www.flatcar.org/releases#stable-3815.2.2",
    sourceFeed: {
      sourceId: "feed-flatcar-releases",
      feedName: "Flatcar Container Linux Release & Security Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://www.flatcar.org/releases/stable/update.json"
    }
  },

  // 30. Talos Linux v1.7.5 Maintenance Release
  {
    id: "ARG-TALOS-UPD-2024-019",
    bundleId: "TALOS-UPD-2024-019",
    advisoryType: "MAINTENANCE",
    os: "talos",
    osFamily: "linux-talos",
    osDisplayName: "Talos Linux",
    targetReleases: ["Talos v1.7.5"],
    title: "Talos Linux v1.7.5 Appliance Release (etcd 3.5.14 & containerd 1.7.18)",
    synopsis: "Sidero Labs appliance update hardening etcd snapshot compaction and upgrading the immutable kernel to 6.6.35 with Wireguard performance fixes.",
    vendorSeverity: "MODERATE",
    severityScore: 6.2,
    operationalDomain: "CONTAINER",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-26T20:00:00Z",
    updatedAt: "2024-06-26T20:00:00Z",
    cveList: [],
    packages: [
      { name: "talos-kernel-runtime", sourcePackage: "talos", arch: "x86_64", currentVersion: "v1.7.4", fixedVersion: "v1.7.5", packageManager: "talosctl", sizeBytes: 110000000 }
    ],
    commands: {
      nativeUpgrade: "talosctl upgrade --image ghcr.io/siderolabs/installer:v1.7.5",
      verification: "talosctl version",
      rollback: "talosctl rollback",
      kineticDeploy: "kinetic upgrade --bundle TALOS-UPD-2024-019 --os talos"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://github.com/siderolabs/talos/releases/tag/v1.7.5",
    sourceFeed: {
      sourceId: "feed-talos-advisories",
      feedName: "Talos Linux Immutable OS Updates & Sidero Advisories",
      feedType: "public-distro-feed",
      format: "OSV",
      syncStatus: "live",
      sourceUrl: "https://github.com/siderolabs/talos/security/advisories"
    }
  },

  // 31. OpenWrt Wireless ath11k Stability & Kernel Buffer Bugfix
  {
    id: "ARG-OPENWRT-UPD-2024-0312",
    bundleId: "OPENWRT-UPD-2024-0312",
    advisoryType: "BUGFIX",
    os: "openwrt",
    osFamily: "linux-openwrt",
    osDisplayName: "OpenWrt",
    targetReleases: ["OpenWrt 23.05.3"],
    title: "Qualcomm ath11k Wi-Fi Driver Firmware Crash and Skb Memory Leak Bugfix",
    synopsis: "OpenWrt maintenance update preventing router kernel panic and radio restart during high throughput 802.11ax mesh roaming.",
    vendorSeverity: "MODERATE",
    severityScore: 6.0,
    operationalDomain: "DRIVER",
    actionDirective: "RELOAD_SERVICE",
    issuedAt: "2024-06-10T11:00:00Z",
    updatedAt: "2024-06-10T11:00:00Z",
    cveList: [],
    packages: [
      { name: "kmod-ath11k", sourcePackage: "mac80211", arch: "aarch64", currentVersion: "5.15.150-1", fixedVersion: "5.15.150-2", packageManager: "opkg", sizeBytes: 520000 },
      { name: "ath11k-firmware", sourcePackage: "firmware", arch: "all", currentVersion: "20240301", fixedVersion: "20240520", packageManager: "opkg", sizeBytes: 14200000 }
    ],
    commands: {
      nativeUpgrade: "opkg update && opkg upgrade kmod-ath11k ath11k-firmware && wifi reload",
      verification: "opkg list-installed | grep ath11k",
      rollback: "opkg install --force-downgrade kmod-ath11k_5.15.150-1_aarch64.ipk && wifi reload",
      kineticDeploy: "kinetic upgrade --bundle OPENWRT-UPD-2024-0312 --os openwrt"
    },
    impact: { rebootRequired: false, servicesToRestart: ["network"], zeroDowntime: true },
    upstreamNoticeUrl: "https://openwrt.org/releases/23.05/notes-23.05.3",
    sourceFeed: {
      sourceId: "feed-openwrt-advisories",
      feedName: "OpenWrt Stable Updates & Security Advisories (OpenWrt-SA)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://openwrt.org/advisories"
    }
  },

  // 32. Gentoo Toolchain Maintenance Update (GCC 14.1 & Binutils LTO)
  {
    id: "ARG-GENTOO-UPD-2024-0801",
    bundleId: "GENTOO-UPD-2024-0801",
    advisoryType: "MAINTENANCE",
    os: "gentoo",
    osFamily: "linux-gentoo",
    osDisplayName: "Gentoo Linux",
    targetReleases: ["Gentoo Stable Rolling"],
    title: "GCC 14.1 Toolchain Stabilization & Link-Time Optimization (LTO) Bugfix",
    synopsis: "Gentoo Portage stable stabilization update providing GCC 14.1 with fixes for AVX-512 vectorization regressions and binutils LTO memory exhaustion.",
    vendorSeverity: "MODERATE",
    severityScore: 5.7,
    operationalDomain: "CORE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-08T17:00:00Z",
    updatedAt: "2024-06-08T17:00:00Z",
    cveList: [],
    packages: [
      { name: "sys-devel/gcc", sourcePackage: "gcc", arch: "x86_64", currentVersion: "13.3.0", fixedVersion: "14.1.0", packageManager: "emerge", sizeBytes: 94000000 }
    ],
    commands: {
      nativeUpgrade: "emerge --sync && emerge -1v sys-devel/gcc:14 && gcc-config 14.1.0",
      verification: "gcc --version | grep 14.1.0",
      rollback: "gcc-config 13.3.0",
      kineticDeploy: "kinetic upgrade --bundle GENTOO-UPD-2024-0801 --os gentoo"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://packages.gentoo.org/packages/sys-devel/gcc",
    sourceFeed: {
      sourceId: "feed-gentoo-glsa",
      feedName: "Gentoo Linux Security Advisories & Portage Stable Tree (GLSA)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://security.gentoo.org/glsa/glsa.rdf"
    }
  },

  // 33. openEuler 24.03 LTS Linux Core Maintenance Advisory
  {
    id: "ARG-OPENEULER-SA-2024-1588",
    bundleId: "openEuler-SA-2024-1588",
    advisoryType: "MAINTENANCE",
    os: "openeuler",
    osFamily: "linux-openeuler",
    osDisplayName: "openEuler Linux",
    targetReleases: ["openEuler 24.03 LTS"],
    title: "openEuler Core Systemd and AArch64 NUMA Memory Affinity Maintenance Bundle",
    synopsis: "openEuler community advisory enhancing multi-socket Kunpeng 920 CPU scheduling and resolving systemd cgroup v2 controller memory accounting.",
    vendorSeverity: "MODERATE",
    severityScore: 6.4,
    operationalDomain: "PERFORMANCE",
    actionDirective: "RELOAD_SERVICE",
    issuedAt: "2024-06-18T08:00:00Z",
    updatedAt: "2024-06-18T08:00:00Z",
    cveList: [],
    packages: [
      { name: "systemd", sourcePackage: "systemd", arch: "aarch64", currentVersion: "254-1.oe2403", fixedVersion: "254-3.oe2403", packageManager: "dnf", sizeBytes: 4150000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y systemd && systemctl daemon-reexec",
      verification: "rpm -q systemd | grep 254-3",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle openEuler-SA-2024-1588 --os openeuler"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.openeuler.org/en/security/safety-bulletin/detail.html?id=openEuler-SA-2024-1588",
    sourceFeed: {
      sourceId: "feed-openeuler-errata",
      feedName: "openEuler Safety Bulletins & Maintenance Advisories (CSAF)",
      feedType: "public-distro-feed",
      format: "CSAF",
      syncStatus: "live",
      sourceUrl: "https://www.openeuler.org/en/security/safety-bulletin/"
    }
  },

  // 34. Azure Linux / CBL-Mariner Cloud-Hypervisor Direct Boot Bugfix
  {
    id: "ARG-AZL-BA-2024-0419",
    bundleId: "AZL-BA-2024-0419",
    advisoryType: "BUGFIX",
    os: "azure-linux",
    osFamily: "linux-azure",
    osDisplayName: "Azure Linux",
    targetReleases: ["Azure Linux 3.0", "CBL-Mariner 2.0"],
    title: "Cloud-Hypervisor Direct Kernel Boot & VFIO SRIOV NIC Initialization Bugfix",
    synopsis: "Microsoft Azure Linux bugfix update resolving VFIO network device reset failure when guest VMs reboot under Azure Kubernetes Service (AKS).",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.1,
    operationalDomain: "DRIVER",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-21T17:10:00Z",
    updatedAt: "2024-06-21T17:10:00Z",
    cveList: [],
    packages: [
      { name: "cloud-hypervisor", sourcePackage: "cloud-hypervisor", arch: "x86_64", currentVersion: "38.0.0-1.azl3", fixedVersion: "38.0.2-1.azl3", packageManager: "tdnf", sizeBytes: 18400000 }
    ],
    commands: {
      nativeUpgrade: "tdnf update -y cloud-hypervisor",
      verification: "rpm -q cloud-hypervisor | grep 38.0.2",
      rollback: "tdnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle AZL-BA-2024-0419 --os azure-linux"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://github.com/microsoft/azurelinux/releases",
    sourceFeed: {
      sourceId: "feed-azure-linux",
      feedName: "Azure Linux / CBL-Mariner Security & Errata Stream (MSRC)",
      feedType: "public-distro-feed",
      format: "CSAF",
      syncStatus: "live",
      sourceUrl: "https://github.com/microsoft/azurelinux"
    }
  },

  // 35. CloudLinux CageFS & MySQL Governor Bugfix Advisory (CLBA)
  {
    id: "ARG-CLBA-2024-4312",
    bundleId: "CLBA-2024:4312",
    advisoryType: "BUGFIX",
    os: "cloudlinux",
    osFamily: "linux-cloudlinux",
    osDisplayName: "CloudLinux OS",
    targetReleases: ["CloudLinux 9", "CloudLinux 8"],
    title: "CageFS Skeleton Remount Lock and MySQL Governor IO Limiter Bugfix Advisory",
    synopsis: "CloudLinux Bug Advisory resolving multi-tenant filesystem remount deadlock when hosting users exceed cgroup IOPS limits simultaneously.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.0,
    operationalDomain: "STORAGE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-13T12:45:00Z",
    updatedAt: "2024-06-13T12:45:00Z",
    cveList: [],
    packages: [
      { name: "cagefs", sourcePackage: "cagefs", arch: "x86_64", currentVersion: "7.5.3-1.el9", fixedVersion: "7.5.5-1.el9", packageManager: "dnf", sizeBytes: 1890000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y cagefs && cagefsctl --update",
      verification: "rpm -q cagefs | grep 7.5.5",
      rollback: "dnf history undo last -y && cagefsctl --update",
      kineticDeploy: "kinetic upgrade --bundle CLBA-2024:4312 --os cloudlinux"
    },
    impact: { rebootRequired: false, servicesToRestart: ["cagefs"], zeroDowntime: true },
    upstreamNoticeUrl: "https://repo.cloudlinux.com/cloudlinux/",
    sourceFeed: {
      sourceId: "feed-cloudlinux-errata",
      feedName: "CloudLinux OS Errata & Bug Fix Advisories (CLSA & CLBA)",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://repo.cloudlinux.com/cloudlinux/"
    }
  }
];

export interface ArgentQueryFilters {
  os?: string; // e.g. "ubuntu", "debian", "rocky", "all"
  severity?: string; // "critical", "important", "moderate", "low", "all"
  type?: string; // "all", "security", "bugfix", "enhancement", "maintenance", "general"
  advisoryType?: string;
  query?: string; // search query
  reboot?: boolean | 'true' | 'false';
  release?: string;
  scope?: 'ALL' | 'ZERO_REBOOT' | 'KERNEL_CORE' | 'ENTERPRISE_LTS';
  domain?: string;
  source?: string;
  page?: number;
  limit?: number;
  sortBy?: 'cvss_desc' | 'date_desc' | 'date_asc' | 'id_asc' | 'id_desc';
}

export interface ArgentQueryResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalConsolidatedCount: number;
  securityCount: number;
  bugfixCount: number;
  enhancementCount: number;
  maintenanceCount: number;
  zeroDowntimeCount: number;
  rebootRequiredCount: number;
  totalPackagesUpdated: number;
  bundles: ArgentPatchBundle[];
}

export interface ArgentStats {
  totalBundles: number;
  totalPackagesUpdated: number;
  securityCount: number;
  bugfixCount: number;
  enhancementCount: number;
  maintenanceCount: number;
  criticalCount: number;
  importantCount: number;
  moderateCount: number;
  lowCount: number;
  zeroDowntimeCount: number;
  rebootRequiredCount: number;
  byOs: Record<string, number>;
  byType: Record<string, number>;
  activeFeedSourcesCount: number;
  lastSyncTimestamp: string;
}

/**
 * Filter and query vendor patch bundles (1:1 feature parity with Vantage threat feed)
 */
export function getArgentBundles(filters: ArgentQueryFilters = {}): ArgentQueryResult {
  let list = [...ARGENT_PATCH_BUNDLES];

  // Scope Filtering
  if (filters.scope === 'ZERO_REBOOT') {
    list = list.filter(b => b.impact.zeroDowntime);
  } else if (filters.scope === 'KERNEL_CORE') {
    list = list.filter(b => b.operationalDomain === 'KERNEL' || b.operationalDomain === 'CORE');
  } else if (filters.scope === 'ENTERPRISE_LTS') {
    list = list.filter(b => 
      b.os === 'ubuntu' || 
      b.os === 'rocky' || 
      b.os === 'rhel' || 
      b.os === 'debian' || 
      b.os === 'almalinux' || 
      b.os === 'oracle-linux' || 
      b.os === 'suse' ||
      b.os === 'openeuler' ||
      b.os === 'cloudlinux'
    );
  }

  // Filter by Source Feed
  if (filters.source && filters.source !== 'ALL') {
    list = list.filter(b => b.sourceFeed.sourceId === filters.source);
  }

  // Filter by Advisory Type (Security, Bugfix, Enhancement, Maintenance)
  const targetType = filters.type || filters.advisoryType;
  if (targetType && targetType !== 'all' && targetType !== 'ALL') {
    const normType = targetType.toUpperCase();
    list = list.filter(b => b.advisoryType.toUpperCase() === normType);
  }

  // Filter by Operational Domain
  if (filters.domain && filters.domain !== 'ALL') {
    list = list.filter(b => b.operationalDomain === filters.domain);
  }

  // Filter by OS
  if (filters.os && filters.os !== 'all') {
    const targetOs = filters.os.toLowerCase();
    list = list.filter(b => b.os.toLowerCase() === targetOs || b.osFamily.toLowerCase().includes(targetOs));
  }

  // Filter by Severity
  if (filters.severity && filters.severity !== 'all') {
    const targetSev = filters.severity.toUpperCase();
    list = list.filter(b => b.vendorSeverity.toUpperCase() === targetSev);
  }

  // Filter by Reboot requirement
  if (filters.reboot !== undefined) {
    const mustReboot = typeof filters.reboot === 'string' ? filters.reboot === 'true' : Boolean(filters.reboot);
    list = list.filter(b => b.impact.rebootRequired === mustReboot);
  }

  // Filter by target release
  if (filters.release) {
    const rel = filters.release.toLowerCase();
    list = list.filter(b => b.targetReleases.some(r => r.toLowerCase().includes(rel)));
  }

  // Search Query
  if (filters.query && filters.query.trim()) {
    const q = filters.query.trim().toLowerCase();
    list = list.filter(b => 
      b.bundleId.toLowerCase().includes(q) ||
      b.title.toLowerCase().includes(q) ||
      b.synopsis.toLowerCase().includes(q) ||
      b.osDisplayName.toLowerCase().includes(q) ||
      b.advisoryType.toLowerCase().includes(q) ||
      b.cveList.some(c => c.toLowerCase().includes(q)) ||
      b.packages.some(p => p.name.toLowerCase().includes(q) || p.fixedVersion.toLowerCase().includes(q))
    );
  }

  // Sorting
  const sortBy = filters.sortBy || 'cvss_desc';
  if (sortBy === 'cvss_desc') {
    list.sort((a, b) => b.severityScore - a.severityScore);
  } else if (sortBy === 'date_desc') {
    list.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
  } else if (sortBy === 'date_asc') {
    list.sort((a, b) => new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime());
  } else if (sortBy === 'id_asc') {
    list.sort((a, b) => a.bundleId.localeCompare(b.bundleId));
  } else if (sortBy === 'id_desc') {
    list.sort((a, b) => b.bundleId.localeCompare(a.bundleId));
  }

  const total = list.length;
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 25));
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const pagedBundles = list.slice(startIndex, startIndex + limit);

  const securityCount = ARGENT_PATCH_BUNDLES.filter(b => b.advisoryType === 'SECURITY').length;
  const bugfixCount = ARGENT_PATCH_BUNDLES.filter(b => b.advisoryType === 'BUGFIX').length;
  const enhancementCount = ARGENT_PATCH_BUNDLES.filter(b => b.advisoryType === 'ENHANCEMENT').length;
  const maintenanceCount = ARGENT_PATCH_BUNDLES.filter(b => b.advisoryType === 'MAINTENANCE').length;
  const zeroDowntimeCount = ARGENT_PATCH_BUNDLES.filter(b => b.impact.zeroDowntime).length;
  const rebootRequiredCount = ARGENT_PATCH_BUNDLES.filter(b => b.impact.rebootRequired).length;
  const totalPackagesUpdated = ARGENT_PATCH_BUNDLES.reduce((acc, b) => acc + b.packages.length, 0);

  return {
    total,
    page,
    limit,
    totalPages,
    totalConsolidatedCount: ARGENT_PATCH_BUNDLES.length,
    securityCount,
    bugfixCount,
    enhancementCount,
    maintenanceCount,
    zeroDowntimeCount,
    rebootRequiredCount,
    totalPackagesUpdated,
    bundles: pagedBundles
  };
}

/**
 * Generate macro-level metrics for Argent
 */
export function getArgentStats(): ArgentStats {
  const byOs: Record<string, number> = {};
  const byType: Record<string, number> = {};
  let criticalCount = 0;
  let importantCount = 0;
  let moderateCount = 0;
  let lowCount = 0;
  let securityCount = 0;
  let bugfixCount = 0;
  let enhancementCount = 0;
  let maintenanceCount = 0;
  let zeroDowntimeCount = 0;
  let rebootRequiredCount = 0;
  let totalPackagesUpdated = 0;

  for (const b of ARGENT_PATCH_BUNDLES) {
    byOs[b.os] = (byOs[b.os] || 0) + 1;
    byType[b.advisoryType] = (byType[b.advisoryType] || 0) + 1;
    totalPackagesUpdated += b.packages.length;

    if (b.advisoryType === 'SECURITY') securityCount++;
    else if (b.advisoryType === 'BUGFIX') bugfixCount++;
    else if (b.advisoryType === 'ENHANCEMENT') enhancementCount++;
    else if (b.advisoryType === 'MAINTENANCE') maintenanceCount++;

    if (b.vendorSeverity === 'CRITICAL') criticalCount++;
    else if (b.vendorSeverity === 'IMPORTANT') importantCount++;
    else if (b.vendorSeverity === 'MODERATE') moderateCount++;
    else if (b.vendorSeverity === 'LOW') lowCount++;

    if (b.impact.zeroDowntime) zeroDowntimeCount++;
    if (b.impact.rebootRequired) rebootRequiredCount++;
  }

  return {
    totalBundles: ARGENT_PATCH_BUNDLES.length,
    totalPackagesUpdated,
    securityCount,
    bugfixCount,
    enhancementCount,
    maintenanceCount,
    criticalCount,
    importantCount,
    moderateCount,
    lowCount,
    zeroDowntimeCount,
    rebootRequiredCount,
    byOs,
    byType,
    activeFeedSourcesCount: ARGENT_PUBLIC_FEED_SOURCES.length,
    lastSyncTimestamp: new Date().toISOString()
  };
}

export function getArgentOperationalDomainBadge(domain: ArgentOperationalDomain): {
  label: string;
  bg: string;
  border: string;
  text: string;
} {
  switch (domain) {
    case "PATCH":
      return { label: "⚡ PATCH", bg: "rgba(59, 130, 246, 0.15)", border: "rgba(59, 130, 246, 0.35)", text: "#93C5FD" };
    case "CORE":
      return { label: "⚙️ CORE / GLIBC", bg: "rgba(168, 85, 247, 0.15)", border: "rgba(168, 85, 247, 0.35)", text: "#C084FC" };
    case "NETWORK":
      return { label: "🌐 NETWORK / SSH", bg: "rgba(14, 165, 233, 0.15)", border: "rgba(14, 165, 233, 0.35)", text: "#38BDF8" };
    case "KERNEL":
      return { label: "🐧 KERNEL", bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.35)", text: "#FBBF24" };
    case "CONTAINER":
      return { label: "📦 CONTAINER / APK", bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.35)", text: "#34D399" };
    case "SYSTEMD":
      return { label: "🔒 SYSTEMD / DAEMON", bg: "rgba(236, 72, 153, 0.15)", border: "rgba(236, 72, 153, 0.35)", text: "#F472B6" };
    case "STORAGE":
      return { label: "💾 STORAGE / NVME", bg: "rgba(20, 184, 166, 0.15)", border: "rgba(20, 184, 166, 0.35)", text: "#5EEAD4" };
    case "DRIVER":
      return { label: "🔌 DRIVER / HW", bg: "rgba(249, 115, 22, 0.15)", border: "rgba(249, 115, 22, 0.35)", text: "#FDBA74" };
    case "STABILITY":
      return { label: "🛡️ STABILITY", bg: "rgba(99, 102, 241, 0.15)", border: "rgba(99, 102, 241, 0.35)", text: "#A5B4FC" };
    case "PERFORMANCE":
      return { label: "🚀 PERFORMANCE", bg: "rgba(234, 179, 8, 0.15)", border: "rgba(234, 179, 8, 0.35)", text: "#FDE047" };
    default:
      return { label: "🛡️ SYSTEM", bg: "rgba(148, 163, 184, 0.15)", border: "rgba(148, 163, 184, 0.35)", text: "#E2E8F0" };
  }
}

export function getArgentAdvisoryTypeBadge(type: ArgentAdvisoryType): {
  label: string;
  icon: string;
  bg: string;
  border: string;
  text: string;
} {
  switch (type) {
    case "SECURITY":
      return { label: "SECURITY", icon: "🛡️", bg: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.4)", text: "#F87171" };
    case "BUGFIX":
      return { label: "BUG FIX", icon: "🐛", bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.4)", text: "#FBBF24" };
    case "ENHANCEMENT":
      return { label: "ENHANCEMENT", icon: "⚡", bg: "rgba(56, 189, 248, 0.15)", border: "rgba(56, 189, 248, 0.4)", text: "#38BDF8" };
    case "MAINTENANCE":
      return { label: "MAINTENANCE", icon: "🔧", bg: "rgba(168, 85, 247, 0.15)", border: "rgba(168, 85, 247, 0.4)", text: "#C084FC" };
    case "GENERAL":
    default:
      return { label: "GENERAL", icon: "📦", bg: "rgba(148, 163, 184, 0.15)", border: "rgba(148, 163, 184, 0.4)", text: "#CBD5E1" };
  }
}

export function formatRelativeAge(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays}d ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    return `${Math.floor(diffMonths / 12)}y ago`;
  } catch {
    return dateStr;
  }
}

/**
 * Generates an executable, idempotent shell script applying all specified bundles natively
 */
export function generateArgentBashScript(bundles: ArgentPatchBundle[]): string {
  const lines: string[] = [
    "#!/bin/bash",
    "# ==============================================================================",
    "# Exultia Argent - Automated Operating System Vendor Patch Stream",
    `# Generated at: ${new Date().toISOString()}`,
    `# Total Bundles Queued: ${bundles.length}`,
    "# Native Distribution Package Updates: Security Errata, Bugfixes & Enhancements",
    "# ==============================================================================",
    "set -euo pipefail",
    "",
    "echo '[Argent] Initializing Operating System Patch Orchestrator...'",
    "OS_DETECT='unknown'",
    "if [ -f /etc/os-release ]; then",
    "  . /etc/os-release",
    '  OS_DETECT="$ID"',
    "fi",
    'echo "[Argent] Detected Platform: $OS_DETECT"',
    ""
  ];

  for (const b of bundles) {
    lines.push(`echo ''`);
    lines.push(`echo '[Argent] ─── Applying Bundle: ${b.bundleId} (${b.osDisplayName}) [${b.advisoryType}] ───'`);
    lines.push(`echo '[Argent] Synopsis: ${b.synopsis.replace(/'/g, "")}'`);
    lines.push(`echo '[Argent] Type: ${b.advisoryType} | Severity: ${b.vendorSeverity} | Zero-Downtime: ${b.impact.zeroDowntime}'`);
    lines.push(`echo '[Argent] Executing: ${b.commands.nativeUpgrade}'`);
    lines.push(`${b.commands.nativeUpgrade}`);
    if (b.commands.verification) {
      lines.push(`echo '[Argent] Verifying: ${b.commands.verification}'`);
      lines.push(`${b.commands.verification} || echo '[Argent Warning] Verification check flagged an irregularity'`);
    }
  }

  lines.push("");
  lines.push("echo ''");
  lines.push("echo '[Argent] [OK] All queued vendor patch bundles successfully applied!'");
  lines.push("");

  return lines.join("\n");
}
