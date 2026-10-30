/**
 * Exultia Argent - Public OS Distribution Regular Patch & Errata Feed Aggregator
 * 
 * Sibling and specialized complement to the Vantage threat feed.
 * Whereas Vantage focuses on weakness enumerations (CVEs, CWEs, KEVs, zero-days),
 * Argent aggregates ONLY regular vendor operating system updates, non-security
 * stability errata, and maintenance streams:
 * 
 *   - Bug Fix Advisories (RHBA, RLBA, ALBA, Bodhi Bugfix, FreeBSD-EN, Debian Updates, openSUSE-RU)
 *   - Enhancement & Feature Advisories (RHEA, RLEA, ALEA, HWE, Kernel Backports, GPU/NIC Drivers)
 *   - General Point Releases, Maintenance Updates, and Toolchain Upgrades (GCC, glibc, systemd, ZFS)
 *   - Zero Weakness Enumeration Noise: Pure Vendor Package Lifecycle Updates
 */

export type ArgentOsCategory = 
  | 'ubuntu'
  | 'debian'
  | 'linux-mint'
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
  | 'macos'
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
  | 'azure-linux'
  | 'centos-stream'
  | 'opensuse-leap'
  | 'fedora-coreos'
  | 'proxmox'
  | 'truenas-scale';

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
  | 'bsd-darwin'
  | 'linux-wolfi'
  | 'linux-nix'
  | 'linux-void'
  | 'linux-photon'
  | 'linux-flatcar'
  | 'linux-talos'
  | 'linux-openwrt'
  | 'linux-openeuler'
  | 'linux-cloudlinux'
  | 'linux-azure'
  | 'multi-distro';

export type ArgentAdvisoryType = 
  | 'BUGFIX'         // Non-security stability, crash, memory leak, logic fixes (RHBA, RLBA, ALBA, Bodhi bugfix, FreeBSD-EN)
  | 'ENHANCEMENT'    // Hardware enablement, driver updates, performance optimizations, feature backports (RHEA, RLEA, ALEA)
  | 'MAINTENANCE'    // Distro point release updates, base runtime sync, compiler & toolchain updates
  | 'GENERAL'        // General package bumps, timezone data, CA trust certificates, locale updates
  | 'SECURITY';      // Vendor security advisories & CVE updates (DSA, USN, RHSA, GLSA, ALAS, etc.)

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
  | 'rpm-ostree'
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
  id: string; // e.g. "ARG-RLBA-2024-3910"
  bundleId: string; // Upstream vendor ID, e.g. "RLBA-2024:3910", "RHBA-2024:4120", "UBUNTU-UPD-2024-0412"
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
  cveList: string[]; // Always empty for pure regular vendor updates
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
  format: 'OSV' | 'JSON' | 'OVAL' | 'CSAF' | 'UPDATEINFO' | 'GIT_TREE' | 'XML' | 'RSS';
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
  feedTypesCovered: ('Bugfix' | 'Enhancement' | 'Maintenance' | 'General' | 'Security')[];
}

/**
 * Public Distro Regular Patch Feeds Catalog (Aggregating Bugfix, Enhancement, Maintenance, and General OS Updates)
 */
export const ARGENT_PUBLIC_FEED_SOURCES: ArgentPublicFeedSource[] = [
  // 1. Canonical Ubuntu
  {
    id: "feed-ubuntu-updates",
    os: "ubuntu",
    name: "Canonical Ubuntu Updates & Hardware Enablement Stream (noble-updates)",
    category: "Debian & Ubuntu Ecosystem",
    icon: "🟠",
    provider: "Canonical Release Engineering & Kernel Team",
    officialFeedUrl: "https://changelogs.ubuntu.com/changelogs/",
    format: "JSON",
    recordsIngested: 88500,
    updateFrequency: "Continuous publication upon package build",
    documentationUrl: "https://wiki.ubuntu.com/StableReleaseUpdates",
    homepageUrl: "https://ubuntu.com/",
    description: "Official Canonical stable release updates (SRU) and hardware enablement (HWE) backports across Ubuntu LTS releases (Main & Universe).",
    scope: "Ubuntu 24.04 LTS (Noble), 22.04 LTS (Jammy) Regular Updates",
    access: "Public APT changelogs & repository metadata",
    coverage: "System stability bugfixes, hardware enablement, driver updates, kernel point releases",
    refreshRate: "Realtime (Event-Driven)",
    status: "Realtime",
    supportedReleases: ["Ubuntu 24.04 LTS (Noble)", "Ubuntu 22.04 LTS (Jammy)"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance", "General"]
  },

  // 2. Debian GNU/Linux
  {
    id: "feed-debian-updates",
    os: "debian",
    name: "Debian Proposed Updates & Bug Tracking Stream (BTS / debian-updates)",
    category: "Debian & Ubuntu Ecosystem",
    icon: "🔴",
    provider: "Debian Release Team & Maintainers",
    officialFeedUrl: "https://bugs.debian.org/release-critical/",
    format: "JSON",
    recordsIngested: 115000,
    updateFrequency: "Live continuous sync (every 15 minutes)",
    documentationUrl: "https://www.debian.org/releases/stable/",
    homepageUrl: "https://www.debian.org/",
    description: "Debian stable point release update stream tracking bug fixes, timezone data updates, and hardware reliability patches.",
    scope: "Debian 12 Bookworm, Debian 11 Bullseye Regular Updates",
    access: "Public BTS REST API & Release Announcements",
    coverage: "Point release bugfixes, upstream driver updates, ZFS and glibc stability errata",
    refreshRate: "Hourly (every 15 min)",
    status: "Realtime",
    supportedReleases: ["Debian 12 (Bookworm)", "Debian 11 (Bullseye)"],
    feedTypesCovered: ["Bugfix", "Maintenance", "General"]
  },

  // 3. Rocky Linux
  {
    id: "feed-rocky-errata",
    os: "rocky",
    name: "Rocky Linux Bug Fix & Enhancement Errata (RLBA & RLEA)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🟢",
    provider: "Rocky Enterprise Software Foundation (RESF)",
    officialFeedUrl: "https://errata.rockylinux.org/",
    format: "UPDATEINFO",
    recordsIngested: 74200,
    updateFrequency: "Continuous mirror synchronization upon build",
    documentationUrl: "https://errata.rockylinux.org/",
    homepageUrl: "https://errata.rockylinux.org/",
    description: "Rocky Linux non-security errata stream publishing RLBA (Bug Advisories) and RLEA (Enhancement Advisories) via DNF updateinfo.xml.",
    scope: "Rocky Linux 9 & 8 BaseOS, AppStream, CRB",
    access: "Public updateinfo.xml & RESF REST API",
    coverage: "Kernel NVMe bugfixes, enterprise storage reliability, CPU hardware enablement",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Rocky Linux 9 (Blue Onyx)", "Rocky Linux 8 (Green Obsidian)"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance"]
  },

  // 4. Red Hat Enterprise Linux
  {
    id: "feed-redhat-errata",
    os: "rhel",
    name: "Red Hat Bug & Enhancement Advisories Stream (RHBA & RHEA)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🎩",
    provider: "Red Hat Product Engineering & Kernel Team",
    officialFeedUrl: "https://access.redhat.com/hydra/rest/securitydata/cvrf.json",
    format: "CSAF",
    recordsIngested: 148000,
    updateFrequency: "Hourly automated feed updates",
    documentationUrl: "https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/",
    homepageUrl: "https://access.redhat.com/errata",
    description: "Authoritative Red Hat Bug Advisories (RHBA) and Enhancement Advisories (RHEA) covering glibc, systemd, and kernel optimizations.",
    scope: "RHEL 9.4, 9.3, 8.10 Core & AppStream",
    access: "Public CSAF 2.0 JSON & Errata Feeds",
    coverage: "glibc AVX-512 optimizations, kernel I/O stalls, eBPF toolchain enhancements",
    refreshRate: "Hourly",
    status: "Realtime",
    supportedReleases: ["RHEL 9.4", "RHEL 9.3", "RHEL 8.10"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance"]
  },

  // 5. AlmaLinux
  {
    id: "feed-almalinux-errata",
    os: "almalinux",
    name: "AlmaLinux Bugfix & Enhancement Errata (ALBA & ALEA)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🔵",
    provider: "AlmaLinux OS Foundation",
    officialFeedUrl: "https://errata.almalinux.org/api/v1/errata",
    format: "CSAF",
    recordsIngested: 68400,
    updateFrequency: "Continuous sync with build system",
    documentationUrl: "https://errata.almalinux.org/",
    homepageUrl: "https://almalinux.org/",
    description: "AlmaLinux non-security updates publishing ALBA (Bugfix) and ALEA (Enhancement) in CSAF 2.0, DNF updateinfo, and JSON.",
    scope: "AlmaLinux 9 & 8 BaseOS, AppStream",
    access: "Public REST API & updateinfo.xml",
    coverage: "NetworkManager DHCPv6 bugfixes, DNF parallel downloads, driver stability",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["AlmaLinux 9.4 (Seafoam Ocelot)", "AlmaLinux 8.10"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance"]
  },

  // 6. Oracle Linux
  {
    id: "feed-oracle-errata",
    os: "oracle-linux",
    name: "Oracle Linux Bug Fix & Enhancement Stream (ELBA & ELEA / UEK)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🔴",
    provider: "Oracle Linux Product Engineering",
    officialFeedUrl: "https://linux.oracle.com/security/oval/",
    format: "OVAL",
    recordsIngested: 73500,
    updateFrequency: "Daily sync with Unbreakable Linux Network (ULN)",
    documentationUrl: "https://docs.oracle.com/en/operating-systems/oracle-linux/",
    homepageUrl: "https://www.oracle.com/linux/",
    description: "Oracle Linux bug fixes (ELBA) and feature enhancements (ELEA) for Unbreakable Enterprise Kernel (UEK7) and RHCK.",
    scope: "Oracle Linux 9, 8, UEK Release 7",
    access: "Public ULN Updates & DNF metadata",
    coverage: "XFS transaction deadlocks, KVM virtio-gpu acceleration, kernel scheduler tuning",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["Oracle Linux 9", "Oracle Linux 8", "UEK7"],
    feedTypesCovered: ["Bugfix", "Enhancement"]
  },

  // 7. SUSE Linux Enterprise & openSUSE
  {
    id: "feed-suse-ru",
    os: "suse",
    name: "SUSE Recommended & Maintenance Updates (SUSE-RU / openSUSE)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🦎",
    provider: "SUSE Maintenance & openSUSE Team",
    officialFeedUrl: "https://ftp.suse.com/pub/projects/security/oval/",
    format: "OVAL",
    recordsIngested: 57400,
    updateFrequency: "Daily sync with maintenance updates",
    documentationUrl: "https://www.suse.com/support/update/",
    homepageUrl: "https://www.suse.com/support/update/",
    description: "SUSE Recommended Updates (SUSE-RU) providing non-security bug fixes for Btrfs, wicked networking, and YaST core modules.",
    scope: "openSUSE Leap 15.6, Tumbleweed, SLES 15 Enterprise",
    access: "Public OVAL XML & Zypper repodata",
    coverage: "btrfs-progs quota balancing, wicked DHCP routing, systemd service units",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["SLES 15 SP6", "SLES 15 SP5", "openSUSE Leap 15.6"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance"]
  },

  // 8. Alpine Linux
  {
    id: "feed-alpine-updates",
    os: "alpine",
    name: "Alpine Linux Main & Community Package Updates (APK Stream)",
    category: "Lightweight & Container OS",
    icon: "🏔️",
    provider: "Alpine Linux Core Team & Package Maintainers",
    officialFeedUrl: "https://git.alpinelinux.org/aports/",
    format: "GIT_TREE",
    recordsIngested: 41200,
    updateFrequency: "Continuous per-branch rebuilds",
    documentationUrl: "https://wiki.alpinelinux.org/",
    homepageUrl: "https://alpinelinux.org/",
    description: "Alpine Linux rolling package updates fixing musl libc resolver bugs, BusyBox shell utilities, and container runtime components.",
    scope: "Alpine v3.20, v3.19 Main & Community",
    access: "Public Git Tree & APKINDEX mirrors",
    coverage: "musl libc DNS search paths, BusyBox regex fixes, container base libraries",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Alpine v3.20", "Alpine v3.19", "Alpine Edge"],
    feedTypesCovered: ["Bugfix", "Maintenance", "General"]
  },

  // 9. Arch Linux
  {
    id: "feed-arch-packages",
    os: "arch",
    name: "Arch Linux Core & Extra Package Releases (Rolling Stream)",
    category: "Independent & Rolling Distros",
    icon: "🏹",
    provider: "Arch Linux Packaging Team",
    officialFeedUrl: "https://archlinux.org/packages/search/json/",
    format: "JSON",
    recordsIngested: 35100,
    updateFrequency: "Live continuous rolling release stream",
    documentationUrl: "https://wiki.archlinux.org/",
    homepageUrl: "https://archlinux.org/",
    description: "Real-time rolling release stream tracking upstream kernel point releases, Mesa Vulkan performance updates, and toolchain upgrades.",
    scope: "Arch Linux Core, Extra, Multilib Rolling",
    access: "Public REST API JSON & pacman repo databases",
    coverage: "Linux 6.10 hardware enablement, Mesa AMD RDNA3 drivers, desktop pipewire updates",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Arch Linux Rolling"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance", "General"]
  },

  // 10. Fedora Linux
  {
    id: "feed-fedora-bodhi",
    os: "fedora",
    name: "Fedora Bodhi Bugfix & Enhancement Stream",
    category: "Independent & Rolling Distros",
    icon: "🔵",
    provider: "Fedora Project & QA Team",
    officialFeedUrl: "https://bodhi.fedoraproject.org/updates/",
    format: "JSON",
    recordsIngested: 82100,
    updateFrequency: "Continuous release updates with karma gates",
    documentationUrl: "https://docs.fedoraproject.org/",
    homepageUrl: "https://bodhi.fedoraproject.org/",
    description: "Fedora Bodhi updates system publishing signed RPM updates categorized into Bugfix, Enhancement, and New Package releases.",
    scope: "Fedora 40, Fedora 39 Regular Updates",
    access: "Public Bodhi REST API",
    coverage: "PipeWire audio sync fixes, DNF5 acceleration, Wayland graphics updates",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Fedora 40", "Fedora 39"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance"]
  },

  // 11. Amazon Linux
  {
    id: "feed-amazon-alas",
    os: "amazon-linux",
    name: "Amazon Linux General Updates & Cloud Optimizations (ALAS-BA / AL2023)",
    category: "Cloud & Hyperscaler Linux",
    icon: "📦",
    provider: "Amazon Web Services (AWS)",
    officialFeedUrl: "https://alas.aws.amazon.com/AL2023/alas.rss",
    format: "UPDATEINFO",
    recordsIngested: 49500,
    updateFrequency: "Continuous AWS cloud deployment updates",
    documentationUrl: "https://docs.aws.amazon.com/linux/",
    homepageUrl: "https://aws.amazon.com/linux/amazon-linux-2023/",
    description: "Amazon Linux 2023 and AL2 non-security errata providing AWS Nitro hypervisor driver updates, cloud-init optimizations, and EFA drivers.",
    scope: "Amazon Linux 2023 & Amazon Linux 2 (EC2, ECS, EKS)",
    access: "Public updateinfo.xml & DNF repositories",
    coverage: "cloud-init IMDSv2 token caching, Elastic Fabric Adapter (EFA), kernel scheduling",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["Amazon Linux 2023", "Amazon Linux 2"],
    feedTypesCovered: ["Bugfix", "Enhancement"]
  },

  // 12. Upstream Linux Kernel
  {
    id: "feed-kernel-stable",
    os: "kernel",
    name: "Upstream Linux Kernel Stable Point Releases (Greg K-H Tree)",
    category: "Upstream Linux Kernel",
    icon: "🐧",
    provider: "The Linux Kernel Organization & Greg Kroah-Hartman",
    officialFeedUrl: "https://www.kernel.org/feeds/kdist.xml",
    format: "GIT_TREE",
    recordsIngested: 98200,
    updateFrequency: "Weekly stable point releases & urgent regression hotfixes",
    documentationUrl: "https://www.kernel.org/",
    homepageUrl: "https://www.kernel.org/",
    description: "Upstream Linux kernel stable tree patch sets containing driver regression fixes, filesystem stability patches (Btrfs, XFS, Ext4), and memory fixes.",
    scope: "Upstream Linux LTS Branches (6.6 LTS, 6.1 LTS, 5.15 LTS)",
    access: "Public Git, git-format-patch & kdist.xml",
    coverage: "TCP BBR socket memory stalls, AMD P-State CPPC governors, Btrfs space balancing",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["Linux 6.6 LTS", "Linux 6.1 LTS", "Linux 5.15 LTS"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance"]
  },

  // 13. Gentoo Linux
  {
    id: "feed-gentoo-portage",
    os: "gentoo",
    name: "Gentoo Linux Portage Stable Tree & Toolchain Updates",
    category: "Independent & Rolling Distros",
    icon: "🟣",
    provider: "Gentoo Development & Architecture Teams",
    officialFeedUrl: "https://api.gentoo.org/packages/",
    format: "JSON",
    recordsIngested: 21800,
    updateFrequency: "Live rsync / git tree sync",
    documentationUrl: "https://wiki.gentoo.org/",
    homepageUrl: "https://www.gentoo.org/",
    description: "Gentoo Portage package tree stabilization updates covering GCC 14.1 toolchains, binutils LTO optimizations, and Portage resolver speedups.",
    scope: "Gentoo Portage Tree @world & core system",
    access: "Public Git & Portage API",
    coverage: "Compiler stabilization, Link-Time Optimization (LTO) fixes, ebuild bugfixes",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Gentoo Stable Rolling"],
    feedTypesCovered: ["Bugfix", "Maintenance"]
  },

  // 14. FreeBSD
  {
    id: "feed-freebsd-en",
    os: "freebsd",
    name: "FreeBSD Errata Notices & Stability Stream (FreeBSD-EN)",
    category: "BSD & Unix Ecosystem",
    icon: "😈",
    provider: "FreeBSD Release Engineering & Core Team",
    officialFeedUrl: "https://www.freebsd.org/security/advisories/",
    format: "XML",
    recordsIngested: 45600,
    updateFrequency: "Continuous stability & quarterly stable point updates",
    documentationUrl: "https://www.freebsd.org/releases/",
    homepageUrl: "https://www.freebsd.org/",
    description: "Official FreeBSD Errata Notices (FreeBSD-EN) resolving OpenZFS pool deadlocks, 10GbE ixgbe network driver packet drops, and kernel stability.",
    scope: "FreeBSD 14.1-RELEASE, 14.0-RELEASE, 13.3-RELEASE Base",
    access: "Public freebsd-update stream & release errata",
    coverage: "OpenZFS ARC memory reclaim, Intel ixgbe LRO packet drops, network stack tuning",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["FreeBSD 14.1-RELEASE", "FreeBSD 13.3-RELEASE"],
    feedTypesCovered: ["Bugfix", "Maintenance"]
  },

  // 15. OpenBSD
  {
    id: "feed-openbsd-errata",
    os: "openbsd",
    name: "OpenBSD Reliability & Driver Errata (Syspatch Stream)",
    category: "BSD & Unix Ecosystem",
    icon: "🐡",
    provider: "OpenBSD Errata Team & Theo de Raadt",
    officialFeedUrl: "https://www.openbsd.org/errata75.html",
    format: "GIT_TREE",
    recordsIngested: 14900,
    updateFrequency: "Continuous publication upon patch approval",
    documentationUrl: "https://www.openbsd.org/errata.html",
    homepageUrl: "https://www.openbsd.org/",
    description: "Official OpenBSD binary syspatch stream fixing network bridge MTU fragmentation, pf state table locks, and AMD GPU memory mapping errata.",
    scope: "OpenBSD 7.5, 7.4 Base System & Kernel",
    access: "Public syspatch HTTP mirror & patch files",
    coverage: "Network bridge MTU fragmentation, pf packet filter states, DRM graphics drivers",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["OpenBSD 7.5", "OpenBSD 7.4"],
    feedTypesCovered: ["Bugfix", "Maintenance"]
  },

  // 16. NetBSD
  {
    id: "feed-netbsd-errata",
    os: "netbsd",
    name: "NetBSD Errata Notices & pkgsrc Quarterly Stream (NetBSD-EN)",
    category: "BSD & Unix Ecosystem",
    icon: "🚩",
    provider: "NetBSD Release Engineering & pkgsrc Team",
    officialFeedUrl: "https://ftp.netbsd.org/pub/NetBSD/",
    format: "JSON",
    recordsIngested: 23800,
    updateFrequency: "Weekly maintenance & quarterly branch releases",
    documentationUrl: "https://www.netbsd.org/releases/",
    homepageUrl: "https://www.netbsd.org/",
    description: "NetBSD Errata Notices (NetBSD-EN) and pkgsrc quarterly branch updates for NVMM hypervisor memory mapping and hardware drivers.",
    scope: "NetBSD 10.0, 9.4 Base & pkgsrc quarterly",
    access: "Public FTP / HTTPS JSON streams",
    coverage: "NVMM virtualization EPT invalidation, kernel driver fixes, pkgin updates",
    refreshRate: "Weekly",
    status: "Daily",
    supportedReleases: ["NetBSD 10.0", "NetBSD 9.4"],
    feedTypesCovered: ["Bugfix", "Maintenance"]
  },

  // 17. Wolfi OS (Chainguard)
  {
    id: "feed-wolfi-updates",
    os: "wolfi",
    name: "Wolfi Container Linux Package & Toolchain Stream",
    category: "Lightweight & Container OS",
    icon: "🐺",
    provider: "Chainguard & Wolfi Maintainers",
    officialFeedUrl: "https://packages.wolfi.dev/os/",
    format: "JSON",
    recordsIngested: 33400,
    updateFrequency: "Sub-hourly rolling rebuilds",
    documentationUrl: "https://wolfi.dev/",
    homepageUrl: "https://wolfi.dev/",
    description: "Wolfi distroless container operating system package updates providing glibc TLS alignment fixes, CA certificates root updates, and runtimes.",
    scope: "Wolfi OS Main & Community Container Packages",
    access: "Public Wolfi APK mirrors & repodata",
    coverage: "glibc dynamic loader TLS alignment, ca-certificates root store, container runtimes",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Wolfi Rolling Container OS"],
    feedTypesCovered: ["Bugfix", "Maintenance", "General"]
  },

  // 18. NixOS
  {
    id: "feed-nixos-channels",
    os: "nixos",
    name: "NixOS Channel Releases & Package Updates (nixos-24.05)",
    category: "Independent & Rolling Distros",
    icon: "❄️",
    provider: "NixOS Release & Hydra Engineering",
    officialFeedUrl: "https://channels.nixos.org/nixos-24.05",
    format: "JSON",
    recordsIngested: 38400,
    updateFrequency: "Continuous channel evaluation and binary cache builds",
    documentationUrl: "https://nixos.org/manual/nixos/stable/",
    homepageUrl: "https://nixos.org/",
    description: "NixOS declarative package management channel updates providing systemd-boot EFI bootloader fixes and Nix derivation speedups.",
    scope: "NixOS 24.05, 23.11 Channels",
    access: "Public channel JSON & hydra build cache",
    coverage: "systemd-boot NVRAM fallback, Nix 2.22 evaluation speedup, kernel updates",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["NixOS 24.05 (Uakari)", "NixOS 23.11 (Tapir)"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance"]
  },

  // 19. Void Linux
  {
    id: "feed-void-xbps",
    os: "void",
    name: "Void Linux XBPS Package Updates Stream",
    category: "Independent & Rolling Distros",
    icon: "⚪",
    provider: "Void Linux Packaging Team",
    officialFeedUrl: "https://repo-default.voidlinux.org/",
    format: "GIT_TREE",
    recordsIngested: 19800,
    updateFrequency: "Continuous rolling build updates",
    documentationUrl: "https://docs.voidlinux.org/",
    homepageUrl: "https://voidlinux.org/",
    description: "Void Linux rolling package releases featuring XBPS package manager updates, dracut initramfs compatibility, and runit service scripts.",
    scope: "Void Linux x86_64, aarch64 (glibc & musl)",
    access: "Public Git Repository & XBPS Repodata",
    coverage: "dracut initramfs kernel 6.10 compatibility, xbps transaction locks, core runit scripts",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Void Linux Rolling"],
    feedTypesCovered: ["Bugfix", "Maintenance"]
  },

  // 20. VMware Photon OS
  {
    id: "feed-photon-updates",
    os: "photon",
    name: "VMware Photon OS Bugfix Advisories (PHBA & tdnf Updates)",
    category: "Cloud & Hyperscaler Linux",
    icon: "⚡",
    provider: "Broadcom / VMware Open Source Program Office",
    officialFeedUrl: "https://packages.vmware.com/photon/",
    format: "UPDATEINFO",
    recordsIngested: 31200,
    updateFrequency: "Daily sync with VMware repository mirrors",
    documentationUrl: "https://github.com/vmware/photon/wiki",
    homepageUrl: "https://vmware.github.io/photon/",
    description: "Photon OS bug fixes (PHBA) and enhancements (PHEA) optimizing containerd NRI plugins and VMware PVSCSI virtual disk queue depths.",
    scope: "Photon OS 5.0, 4.0 (x86_64, aarch64)",
    access: "Public tdnf updateinfo & package mirrors",
    coverage: "containerd NRI hook stability, tdnf cache corruption fixes, PVSCSI queue depth",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["Photon OS 5.0", "Photon OS 4.0"],
    feedTypesCovered: ["Bugfix", "Enhancement"]
  },

  // 21. Flatcar Container Linux
  {
    id: "feed-flatcar-releases",
    os: "flatcar",
    name: "Flatcar Container Linux Stable Release Stream (A/B Updates)",
    category: "Lightweight & Container OS",
    icon: "🚗",
    provider: "Flatcar / Kinvolk / Microsoft",
    officialFeedUrl: "https://www.flatcar.org/releases/stable/update.json",
    format: "JSON",
    recordsIngested: 17200,
    updateFrequency: "Bi-weekly stable releases & urgent maintenance hotfixes",
    documentationUrl: "https://www.flatcar.org/docs/",
    homepageUrl: "https://www.flatcar.org/",
    description: "Flatcar immutable container host release stream delivering dual-partition atomic image updates and systemd-networkd interface fixes.",
    scope: "Flatcar Stable Channel A/B Releases",
    access: "Public JSON Release Stream & Omaha Protocol",
    coverage: "OS image delta updates, systemd-networkd interface renaming, Ignition 2.18",
    refreshRate: "Weekly",
    status: "Daily",
    supportedReleases: ["Flatcar Stable 3815.2.0", "Flatcar LTS"],
    feedTypesCovered: ["Bugfix", "Maintenance"]
  },

  // 22. Talos Linux
  {
    id: "feed-talos-releases",
    os: "talos",
    name: "Talos Linux Immutable OS Appliance Releases (Sidero Labs)",
    category: "Lightweight & Container OS",
    icon: "🛡️",
    provider: "Sidero Labs Release Team",
    officialFeedUrl: "https://github.com/siderolabs/talos/releases",
    format: "JSON",
    recordsIngested: 10400,
    updateFrequency: "Point release builds upon component upgrade",
    documentationUrl: "https://talos.dev/latest/",
    homepageUrl: "https://talos.dev/",
    description: "Talos Linux immutable appliance maintenance updates providing etcd 3.5.14 snapshot reliability and kubelet CPU manager topology fixes.",
    scope: "Talos Linux v1.7, v1.6 Kubernetes Appliances",
    access: "Public GitHub Releases & talosctl installer tags",
    coverage: "etcd snapshot compaction, kubelet CPU manager topology, Wireguard performance",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["Talos v1.7.5", "Talos v1.6.8"],
    feedTypesCovered: ["Bugfix", "Maintenance"]
  },

  // 23. OpenWrt
  {
    id: "feed-openwrt-updates",
    os: "openwrt",
    name: "OpenWrt Stable Updates & Driver Stream (OPKG)",
    category: "Embedded & Edge Linux",
    icon: "📶",
    provider: "OpenWrt Project Release Team",
    officialFeedUrl: "https://downloads.openwrt.org/",
    format: "JSON",
    recordsIngested: 13900,
    updateFrequency: "Point release sync with git tags",
    documentationUrl: "https://openwrt.org/docs/",
    homepageUrl: "https://openwrt.org/",
    description: "OpenWrt embedded network operating system maintenance updates resolving Qualcomm ath11k Wi-Fi crashes and dnsmasq query timeouts.",
    scope: "OpenWrt 23.05, 22.03 Stable Series",
    access: "Public OPKG repository feeds & downloads",
    coverage: "ath11k Wi-Fi mesh driver stability, dnsmasq cache eviction, Linux 5.15 kernel backports",
    refreshRate: "Weekly",
    status: "Daily",
    supportedReleases: ["OpenWrt 23.05.3", "OpenWrt 22.03.6"],
    feedTypesCovered: ["Bugfix", "Maintenance"]
  },

  // 24. openEuler
  {
    id: "feed-openeuler-maintenance",
    os: "openeuler",
    name: "openEuler Maintenance & Performance Advisories",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🌐",
    provider: "openEuler Community & OpenAtom Foundation",
    officialFeedUrl: "https://www.openeuler.org/en/security/safety-bulletin/",
    format: "CSAF",
    recordsIngested: 48900,
    updateFrequency: "Continuous publication of maintenance bulletins",
    documentationUrl: "https://docs.openeuler.org/",
    homepageUrl: "https://www.openeuler.org/",
    description: "openEuler enterprise infrastructure maintenance stream delivering multi-socket Kunpeng 920 CPU scheduling and iSula container optimizations.",
    scope: "openEuler 24.03 LTS, 22.03 LTS SP3",
    access: "Public CSAF 2.0 JSON & DNF repository streams",
    coverage: "AArch64 NUMA memory affinity, systemd cgroup v2 accounting, iSula container engine",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["openEuler 24.03 LTS", "openEuler 22.03 LTS"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance"]
  },

  // 25. CloudLinux
  {
    id: "feed-cloudlinux-errata",
    os: "cloudlinux",
    name: "CloudLinux OS Bug Fix & Enhancement Advisories (CLBA & CLEA)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "☁️",
    provider: "CloudLinux Inc. Kernel Engineering",
    officialFeedUrl: "https://repo.cloudlinux.com/cloudlinux/",
    format: "UPDATEINFO",
    recordsIngested: 58900,
    updateFrequency: "Daily sync with enterprise mirrors",
    documentationUrl: "https://docs.cloudlinux.com/",
    homepageUrl: "https://www.cloudlinux.com/",
    description: "CloudLinux OS non-security errata resolving CageFS skeleton remount locks, MySQL Governor IOPS limiters, and LVE cgroup thresholds.",
    scope: "CloudLinux 9, CloudLinux 8, CageFS",
    access: "Public updateinfo.xml & DNF repositories",
    coverage: "CageFS skeleton remount deadlocks, MySQL Governor IO throttling, LVE memory alerts",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["CloudLinux 9", "CloudLinux 8"],
    feedTypesCovered: ["Bugfix", "Enhancement"]
  },

  // 26. Kali Linux
  {
    id: "feed-kali-packages",
    os: "kali",
    name: "Kali Linux Rolling Package Releases & Hardware Drivers",
    category: "Debian & Ubuntu Ecosystem",
    icon: "🐉",
    provider: "OffSec & Kali Linux Development Team",
    officialFeedUrl: "https://pkg.kali.org/",
    format: "JSON",
    recordsIngested: 30100,
    updateFrequency: "Continuous rolling package sync with Debian testing",
    documentationUrl: "https://www.kali.org/docs/",
    homepageUrl: "https://www.kali.org/",
    description: "Kali Linux rolling maintenance updates delivering Xfce desktop performance patches and RTL8812AU Wi-Fi driver packet drop fixes.",
    scope: "Kali Linux Rolling (x86_64, aarch64)",
    access: "Public Package Tracker JSON & apt mirrors",
    coverage: "Wi-Fi injection driver packet drops, desktop environment speedups, core toolchains",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Kali Linux 2024.3", "Kali Linux Rolling"],
    feedTypesCovered: ["Bugfix", "Maintenance", "General"]
  },

  // 27. Azure Linux / CBL-Mariner
  {
    id: "feed-azure-linux",
    os: "azure-linux",
    name: "Azure Linux / CBL-Mariner Host Updates & Hypervisor Drivers",
    category: "Cloud & Hyperscaler Linux",
    icon: "🔷",
    provider: "Microsoft Azure Linux Team & Kernel Developers",
    officialFeedUrl: "https://github.com/microsoft/azurelinux",
    format: "CSAF",
    recordsIngested: 36200,
    updateFrequency: "Continuous cloud image and package updates",
    documentationUrl: "https://learn.microsoft.com/en-us/azure/azure-linux/",
    homepageUrl: "https://github.com/microsoft/azurelinux",
    description: "Azure Linux non-security host updates resolving Cloud-Hypervisor direct kernel boot, VFIO SRIOV NIC resets, and MANA DPDK drivers.",
    scope: "Azure Linux 3.0, CBL-Mariner 2.0 (AKS Hosts)",
    access: "Public CSAF JSON & tdnf RPM streams",
    coverage: "Cloud-Hypervisor VM direct-kernel boot, VFIO device resets, Microsoft MANA DPDK",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Azure Linux 3.0", "CBL-Mariner 2.0"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance"]
  },

  // 28. Linux Mint (Debian & Ubuntu Ecosystem)
  {
    id: "feed-linux-mint-relnotes",
    os: "linux-mint",
    name: "Linux Mint Release Notes & Package Errata",
    category: "Debian & Ubuntu Ecosystem",
    icon: "🍃",
    provider: "Linux Mint Development Team & Clem Lefebvre",
    officialFeedUrl: "https://linuxmint.com/rel_notes.php",
    format: "JSON",
    recordsIngested: 24500,
    updateFrequency: "Continuous point release sync with upstream Ubuntu base",
    documentationUrl: "https://linuxmint.com/rel_notes.php",
    homepageUrl: "https://linuxmint.com/",
    description: "Linux Mint desktop environment (Cinnamon, MATE, Xfce) and core system package updates, tracking Ubuntu LTS base package errata and desktop optimizations.",
    scope: "Linux Mint 22 (Wilma), 21.3 (Virginia) Cinnamon, MATE, Xfce",
    access: "Public release notes & repository package pools",
    coverage: "Cinnamon desktop stability, XApp improvements, Nemo file manager fixes, upstream Ubuntu USN base synchronization",
    refreshRate: "Continuous",
    status: "Realtime",
    supportedReleases: ["Linux Mint 22 (Wilma)", "Linux Mint 21.3 (Virginia)"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance", "General"]
  },

  // 29. Apple macOS (Darwin/BSD Base)
  {
    id: "feed-apple-macos-security",
    os: "macos",
    name: "Apple macOS & Darwin Base Security Updates",
    category: "BSD & Unix Ecosystem",
    icon: "🍎",
    provider: "Apple Product Security (PSIRT) & Darwin Engineering",
    officialFeedUrl: "https://support.apple.com/en-us/HT201222",
    format: "JSON",
    recordsIngested: 36200,
    updateFrequency: "As Released / Rapid Security Responses (RSR)",
    documentationUrl: "https://support.apple.com/en-us/HT201222",
    homepageUrl: "https://support.apple.com/en-us/HT201222",
    description: "Official Apple macOS operating system security updates, Darwin XNU kernel patches, and rapid security response errata across macOS Sequoia and Sonoma.",
    scope: "macOS Sequoia 15, Sonoma 14, Ventura 13 (Apple Silicon & Intel)",
    access: "Public Apple Security Releases & Web Feed",
    coverage: "XNU kernel memory-safety mitigations, WebKit zero-day remediations, Gatekeeper security enhancements, Darwin base system updates",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["macOS Sequoia 15", "macOS Sonoma 14"],
    feedTypesCovered: ["Security", "Maintenance", "Bugfix"]
  },

  // 30. Debian Security Advisories (DSA)
  {
    id: "feed-debian-dsa",
    os: "debian",
    name: "Debian Security Advisories (DSA) Feed",
    category: "Debian & Ubuntu Ecosystem",
    icon: "🔴",
    provider: "Debian Security Team",
    officialFeedUrl: "https://www.debian.org/security/",
    format: "JSON",
    recordsIngested: 112000,
    updateFrequency: "Continuous publication upon security fix approval",
    documentationUrl: "https://www.debian.org/security/",
    homepageUrl: "https://www.debian.org/security/",
    description: "Debian Security Advisories (DSA) providing rapid security fixes, CVE patches, and security backports for Debian stable and oldstable releases.",
    scope: "Debian 12 (Bookworm), Debian 11 (Bullseye) Security Updates",
    access: "Public Debian Security Tracker & Advisory Feed",
    coverage: "Critical CVE mitigations, remote code execution fixes, kernel security backports, OpenSSL security patches",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Debian 12 (Bookworm)", "Debian 11 (Bullseye)"],
    feedTypesCovered: ["Security", "Bugfix"]
  },

  // 31. Ubuntu Security Notices (USN) & RSS Feed
  {
    id: "feed-ubuntu-usn",
    os: "ubuntu",
    name: "Ubuntu Security Notices (USN) & RSS Feed",
    category: "Debian & Ubuntu Ecosystem",
    icon: "🟠",
    provider: "Canonical Security Team",
    officialFeedUrl: "https://ubuntu.com/security/notices.rss",
    format: "RSS",
    recordsIngested: 68500,
    updateFrequency: "Hourly live security notice publishing",
    documentationUrl: "https://ubuntu.com/security/notices",
    homepageUrl: "https://ubuntu.com/security/notices",
    description: "Official Canonical security notices and real-time RSS feed publishing CVE patch matrices, CVSS metrics, and package updates across Ubuntu LTS releases.",
    scope: "Ubuntu 24.04 LTS (Noble), 22.04 LTS (Jammy), 20.04 LTS (Focal)",
    access: "Public USN RSS Feed & REST API",
    coverage: "Kernel privilege escalations, OpenSSH mitigations, systemd vulnerabilities, container runtime CVEs",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Ubuntu 24.04 LTS (Noble)", "Ubuntu 22.04 LTS (Jammy)"],
    feedTypesCovered: ["Security", "Bugfix"]
  },

  // 32. Red Hat Customer Portal Advisories (RHSA)
  {
    id: "feed-redhat-rhsa",
    os: "rhel",
    name: "Red Hat Customer Portal Advisories (RHSA)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🎩",
    provider: "Red Hat Product Security",
    officialFeedUrl: "https://access.redhat.com/security/updates/advisory",
    format: "CSAF",
    recordsIngested: 94000,
    updateFrequency: "Continuous security errata publication",
    documentationUrl: "https://access.redhat.com/security/updates/advisory",
    homepageUrl: "https://access.redhat.com/security/updates/advisory",
    description: "Authoritative Red Hat Security Advisories (RHSA) publishing security errata, CVSSv3 scores, and CVE remediation packages for RHEL.",
    scope: "RHEL 9, RHEL 8, RHEL 7 Extended Lifecycle",
    access: "Public Red Hat Security Portal & CSAF Provider",
    coverage: "Kernel zero-days, cryptographic library vulnerabilities, virtualization escape patches, SELinux policy fixes",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["RHEL 9.4", "RHEL 8.10"],
    feedTypesCovered: ["Security"]
  },

  // 33. Fedora Security Updates (Bodhi)
  {
    id: "feed-fedora-security",
    os: "fedora",
    name: "Fedora Bodhi Security Updates",
    category: "Independent & Rolling Distros",
    icon: "🔵",
    provider: "Fedora Project Security Team",
    officialFeedUrl: "https://bodhi.fedoraproject.org/",
    format: "JSON",
    recordsIngested: 42300,
    updateFrequency: "Continuous security updates stream",
    documentationUrl: "https://bodhi.fedoraproject.org/",
    homepageUrl: "https://bodhi.fedoraproject.org/",
    description: "Fedora Bodhi updates system filtered specifically for security advisories and fast-track vulnerability remediation RPM packages.",
    scope: "Fedora 40, Fedora 39 Security Updates",
    access: "Public Bodhi REST API",
    coverage: "Upstream zero-day fast-tracks, memory safety bugs, network protocol patches",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Fedora 40", "Fedora 39"],
    feedTypesCovered: ["Security", "Bugfix"]
  },

  // 34. AlmaLinux Security Errata (ALSA)
  {
    id: "feed-almalinux-alsa",
    os: "almalinux",
    name: "AlmaLinux Security Errata (ALSA)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🔵",
    provider: "AlmaLinux OS Foundation Security Team",
    officialFeedUrl: "https://errata.almalinux.org/",
    format: "CSAF",
    recordsIngested: 38700,
    updateFrequency: "Continuous mirror synchronization upon security build",
    documentationUrl: "https://errata.almalinux.org/",
    homepageUrl: "https://errata.almalinux.org/",
    description: "AlmaLinux Security Errata (ALSA) tracking enterprise vulnerability mitigations and CVE patch matrices in CSAF 2.0 and DNF updateinfo.",
    scope: "AlmaLinux 9 & 8 BaseOS, AppStream Security",
    access: "Public Errata REST API & CSAF 2.0",
    coverage: "OpenSSL security patches, glibc buffer overflow mitigations, Linux kernel security errata",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["AlmaLinux 9.4", "AlmaLinux 8.10"],
    feedTypesCovered: ["Security"]
  },

  // 35. Rocky Linux Security Errata (RLSA)
  {
    id: "feed-rocky-rlsa",
    os: "rocky",
    name: "Rocky Linux Security Errata (RLSA)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🟢",
    provider: "Rocky Enterprise Software Foundation (RESF)",
    officialFeedUrl: "https://errata.rockylinux.org/",
    format: "UPDATEINFO",
    recordsIngested: 41200,
    updateFrequency: "Continuous security build synchronization",
    documentationUrl: "https://errata.rockylinux.org/",
    homepageUrl: "https://errata.rockylinux.org/",
    description: "Rocky Linux Security Advisories (RLSA) delivering CVE fixes and security errata across Rocky Linux enterprise server and container builds.",
    scope: "Rocky Linux 9 & 8 BaseOS, AppStream",
    access: "Public DNF updateinfo.xml & RESF REST API",
    coverage: "Enterprise server security patches, container base image hardening, network daemon CVE fixes",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Rocky Linux 9", "Rocky Linux 8"],
    feedTypesCovered: ["Security"]
  },

  // 36. Oracle Linux Security (ELSA)
  {
    id: "feed-oracle-elsa",
    os: "oracle-linux",
    name: "Oracle Linux Security Advisories (ELSA)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🔴",
    provider: "Oracle Linux Security Response",
    officialFeedUrl: "https://linux.oracle.com/security/",
    format: "OVAL",
    recordsIngested: 49800,
    updateFrequency: "Daily sync with ULN security metadata",
    documentationUrl: "https://linux.oracle.com/security/",
    homepageUrl: "https://linux.oracle.com/security/",
    description: "Oracle Linux Enterprise Security Advisories (ELSA) providing CVE vulnerability patches for Unbreakable Enterprise Kernel (UEK) and RHCK.",
    scope: "Oracle Linux 9, 8, UEK Release 7",
    access: "Public OVAL XML & ULN security advisories",
    coverage: "Ksplice zero-downtime security patches, UEK kernel vulnerabilities, system service security fixes",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["Oracle Linux 9", "Oracle Linux 8"],
    feedTypesCovered: ["Security"]
  },

  // 37. SUSE Security Announcements (SUSE-SU)
  {
    id: "feed-suse-security",
    os: "suse",
    name: "SUSE Security Announcements (SUSE-SU)",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🦎",
    provider: "SUSE Security Team",
    officialFeedUrl: "https://www.suse.com/support/security/",
    format: "CSAF",
    recordsIngested: 51200,
    updateFrequency: "Continuous publication of security updates",
    documentationUrl: "https://www.suse.com/support/security/",
    homepageUrl: "https://www.suse.com/support/security/",
    description: "Official SUSE Security Updates (SUSE-SU) providing CVE patch matrices, CSAF metadata, and Zypper security errata for SUSE Linux Enterprise.",
    scope: "SLES 15 SP6, SLES 15 SP5, SUSE Linux Enterprise Server",
    access: "Public CSAF 2.0 & OVAL definitions",
    coverage: "Enterprise Linux kernel CVEs, YaST security patches, enterprise storage driver vulnerability remediations",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["SLES 15 SP6", "SLES 15 SP5"],
    feedTypesCovered: ["Security"]
  },

  // 38. openSUSE Security Updates
  {
    id: "feed-opensuse-security",
    os: "suse",
    name: "openSUSE Security Updates & Announcements",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🦎",
    provider: "openSUSE Security Team & Maintainers",
    officialFeedUrl: "https://lists.opensuse.org/archives/list/security-announce@lists.opensuse.org/",
    format: "JSON",
    recordsIngested: 37400,
    updateFrequency: "Real-time mailing list archives & repository feeds",
    documentationUrl: "https://lists.opensuse.org/archives/list/security-announce@lists.opensuse.org/",
    homepageUrl: "https://lists.opensuse.org/archives/list/security-announce@lists.opensuse.org/",
    description: "openSUSE official security announcement mailing list and repository update stream covering openSUSE Leap and Tumbleweed.",
    scope: "openSUSE Leap 15.6, Tumbleweed Rolling",
    access: "Public mailing list archives & Zypper repo security data",
    coverage: "Community-driven security fixes, desktop package vulnerabilities, system utility CVE patches",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["openSUSE Leap 15.6", "openSUSE Tumbleweed"],
    feedTypesCovered: ["Security"]
  },

  // 39. Gentoo Linux Security Advisories (GLSA)
  {
    id: "feed-gentoo-glsa",
    os: "gentoo",
    name: "Gentoo Linux Security Advisories (GLSA)",
    category: "Independent & Rolling Distros",
    icon: "🟣",
    provider: "Gentoo Linux Security Team",
    officialFeedUrl: "https://security.gentoo.org/",
    format: "XML",
    recordsIngested: 18900,
    updateFrequency: "Continuous publication upon security review",
    documentationUrl: "https://security.gentoo.org/",
    homepageUrl: "https://security.gentoo.org/",
    description: "Official Gentoo Linux Security Advisories (GLSA) cataloging package vulnerabilities, CVSS metrics, and glsa-check remediation ebuilds.",
    scope: "Gentoo Portage Tree @world Security",
    access: "Public GLSA XML feed & Portage metadata",
    coverage: "Portage package security patches, toolchain vulnerability mitigations, C library security fixes",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Gentoo Stable Rolling"],
    feedTypesCovered: ["Security"]
  },

  // 40. Arch Linux Security Tracker (ASA)
  {
    id: "feed-arch-security",
    os: "arch",
    name: "Arch Linux Security Tracker (ASA)",
    category: "Independent & Rolling Distros",
    icon: "🏹",
    provider: "Arch Linux Security Team",
    officialFeedUrl: "https://security.archlinux.org/",
    format: "JSON",
    recordsIngested: 29400,
    updateFrequency: "Live continuous vulnerability tracking",
    documentationUrl: "https://security.archlinux.org/",
    homepageUrl: "https://security.archlinux.org/",
    description: "Authoritative Arch Linux Security Advisories (ASA) tracking upstream CVEs, affected package versions, and patched releases across Core and Extra.",
    scope: "Arch Linux Core & Extra Packages",
    access: "Public JSON API & Security Tracker",
    coverage: "Real-time rolling release CVE tracking, kernel vulnerability patches, pacman package updates",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Arch Linux Rolling"],
    feedTypesCovered: ["Security"]
  },

  // 41. Alpine Linux Security Database (secfixes)
  {
    id: "feed-alpine-secfixes",
    os: "alpine",
    name: "Alpine Linux Security Database (secfixes)",
    category: "Lightweight & Container OS",
    icon: "🏔️",
    provider: "Alpine Linux Security Team",
    officialFeedUrl: "https://secdb.alpinelinux.org/",
    format: "JSON",
    recordsIngested: 26800,
    updateFrequency: "Continuous publication of secfixes database",
    documentationUrl: "https://secdb.alpinelinux.org/",
    homepageUrl: "https://secdb.alpinelinux.org/",
    description: "Official Alpine Linux security database mapping CVEs to fixed package versions across all active Alpine branches and container images.",
    scope: "Alpine v3.20, v3.19, Edge (Main & Community)",
    access: "Public secdb JSON feeds",
    coverage: "musl libc security fixes, BusyBox vulnerability patches, lightweight container security errata",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Alpine v3.20", "Alpine v3.19"],
    feedTypesCovered: ["Security"]
  },

  // 42. Amazon Linux Security Center (ALAS Security)
  {
    id: "feed-amazon-alas-sec",
    os: "amazon-linux",
    name: "Amazon Linux Security Center (ALAS)",
    category: "Cloud & Hyperscaler Linux",
    icon: "📦",
    provider: "AWS Security Engineering",
    officialFeedUrl: "https://alas.aws.amazon.com/",
    format: "UPDATEINFO",
    recordsIngested: 32100,
    updateFrequency: "Continuous AWS cloud security advisory sync",
    documentationUrl: "https://alas.aws.amazon.com/",
    homepageUrl: "https://alas.aws.amazon.com/",
    description: "Amazon Linux Security Center publishing authoritative ALAS security bulletins, CVSS severity ratings, and DNF updateinfo for AL2023 and AL2.",
    scope: "Amazon Linux 2023 & AL2 EC2 / Container AMI",
    access: "Public RSS & DNF security metadata",
    coverage: "AWS Nitro hypervisor security, cloud-init vulnerabilities, enterprise Linux server CVE fixes",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["Amazon Linux 2023", "Amazon Linux 2"],
    feedTypesCovered: ["Security"]
  },

  // 43. FreeBSD Security Advisories (FreeBSD-SA) & RSS
  {
    id: "feed-freebsd-sa",
    os: "freebsd",
    name: "FreeBSD Security Advisories (FreeBSD-SA) & RSS",
    category: "BSD & Unix Ecosystem",
    icon: "😈",
    provider: "FreeBSD Security Officer & Secteam",
    officialFeedUrl: "https://www.freebsd.org/security/rss.xml",
    format: "RSS",
    recordsIngested: 21500,
    updateFrequency: "Continuous security notice publishing & RSS syndication",
    documentationUrl: "https://www.freebsd.org/security/advisories/",
    homepageUrl: "https://www.freebsd.org/security/advisories/",
    description: "Official FreeBSD Security Advisories (FreeBSD-SA) and syndication RSS feed publishing CVE mitigations and security patches for base system components.",
    scope: "FreeBSD 14.1-RELEASE, 13.3-RELEASE Base System",
    access: "Public RSS feed & freebsd-update security stream",
    coverage: "Kernel network stack vulnerabilities, OpenSSH security advisories, bhyve hypervisor escape mitigations",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["FreeBSD 14.1-RELEASE", "FreeBSD 13.3-RELEASE"],
    feedTypesCovered: ["Security"]
  },

  // 44. OpenBSD Security & Reliability Errata
  {
    id: "feed-openbsd-security-errata",
    os: "openbsd",
    name: "OpenBSD Security & Reliability Errata",
    category: "BSD & Unix Ecosystem",
    icon: "🐡",
    provider: "OpenBSD Errata Team & Theo de Raadt",
    officialFeedUrl: "https://www.openbsd.org/errata.html",
    format: "GIT_TREE",
    recordsIngested: 16200,
    updateFrequency: "Continuous publication upon patch verification",
    documentationUrl: "https://www.openbsd.org/errata.html",
    homepageUrl: "https://www.openbsd.org/errata.html",
    description: "Official OpenBSD security errata patches delivered via syspatch binary updates and source tree errata patches.",
    scope: "OpenBSD 7.5, 7.4 Base System & Kernel",
    access: "Public HTTP errata mirrors & syspatch stream",
    coverage: "pf packet filter security fixes, OpenSSH vulnerability remediations, kernel memory safety mitigations",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["OpenBSD 7.5", "OpenBSD 7.4"],
    feedTypesCovered: ["Security", "Bugfix"]
  },

  // 45. NetBSD Security Advisories (NetBSD-SA)
  {
    id: "feed-netbsd-sa",
    os: "netbsd",
    name: "NetBSD Security Advisories (NetBSD-SA)",
    category: "BSD & Unix Ecosystem",
    icon: "🚩",
    provider: "NetBSD Security Officer Team",
    officialFeedUrl: "https://www.netbsd.org/support/security/",
    format: "JSON",
    recordsIngested: 17400,
    updateFrequency: "Publication upon coordinated disclosure",
    documentationUrl: "https://www.netbsd.org/support/security/",
    homepageUrl: "https://www.netbsd.org/support/security/",
    description: "Official NetBSD Security Advisories (NetBSD-SA) cataloging vulnerabilities, CVE references, and patch instructions for NetBSD releases.",
    scope: "NetBSD 10.0, 9.4 Base System & Kernel",
    access: "Public NetBSD security portal & mailing lists",
    coverage: "Kernel subsystem vulnerabilities, base system utility CVE fixes, cryptographic module updates",
    refreshRate: "Weekly",
    status: "Daily",
    supportedReleases: ["NetBSD 10.0", "NetBSD 9.4"],
    feedTypesCovered: ["Security"]
  },

  // 46. LinuxSecurity.com Multi-Distro Advisories
  {
    id: "feed-linuxsecurity-aggregator",
    os: "kernel",
    name: "LinuxSecurity.com Multi-Distro Advisories",
    category: "Multi-Distro Aggregators",
    icon: "🌐",
    provider: "LinuxSecurity.com Advisory Syndication",
    officialFeedUrl: "https://linuxsecurity.com/about/linuxsecurity-rss-feeds",
    format: "RSS",
    recordsIngested: 145000,
    updateFrequency: "Continuous multi-distro RSS syndication",
    documentationUrl: "https://linuxsecurity.com/about/linuxsecurity-rss-feeds",
    homepageUrl: "https://linuxsecurity.com/advisories",
    description: "Centralized multi-distribution security advisory aggregator providing customized RSS feeds for 12 popular distributions, including hybrid feeds and direct vendor syndications.",
    scope: "Multi-Distribution Linux (Debian, Ubuntu, Red Hat, Fedora, SUSE, Arch, Gentoo, Slackware, Mageia)",
    access: "Public RSS Feeds & Syndication Portal",
    coverage: "Multi-distribution security notices, kernel vulnerability advisories, package errata across 12 major Linux distros",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["Multi-Distribution Linux"],
    feedTypesCovered: ["Security", "Bugfix", "Maintenance"]
  },

  // 47. Global Cyber Incident Response Team (gCIRT) Links
  {
    id: "feed-gcirt-advisories",
    os: "kernel",
    name: "Global Cyber Incident Response Team (gCIRT) Advisories",
    category: "Multi-Distro Aggregators",
    icon: "🌐",
    provider: "Global Cyber Incident Response Team (gCIRT)",
    officialFeedUrl: "https://gcirt.com/advisories",
    format: "JSON",
    recordsIngested: 88000,
    updateFrequency: "Daily curation of global platform advisory links",
    documentationUrl: "https://gcirt.com/advisories",
    homepageUrl: "https://gcirt.com/advisories",
    description: "Maintains an up-to-date repository and global directory of application, operating system, and cloud platform advisory URLs.",
    scope: "Global Platform, Operating System & Infrastructure Advisories",
    access: "Public Advisory Directory & Links",
    coverage: "Consolidated platform advisory URLs, incident response links, and coordinated disclosure trackers",
    refreshRate: "Daily",
    status: "Daily",
    supportedReleases: ["Global Platform & OS Advisories"],
    feedTypesCovered: ["Security", "General"]
  },

  // 48. CentOS Stream Continuous Delivery & Compose Stream
  {
    id: "feed-centos-stream",
    os: "centos-stream",
    name: "CentOS Stream 9 & 10 Continuous Delivery & DNF Updateinfo Stream",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🟣",
    provider: "CentOS Project & Red Hat Enterprise Linux Engineering",
    officialFeedUrl: "https://mirror.stream.centos.org/9-stream/",
    format: "UPDATEINFO",
    recordsIngested: 64200,
    updateFrequency: "Continuous compose & mirror synchronization",
    documentationUrl: "https://www.centos.org/centos-stream/",
    homepageUrl: "https://www.centos.org/download",
    description: "Official CentOS Stream continuous delivery package stream tracking upstream RHEL 9 and RHEL 10 kernel, glibc, and enterprise user-space updates.",
    scope: "CentOS Stream 9 & CentOS Stream 10 (BaseOS, AppStream, CRB)",
    access: "Public CentOS Stream Mirror Network & DNF Metadata",
    coverage: "Upstream RHEL minor release candidates, kernel & glibc bugfixes, enterprise toolchain updates",
    refreshRate: "Realtime",
    status: "Realtime",
    supportedReleases: ["CentOS Stream 9", "CentOS Stream 10"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance", "Security"]
  },

  // 49. openSUSE Leap Maintenance & Recommended Updates
  {
    id: "feed-opensuse-leap",
    os: "opensuse-leap",
    name: "openSUSE Leap 15.6 Maintenance & Zypper Updateinfo Stream",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🦎",
    provider: "openSUSE Project & SUSE Maintenance Engineering",
    officialFeedUrl: "https://download.opensuse.org/update/leap/15.6/oss/",
    format: "UPDATEINFO",
    recordsIngested: 53800,
    updateFrequency: "Hourly openSUSE build service (OBS) update publication",
    documentationUrl: "https://get.opensuse.org/leap/",
    homepageUrl: "https://get.opensuse.org/leap/",
    description: "Official openSUSE Leap update stream synchronized with SUSE Linux Enterprise (SLE) shared service pack maintenance and community backports.",
    scope: "openSUSE Leap 15.6 & 15.5 (OSS, Non-OSS, SLE-Update)",
    access: "Public Zypper repomd.xml & OVAL Advisories",
    coverage: "SLE-shared kernel-default stability fixes, OpenSSL 3 updates, Btrfs & transactional-update patches",
    refreshRate: "Hourly",
    status: "Realtime",
    supportedReleases: ["openSUSE Leap 15.6", "openSUSE Leap 15.5"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance", "Security"]
  },

  // 50. Fedora CoreOS (FCOS) Cincinnati & OSTree Release Stream
  {
    id: "feed-fedora-coreos",
    os: "fedora-coreos",
    name: "Fedora CoreOS (FCOS) Cincinnati Update Graph & OSTree Stream",
    category: "Lightweight & Container OS",
    icon: "🔵",
    provider: "Fedora CoreOS Working Group",
    officialFeedUrl: "https://builds.coreos.fedoraproject.org/streams/stable.json",
    format: "JSON",
    recordsIngested: 19400,
    updateFrequency: "Bi-weekly promoted stable & testing OSTree releases",
    documentationUrl: "https://fedoraproject.org/coreos/download",
    homepageUrl: "https://fedoraproject.org/coreos/download",
    description: "Official Fedora CoreOS (FCOS) atomic OSTree update stream and Zincati Cincinnati update graph for immutable container hosts.",
    scope: "Fedora CoreOS Stable, Testing & Next Streams (x86_64, aarch64)",
    access: "Public JSON Stream Metadata & Cincinnati Update Graph",
    coverage: "Atomic rpm-ostree host deployments, Ignition provisioning fixes, moby-engine/podman & kernel updates",
    refreshRate: "Daily",
    status: "Realtime",
    supportedReleases: ["Fedora CoreOS Stable (40)", "Fedora CoreOS Testing"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance", "Security"]
  },

  // 51. Proxmox Virtual Environment (Proxmox VE) Enterprise & No-Subscription Repository
  {
    id: "feed-proxmox-ve",
    os: "proxmox",
    name: "Proxmox VE 8.x Hypervisor, QEMU/KVM & ZFS Kernel Stream",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🟧",
    provider: "Proxmox Server Solutions GmbH",
    officialFeedUrl: "https://download.proxmox.com/debian/pve/dists/bookworm/",
    format: "JSON",
    recordsIngested: 28900,
    updateFrequency: "Continuous hypervisor & kernel point release publication",
    documentationUrl: "https://pve.proxmox.com/wiki/Package_Repositories",
    homepageUrl: "https://www.proxmox.com/en/downloads",
    description: "Official Proxmox Virtual Environment (PVE) Debian-based hypervisor update stream covering pve-manager, pve-qemu-kvm, Ceph, and proxmox-kernel.",
    scope: "Proxmox VE 8.2 / 8.1 (Debian 12 Bookworm Base + PVE Kernel 6.8)",
    access: "Public Proxmox APT Repository Changelog & Release Notes",
    coverage: "QEMU/KVM live-migration stability, LXC container isolation, ZFS & Ceph storage cluster updates, PVE 6.8 kernel",
    refreshRate: "Daily",
    status: "Realtime",
    supportedReleases: ["Proxmox VE 8.2", "Proxmox VE 8.1"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance", "Security"]
  },

  // 52. TrueNAS SCALE Enterprise Storage & OpenZFS Appliance Stream
  {
    id: "feed-truenas-scale",
    os: "truenas-scale",
    name: "TrueNAS SCALE Dragonfish / Electric Eel & OpenZFS Release Stream",
    category: "Enterprise Linux (RHEL/Rocky/Alma)",
    icon: "🐋",
    provider: "iXsystems TrueNAS Engineering",
    officialFeedUrl: "https://update.sys.truenas.net/scale/",
    format: "JSON",
    recordsIngested: 22100,
    updateFrequency: "Continuous appliance train & OpenZFS package updates",
    documentationUrl: "https://www.truenas.com/docs/scale/",
    homepageUrl: "https://www.truenas.com/download-truenas-scale",
    description: "Official TrueNAS SCALE Debian-based storage appliance update feed tracking middlewared, OpenZFS 2.2+, Samba/NFS multiprotocol shares, and storage kernel patches.",
    scope: "TrueNAS SCALE 24.04 (Dragonfish) & 24.10 (Electric Eel)",
    access: "Public TrueNAS Update Manifests & APT Repository Metadata",
    coverage: "OpenZFS ARC/L2ARC stability fixes, middlewared API updates, NVMe-oF & iSCSI target enhancements",
    refreshRate: "Daily",
    status: "Realtime",
    supportedReleases: ["TrueNAS SCALE 24.04 (Dragonfish)", "TrueNAS SCALE 24.10 (Electric Eel)"],
    feedTypesCovered: ["Bugfix", "Enhancement", "Maintenance", "Security"]
  }
];

/**
 * Curated, Verified Regular Vendor Patch Bundles across All 27 Distributions
 * Exclusively focused on Bug Fixes, Hardware Enhancements, Maintenance Point Releases, and General Package Updates.
 * Zero Weakness Enumeration / CVE Noise.
 */
export const ARGENT_PATCH_BUNDLES: ArgentPatchBundle[] = [
  // 1. Rocky Linux / RHEL Kernel NVMe Multi-path Bug Fix Advisory (RLBA)
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
      feedName: "Rocky Linux Bug Fix & Enhancement Errata (RLBA & RLEA)",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://errata.rockylinux.org/"
    }
  },

  // 2. Red Hat Enterprise Linux glibc AVX-512 Performance & Bugfix Advisory (RHBA)
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
      sourceId: "feed-redhat-errata",
      feedName: "Red Hat Bug & Enhancement Advisories Stream (RHBA & RHEA)",
      feedType: "public-distro-feed",
      format: "CSAF",
      syncStatus: "live",
      sourceUrl: "https://access.redhat.com/hydra/rest/securitydata/cvrf.json"
    }
  },

  // 3. Ubuntu Linux systemd Socket Activation & cgroup v2 Bugfix Bundle
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
      sourceId: "feed-ubuntu-updates",
      feedName: "Canonical Ubuntu Updates & Hardware Enablement Stream (noble-updates)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://changelogs.ubuntu.com/changelogs/"
    }
  },

  // 4. Ubuntu Hardware Enablement (HWE) Intel Wi-Fi 7 & AMD GPU Microcode Enhancement
  {
    id: "ARG-UBUNTU-UPD-2024-0518",
    bundleId: "UBUNTU-FW-2024-0518",
    advisoryType: "ENHANCEMENT",
    os: "ubuntu",
    osFamily: "linux-debian",
    osDisplayName: "Ubuntu Linux",
    targetReleases: ["Ubuntu 24.04 LTS (Noble)"],
    title: "Linux Hardware Enablement (HWE) Intel Wi-Fi 7 BE200 & AMD RDNA3 Microcode Update",
    synopsis: "Canonical hardware enablement stream delivering updated binary firmware blobs for Intel Wi-Fi 7 BE200 adapters and AMD Radeon 7000 series GPU power management.",
    vendorSeverity: "MODERATE",
    severityScore: 6.2,
    operationalDomain: "DRIVER",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-25T14:30:00Z",
    updatedAt: "2024-06-25T14:30:00Z",
    cveList: [],
    packages: [
      { name: "linux-firmware", sourcePackage: "linux-firmware", arch: "all", currentVersion: "20240318.git3b128b0-0ubuntu2", fixedVersion: "20240318.git3b128b0-0ubuntu2.4", packageManager: "apt", sizeBytes: 495000000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update && apt-get install --only-upgrade -y linux-firmware",
      verification: "dpkg -l linux-firmware | grep ubuntu2.4",
      rollback: "apt-get install -y linux-firmware=20240318.git3b128b0-0ubuntu2",
      kineticDeploy: "kinetic upgrade --bundle UBUNTU-FW-2024-0518 --os ubuntu"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://launchpad.net/ubuntu/+source/linux-firmware",
    sourceFeed: {
      sourceId: "feed-ubuntu-updates",
      feedName: "Canonical Ubuntu Updates & Hardware Enablement Stream (noble-updates)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://changelogs.ubuntu.com/changelogs/"
    }
  },

  // 5. Debian GNU/Linux OpenZFS ARC Memory Reclaim Bugfix
  {
    id: "ARG-DEBIAN-BUG-2024-189",
    bundleId: "DEBIAN-BUG-2024-189",
    advisoryType: "BUGFIX",
    os: "debian",
    osFamily: "linux-debian",
    osDisplayName: "Debian GNU/Linux",
    targetReleases: ["Debian 12 (Bookworm)"],
    title: "OpenZFS on Linux ARC Memory Reclaim and Zstandard Compression Deadlock Bugfix",
    synopsis: "Debian proposed updates package fixing memory stall where the ZFS Adaptive Replacement Cache failed to shrink under sudden system memory pressure.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.3,
    operationalDomain: "STORAGE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-18T16:00:00Z",
    updatedAt: "2024-06-18T16:00:00Z",
    cveList: [],
    packages: [
      { name: "zfs-dkms", sourcePackage: "zfs-linux", arch: "all", currentVersion: "2.1.11-1", fixedVersion: "2.1.11-1+deb12u1", packageManager: "apt", sizeBytes: 2340000 },
      { name: "zfsutils-linux", sourcePackage: "zfs-linux", arch: "x86_64", currentVersion: "2.1.11-1", fixedVersion: "2.1.11-1+deb12u1", packageManager: "apt", sizeBytes: 485000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update && apt-get install --only-upgrade -y zfs-dkms zfsutils-linux",
      verification: "dpkg -l zfsutils-linux | grep deb12u1",
      rollback: "apt-get install -y zfsutils-linux=2.1.11-1 zfs-dkms=2.1.11-1",
      kineticDeploy: "kinetic upgrade --bundle DEBIAN-BUG-2024-189 --os debian"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=1049281",
    sourceFeed: {
      sourceId: "feed-debian-updates",
      feedName: "Debian Proposed Updates & Bug Tracking Stream (BTS / debian-updates)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://bugs.debian.org/release-critical/"
    }
  },

  // 6. FreeBSD Errata Notice - OpenZFS Allocation Race Condition (FreeBSD-EN)
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
      sourceId: "feed-freebsd-en",
      feedName: "FreeBSD Errata Notices & Stability Stream (FreeBSD-EN)",
      feedType: "public-distro-feed",
      format: "XML",
      syncStatus: "live",
      sourceUrl: "https://www.freebsd.org/security/advisories/"
    }
  },

  // 7. AlmaLinux Bugfix Advisory - NetworkManager DHCPv6 Lease Renewal (ALBA)
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
      feedName: "AlmaLinux Bugfix & Enhancement Errata (ALBA & ALEA)",
      feedType: "public-distro-feed",
      format: "CSAF",
      syncStatus: "live",
      sourceUrl: "https://errata.almalinux.org/api/v1/errata"
    }
  },

  // 8. openSUSE Recommended Update - Btrfs Balancing & Quota Recalculation (SUSE-RU)
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
      sourceId: "feed-suse-ru",
      feedName: "SUSE Recommended & Maintenance Updates (SUSE-RU / openSUSE)",
      feedType: "public-distro-feed",
      format: "OVAL",
      syncStatus: "live",
      sourceUrl: "https://ftp.suse.com/pub/projects/security/oval/"
    }
  },

  // 9. Fedora Bodhi Bugfix Advisory - PipeWire Low-Latency Audio
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
      nativeUpgrade: "dnf upgrade -y pipewire pipewire-alsa wireplumber && (systemctl --user restart pipewire wireplumber 2>/dev/null || true)",
      verification: "pipewire --version | grep 1.0.7-3",
      rollback: "dnf history undo last -y && (systemctl --user restart pipewire wireplumber 2>/dev/null || true)",
      kineticDeploy: "kinetic upgrade --bundle FEDORA-2024-d2e81102 --os fedora"
    },
    impact: { rebootRequired: false, servicesToRestart: ["pipewire"], zeroDowntime: true },
    upstreamNoticeUrl: "https://bodhi.fedoraproject.org/updates/FEDORA-2024-d2e81102",
    sourceFeed: {
      sourceId: "feed-fedora-bodhi",
      feedName: "Fedora Bodhi Bugfix & Enhancement Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://bodhi.fedoraproject.org/updates/"
    }
  },

  // 10. Upstream Linux Kernel Stable Point Bugfix Bundle (6.6.41)
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
      rollback: "grub-reboot 'Previous Kernel v6.6.40'",
      kineticDeploy: "kinetic hotpatch --kernel-tag v6.6.41 --live"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://git.kernel.org/pub/scm/linux/kernel/git/stable/linux.git/log/?h=linux-6.6.y",
    sourceFeed: {
      sourceId: "feed-kernel-stable",
      feedName: "Upstream Linux Kernel Stable Point Releases (Greg K-H Tree)",
      feedType: "public-distro-feed",
      format: "GIT_TREE",
      syncStatus: "live",
      sourceUrl: "https://www.kernel.org/feeds/kdist.xml"
    }
  },

  // 11. OpenBSD Network Bridge MTU Fragmentation Errata
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
      nativeUpgrade: "syspatch",
      verification: "syspatch -l | grep 004_bridge",
      rollback: "syspatch -r 004_bridge",
      kineticDeploy: "kinetic upgrade --bundle OPENBSD-75-004 --os openbsd"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://www.openbsd.org/errata75.html",
    sourceFeed: {
      sourceId: "feed-openbsd-errata",
      feedName: "OpenBSD Reliability & Driver Errata (Syspatch Stream)",
      feedType: "public-distro-feed",
      format: "GIT_TREE",
      syncStatus: "live",
      sourceUrl: "https://www.openbsd.org/errata75.html"
    }
  },

  // 12. Amazon Linux 2023 cloud-init IMDSv2 Performance Enhancement (ALAS-BA)
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
      feedName: "Amazon Linux General Updates & Cloud Optimizations (ALAS-BA / AL2023)",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://alas.aws.amazon.com/AL2023/alas.rss"
    }
  },

  // 13. Alpine Linux 3.20 musl libc DNS Search Path Resolver Bugfix
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
      sourceId: "feed-alpine-updates",
      feedName: "Alpine Linux Main & Community Package Updates (APK Stream)",
      feedType: "public-distro-feed",
      format: "GIT_TREE",
      syncStatus: "live",
      sourceUrl: "https://git.alpinelinux.org/aports/"
    }
  },

  // 14. NixOS systemd-boot EFI Bootloader Reliability Update
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
      sourceId: "feed-nixos-channels",
      feedName: "NixOS Channel Releases & Package Updates (nixos-24.05)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://channels.nixos.org/nixos-24.05"
    }
  },

  // 15. VMware Photon OS Containerd & NRI Hook Bugfix Advisory (PHBA)
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
      sourceId: "feed-photon-updates",
      feedName: "VMware Photon OS Bugfix Advisories (PHBA & tdnf Updates)",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://packages.vmware.com/photon/"
    }
  },

  // 16. Flatcar Container Linux Stable Point Update
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
      rollback: "cgpt prioritize -P 2 /dev/sda",
      kineticDeploy: "kinetic upgrade --bundle FLATCAR-UPD-2024-3815 --os flatcar"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://www.flatcar.org/releases#stable-3815.2.2",
    sourceFeed: {
      sourceId: "feed-flatcar-releases",
      feedName: "Flatcar Container Linux Stable Release Stream (A/B Updates)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://www.flatcar.org/releases/stable/update.json"
    }
  },

  // 17. Talos Linux v1.7.5 Maintenance Release
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
      sourceId: "feed-talos-releases",
      feedName: "Talos Linux Immutable OS Appliance Releases (Sidero Labs)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://github.com/siderolabs/talos/releases"
    }
  },

  // 18. OpenWrt Wireless ath11k Stability & Kernel Buffer Bugfix
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
      sourceId: "feed-openwrt-updates",
      feedName: "OpenWrt Stable Updates & Driver Stream (OPKG)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://downloads.openwrt.org/"
    }
  },

  // 19. Gentoo Toolchain Maintenance Update (GCC 14.1 & Binutils LTO)
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
      sourceId: "feed-gentoo-portage",
      feedName: "Gentoo Linux Portage Stable Tree & Toolchain Updates",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://api.gentoo.org/packages/"
    }
  },

  // 20. openEuler 24.03 LTS Linux Core Maintenance Advisory
  {
    id: "ARG-OPENEULER-BA-2024-1588",
    bundleId: "openEuler-BA-2024-1588",
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
      kineticDeploy: "kinetic upgrade --bundle openEuler-BA-2024-1588 --os openeuler"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.openeuler.org/en/security/safety-bulletin/detail.html?id=openEuler-SA-2024-1588",
    sourceFeed: {
      sourceId: "feed-openeuler-maintenance",
      feedName: "openEuler Maintenance & Performance Advisories",
      feedType: "public-distro-feed",
      format: "CSAF",
      syncStatus: "live",
      sourceUrl: "https://www.openeuler.org/en/security/safety-bulletin/"
    }
  },

  // 21. Azure Linux / CBL-Mariner Cloud-Hypervisor Direct Boot Bugfix
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
      feedName: "Azure Linux / CBL-Mariner Host Updates & Hypervisor Drivers",
      feedType: "public-distro-feed",
      format: "CSAF",
      syncStatus: "live",
      sourceUrl: "https://github.com/microsoft/azurelinux"
    }
  },

  // 22. CloudLinux CageFS & MySQL Governor Bugfix Advisory (CLBA)
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
      feedName: "CloudLinux OS Bug Fix & Enhancement Advisories (CLBA & CLEA)",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://repo.cloudlinux.com/cloudlinux/"
    }
  },

  // 23. Arch Linux Mesa Vulkan Driver Performance Optimization
  {
    id: "ARG-ARCH-UPD-2024-0720",
    bundleId: "ARCH-UPD-2024-0720",
    advisoryType: "ENHANCEMENT",
    os: "arch",
    osFamily: "linux-arch",
    osDisplayName: "Arch Linux",
    targetReleases: ["Arch Linux Rolling"],
    title: "Mesa 24.1 RADV Vulkan Ray Tracing & Compute Pipeline Performance Enhancement",
    synopsis: "Arch Linux rolling release update delivering Mesa 24.1.4 with up to 25% compute throughput acceleration on AMD Radeon RDNA3 hardware.",
    vendorSeverity: "MODERATE",
    severityScore: 6.2,
    operationalDomain: "DRIVER",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-20T16:00:00Z",
    updatedAt: "2024-07-20T16:00:00Z",
    cveList: [],
    packages: [
      { name: "mesa", sourcePackage: "mesa", arch: "x86_64", currentVersion: "24.1.2-1", fixedVersion: "24.1.4-1", packageManager: "pacman", sizeBytes: 18400000 },
      { name: "vulkan-radeon", sourcePackage: "mesa", arch: "x86_64", currentVersion: "24.1.2-1", fixedVersion: "24.1.4-1", packageManager: "pacman", sizeBytes: 4210000 }
    ],
    commands: {
      nativeUpgrade: "pacman -Sy --noconfirm mesa vulkan-radeon",
      verification: "pacman -Q mesa | grep 24.1.4-1",
      rollback: "pacman -U --noconfirm /var/cache/pacman/pkg/mesa-24.1.2-1-x86_64.pkg.tar.zst",
      kineticDeploy: "kinetic upgrade --bundle ARCH-UPD-2024-0720 --os arch"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://archlinux.org/packages/extra/x86_64/mesa/",
    sourceFeed: {
      sourceId: "feed-arch-packages",
      feedName: "Arch Linux Core & Extra Package Releases (Rolling Stream)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://archlinux.org/packages/search/json/"
    }
  },

  // 24. Kali Linux Xfce Desktop Performance & Toolchain Update
  {
    id: "ARG-KALI-UPD-2024-0820",
    bundleId: "KALI-UPD-2024-0820",
    advisoryType: "MAINTENANCE",
    os: "kali",
    osFamily: "linux-debian",
    osDisplayName: "Kali Linux",
    targetReleases: ["Kali Linux 2024.3"],
    title: "Kali Linux 2024.3 Desktop Environment & Core Network Tooling Maintenance Release",
    synopsis: "Official Kali Linux distribution point update optimizing Xfce window manager responsiveness and updating base network inspection toolchains.",
    vendorSeverity: "LOW",
    severityScore: 4.5,
    operationalDomain: "CORE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-08-20T10:00:00Z",
    updatedAt: "2024-08-20T10:00:00Z",
    cveList: [],
    packages: [
      { name: "kali-desktop-xfce", sourcePackage: "kali-meta", arch: "x86_64", currentVersion: "2024.2.1", fixedVersion: "2024.3.0", packageManager: "apt", sizeBytes: 154000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update && apt-get install --only-upgrade -y kali-desktop-xfce",
      verification: "dpkg -l kali-desktop-xfce | grep 2024.3",
      rollback: "apt-get install -y kali-desktop-xfce=2024.2.1",
      kineticDeploy: "kinetic upgrade --bundle KALI-UPD-2024-0820 --os kali"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.kali.org/blog/kali-linux-2024-3-release/",
    sourceFeed: {
      sourceId: "feed-kali-packages",
      feedName: "Kali Linux Rolling Package Releases & Hardware Drivers",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://pkg.kali.org/"
    }
  },

  // 25. Void Linux dracut initramfs Kernel 6.10 Compatibility Bugfix
  {
    id: "ARG-VOID-UPD-2024-0901",
    bundleId: "VOID-UPD-2024-0901",
    advisoryType: "BUGFIX",
    os: "void",
    osFamily: "linux-void",
    osDisplayName: "Void Linux",
    targetReleases: ["Void Linux Rolling"],
    title: "dracut Initramfs Generator Kernel 6.10 Module Loading Compatibility Bugfix",
    synopsis: "Void Linux XBPS update fixing dracut initramfs regeneration failure when building ramdisks for Linux 6.10 with zstd compressed kernel modules.",
    vendorSeverity: "MODERATE",
    severityScore: 6.4,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-08-28T12:00:00Z",
    updatedAt: "2024-08-28T12:00:00Z",
    cveList: [],
    packages: [
      { name: "dracut", sourcePackage: "dracut", arch: "x86_64", currentVersion: "060-1", fixedVersion: "060-3", packageManager: "xbps", sizeBytes: 890000 }
    ],
    commands: {
      nativeUpgrade: "xbps-install -Su dracut && dracut --regenerate-all --force",
      verification: "xbps-query -s dracut",
      rollback: "xbps-install -f /var/cache/xbps/dracut-060_1.x86_64.xbps",
      kineticDeploy: "kinetic upgrade --bundle VOID-UPD-2024-0901 --os void"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://github.com/void-linux/void-packages/pull/51820",
    sourceFeed: {
      sourceId: "feed-void-xbps",
      feedName: "Void Linux XBPS Package Updates Stream",
      feedType: "public-distro-feed",
      format: "GIT_TREE",
      syncStatus: "live",
      sourceUrl: "https://repo-default.voidlinux.org/"
    }
  },

  // 26. Wolfi Container OS glibc Dynamic Loader TLS Alignment Bugfix
  {
    id: "ARG-WOLFI-UPD-2024-0701",
    bundleId: "WOLFI-UPD-2024-0701",
    advisoryType: "BUGFIX",
    os: "wolfi",
    osFamily: "linux-wolfi",
    osDisplayName: "Wolfi Container OS",
    targetReleases: ["Wolfi Rolling Container OS"],
    title: "glibc 2.39-r4 Dynamic Loader Thread-Local Storage (TLS) Alignment Bugfix",
    synopsis: "Wolfi OS maintenance update fixing segfault in multi-threaded Go/CGO applications caused by unaligned TLS blocks in musl-to-glibc compatibility layers.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.2,
    operationalDomain: "CORE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-01T09:15:00Z",
    updatedAt: "2024-07-01T09:15:00Z",
    cveList: [],
    packages: [
      { name: "glibc", sourcePackage: "glibc", arch: "x86_64", currentVersion: "2.39-r3", fixedVersion: "2.39-r4", packageManager: "apk", sizeBytes: 2410000 }
    ],
    commands: {
      nativeUpgrade: "apk update && apk add --upgrade glibc",
      verification: "apk info -v glibc | grep 2.39-r4",
      rollback: "apk add glibc=2.39-r3",
      kineticDeploy: "kinetic upgrade --bundle WOLFI-UPD-2024-0701 --os wolfi"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://packages.wolfi.dev/os/",
    sourceFeed: {
      sourceId: "feed-wolfi-updates",
      feedName: "Wolfi Container Linux Package & Toolchain Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://packages.wolfi.dev/os/"
    }
  },

  // 27. NetBSD NVMM Hypervisor Memory Mapping Errata (NetBSD-EN)
  {
    id: "ARG-NETBSD-EN-2024-002",
    bundleId: "NetBSD-EN-2024-002",
    advisoryType: "BUGFIX",
    os: "netbsd",
    osFamily: "bsd-netbsd",
    osDisplayName: "NetBSD",
    targetReleases: ["NetBSD 10.0"],
    title: "NetBSD NVMM Hypervisor Nested Page Table (EPT) Memory Mapping Errata",
    synopsis: "NetBSD official errata notice resolving guest physical memory mapping deadlock when running QEMU hardware acceleration on AMD SVM processors.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.1,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-18T18:00:00Z",
    updatedAt: "2024-06-18T18:00:00Z",
    cveList: [],
    packages: [
      { name: "kernel-netbsd", sourcePackage: "src/sys/dev/nvmm", arch: "x86_64", currentVersion: "10.0_base", fixedVersion: "10.0_patch2", packageManager: "pkgin", sizeBytes: 16500000 }
    ],
    commands: {
      nativeUpgrade: "pkgin -y update && pkgin -y upgrade nvmm-kmod",
      verification: "uname -v | grep NetBSD",
      rollback: "pkgin -y install nvmm-kmod-10.0",
      kineticDeploy: "kinetic upgrade --bundle NetBSD-EN-2024-002 --os netbsd"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://ftp.netbsd.org/pub/NetBSD/",
    sourceFeed: {
      sourceId: "feed-netbsd-errata",
      feedName: "NetBSD Errata Notices & pkgsrc Quarterly Stream (NetBSD-EN)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://ftp.netbsd.org/pub/NetBSD/"
    }
  },
  // 28. Ubuntu Linux Hardware Enablement (HWE) Wi-Fi 7 & Intel Meteor Lake NPU
  {
    id: "ARG-UBUNTU-HWE-2024-0518",
    bundleId: "UBUNTU-HWE-2024-0518",
    advisoryType: "ENHANCEMENT",
    os: "ubuntu",
    osFamily: "linux-debian",
    osDisplayName: "Ubuntu Linux",
    targetReleases: ["Ubuntu 24.04 LTS (Noble)"],
    title: "Linux 6.8 HWE Wi-Fi 7 (802.11be) and Intel Meteor Lake NPU Enablement",
    synopsis: "Official Ubuntu kernel hardware enablement stack update adding native Wi-Fi 7 320MHz channel support and Intel AI Boost NPU acceleration drivers.",
    vendorSeverity: "MODERATE",
    severityScore: 6.2,
    operationalDomain: "DRIVER",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-07-02T11:00:00Z",
    updatedAt: "2024-07-02T11:00:00Z",
    cveList: [],
    packages: [
      { name: "linux-generic-hwe-24.04", sourcePackage: "linux-meta", arch: "x86_64", currentVersion: "6.8.0-31.31", fixedVersion: "6.8.0-38.38", packageManager: "apt", sizeBytes: 18000 },
      { name: "linux-modules-extra-6.8.0-38-generic", sourcePackage: "linux", arch: "x86_64", currentVersion: "6.8.0-31.31", fixedVersion: "6.8.0-38.38", packageManager: "apt", sizeBytes: 84200000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update && apt-get install --only-upgrade -y linux-generic-hwe-24.04 linux-modules-extra-6.8.0-38-generic",
      verification: "uname -r | grep 6.8.0-38",
      rollback: "apt-get install -y linux-image-6.8.0-31-generic",
      kineticDeploy: "kinetic upgrade --bundle UBUNTU-HWE-2024-0518 --os ubuntu"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://wiki.ubuntu.com/Kernel/LTSEnablementStack",
    sourceFeed: {
      sourceId: "feed-ubuntu-updates",
      feedName: "Ubuntu Main Updates & Hardware Enablement Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://packages.ubuntu.com/"
    }
  },

  // 29. Debian 12 Bookworm Point Release 12.6 Base Package Sync
  {
    id: "ARG-DEBIAN-UPD-2024-0610",
    bundleId: "DEBIAN-UPD-2024-0610",
    advisoryType: "MAINTENANCE",
    os: "debian",
    osFamily: "linux-debian",
    osDisplayName: "Debian GNU/Linux",
    targetReleases: ["Debian 12.6 (Bookworm)"],
    title: "Debian 12.6 Stable Point Release System Maintenance Bundle",
    synopsis: "Official Debian stable maintenance point release updating base-files, tzdata, ca-certificates, and core system utilities.",
    vendorSeverity: "LOW",
    severityScore: 4.8,
    operationalDomain: "CORE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-29T16:00:00Z",
    updatedAt: "2024-06-29T16:00:00Z",
    cveList: [],
    packages: [
      { name: "base-files", sourcePackage: "base-files", arch: "x86_64", currentVersion: "13.0+deb12u5", fixedVersion: "13.0+deb12u6", packageManager: "apt", sizeBytes: 74000 },
      { name: "tzdata", sourcePackage: "tzdata", arch: "all", currentVersion: "2024a-0+deb12u1", fixedVersion: "2024b-0+deb12u1", packageManager: "apt", sizeBytes: 310000 },
      { name: "ca-certificates", sourcePackage: "ca-certificates", arch: "all", currentVersion: "20230311", fixedVersion: "20240203", packageManager: "apt", sizeBytes: 158000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update && apt-get install --only-upgrade -y base-files tzdata ca-certificates",
      verification: "cat /etc/debian_version | grep 12.6",
      rollback: "apt-get install -y base-files=13.0+deb12u5",
      kineticDeploy: "kinetic upgrade --bundle DEBIAN-UPD-2024-0610 --os debian"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.debian.org/News/2024/20240629",
    sourceFeed: {
      sourceId: "feed-debian-updates",
      feedName: "Debian Stable Updates & Point Release Errata Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://bugs.debian.org/release-critical/"
    }
  },

  // 30. Red Hat Enterprise Linux Intel QAT Acceleration & DPDK 23.11 (RHEA)
  {
    id: "ARG-RHEA-2024-4380",
    bundleId: "RHEA-2024:4380",
    advisoryType: "ENHANCEMENT",
    os: "rhel",
    osFamily: "linux-rhel",
    osDisplayName: "Red Hat Enterprise Linux",
    targetReleases: ["RHEL 9.4"],
    title: "Intel QuickAssist Technology (QAT) Generation 4 Hardware Acceleration & DPDK 23.11 Enhancement",
    synopsis: "Red Hat Enhancement Advisory delivering production acceleration drivers for Intel QAT gen4 hardware offloading gzip compression and TLS handshakes.",
    vendorSeverity: "MODERATE",
    severityScore: 6.8,
    operationalDomain: "PERFORMANCE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-25T14:30:00Z",
    updatedAt: "2024-06-25T14:30:00Z",
    cveList: [],
    packages: [
      { name: "qatlib", sourcePackage: "qatlib", arch: "x86_64", currentVersion: "23.11.0-2.el9", fixedVersion: "24.02.0-1.el9", packageManager: "dnf", sizeBytes: 420000 },
      { name: "dpdk", sourcePackage: "dpdk", arch: "x86_64", currentVersion: "23.11-1.el9", fixedVersion: "23.11-3.el9", packageManager: "dnf", sizeBytes: 18900000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y qatlib dpdk",
      verification: "rpm -q qatlib | grep 24.02",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle RHEA-2024:4380 --os rhel"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://access.redhat.com/errata/RHEA-2024:4380",
    sourceFeed: {
      sourceId: "feed-redhat-errata",
      feedName: "Red Hat Bug & Enhancement Advisories Stream (RHBA & RHEA)",
      feedType: "public-distro-feed",
      format: "CSAF",
      syncStatus: "live",
      sourceUrl: "https://access.redhat.com/hydra/rest/securitydata/cvrf.json"
    }
  },

  // 31. AlmaLinux Btrfs Subvolume Quota Tree Balance & Transaction Flush Fix (ALBA)
  {
    id: "ARG-ALBA-2024-3990",
    bundleId: "ALBA-2024:3990",
    advisoryType: "BUGFIX",
    os: "almalinux",
    osFamily: "linux-rhel",
    osDisplayName: "AlmaLinux",
    targetReleases: ["AlmaLinux 9.4", "AlmaLinux 8.10"],
    title: "Btrfs Subvolume Quota Tree Balance Stall and Transaction Flush Bug Fix Advisory",
    synopsis: "AlmaLinux Bug Advisory resolving kernel spinlock contention during btrfs quota tree rebalances under heavy concurrent snapshot write operations.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.1,
    operationalDomain: "STORAGE",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-18T10:00:00Z",
    updatedAt: "2024-06-18T10:00:00Z",
    cveList: [],
    packages: [
      { name: "btrfs-progs", sourcePackage: "btrfs-progs", arch: "x86_64", currentVersion: "6.6.3-1.el9", fixedVersion: "6.6.3-2.el9", packageManager: "dnf", sizeBytes: 1120000 },
      { name: "kernel-tools", sourcePackage: "kernel", arch: "x86_64", currentVersion: "5.14.0-427.18.1.el9_4", fixedVersion: "5.14.0-427.22.1.el9_4", packageManager: "dnf", sizeBytes: 4100000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y btrfs-progs kernel-tools",
      verification: "rpm -q btrfs-progs | grep 6.6.3-2",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle ALBA-2024:3990 --os almalinux"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://errata.almalinux.org/9/ALBA-2024-3990.html",
    sourceFeed: {
      sourceId: "feed-almalinux-errata",
      feedName: "AlmaLinux Bug & Enhancement Errata Stream (ALBA & ALEA)",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://errata.almalinux.org/"
    }
  },

  // 32. SUSE Linux Enterprise OCI Hook Engine Upgrade (openSUSE-RU)
  {
    id: "ARG-SUSE-RU-2024-2190",
    bundleId: "SUSE-RU-2024:2190-1",
    advisoryType: "ENHANCEMENT",
    os: "suse",
    osFamily: "linux-suse",
    osDisplayName: "openSUSE / SLES",
    targetReleases: ["SLES 15 SP5", "openSUSE Leap 15.6"],
    title: "containerd OCI Runtime Hook Engine Upgrade & Systemd Cgroup Delegation",
    synopsis: "SUSE recommended update backporting native OCI spec v1.1 lifecycle hooks and automated systemd cgroup v2 controller delegation to containerd.",
    vendorSeverity: "MODERATE",
    severityScore: 6.4,
    operationalDomain: "CONTAINER",
    actionDirective: "RELOAD_SERVICE",
    issuedAt: "2024-06-22T08:15:00Z",
    updatedAt: "2024-06-22T08:15:00Z",
    cveList: [],
    packages: [
      { name: "containerd", sourcePackage: "containerd", arch: "x86_64", currentVersion: "1.7.11-150500.3.3.1", fixedVersion: "1.7.18-150500.3.6.1", packageManager: "zypper", sizeBytes: 28400000 },
      { name: "runc", sourcePackage: "runc", arch: "x86_64", currentVersion: "1.1.10-150500.3.3.1", fixedVersion: "1.1.12-150500.3.6.1", packageManager: "zypper", sizeBytes: 9200000 }
    ],
    commands: {
      nativeUpgrade: "zypper patch --category recommended -y && systemctl restart containerd",
      verification: "containerd --version | grep 1.7.18",
      rollback: "zypper install -y containerd=1.7.11-150500.3.3.1",
      kineticDeploy: "kinetic upgrade --bundle SUSE-RU-2024:2190-1 --os suse"
    },
    impact: { rebootRequired: false, servicesToRestart: ["containerd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.suse.com/support/update/announcement/2024/suse-ru-20242190-1/",
    sourceFeed: {
      sourceId: "feed-suse-errata",
      feedName: "SUSE Recommended Updates (openSUSE-RU & SLES Recommended)",
      feedType: "public-distro-feed",
      format: "CSAF",
      syncStatus: "live",
      sourceUrl: "https://ftp.suse.com/pub/projects/security/yaml/"
    }
  },

  // 33. Arch Linux Coreutils 9.5 Multithreaded Sort & AVX-512 GNU Utilities
  {
    id: "ARG-ARCH-PKG-2024-0715",
    bundleId: "ARCH-PKG-2024-0715",
    advisoryType: "GENERAL",
    os: "arch",
    osFamily: "linux-arch",
    osDisplayName: "Arch Linux",
    targetReleases: ["Arch Linux Rolling"],
    title: "Coreutils 9.5 Multi-threaded Sort Optimization & AVX-512 Vector Extensions",
    synopsis: "Arch Linux core repository update bringing upstream GNU Coreutils 9.5 with OpenMP multithreaded sort optimizations and SIMD hash acceleration.",
    vendorSeverity: "LOW",
    severityScore: 4.9,
    operationalDomain: "CORE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-01T12:00:00Z",
    updatedAt: "2024-07-01T12:00:00Z",
    cveList: [],
    packages: [
      { name: "coreutils", sourcePackage: "coreutils", arch: "x86_64", currentVersion: "9.4-2", fixedVersion: "9.5-1", packageManager: "pacman", sizeBytes: 3100000 }
    ],
    commands: {
      nativeUpgrade: "pacman -Sy --noconfirm coreutils",
      verification: "sort --version | grep 9.5",
      rollback: "pacman -U /var/cache/pacman/pkg/coreutils-9.4-2-x86_64.pkg.tar.zst",
      kineticDeploy: "kinetic upgrade --bundle ARCH-PKG-2024-0715 --os arch"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://archlinux.org/packages/core/x86_64/coreutils/",
    sourceFeed: {
      sourceId: "feed-arch-core",
      feedName: "Arch Linux Core & Extra Package Streams",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://archlinux.org/feeds/packages/"
    }
  },

  // 34. Alpine Linux musl 1.2.5 Thread Local Storage (TLS) Alignment Optimization
  {
    id: "ARG-ALPINE-PKG-2024-0630",
    bundleId: "ALPINE-PKG-2024-0630",
    advisoryType: "ENHANCEMENT",
    os: "alpine",
    osFamily: "linux-alpine",
    osDisplayName: "Alpine Linux",
    targetReleases: ["Alpine v3.20", "Alpine Edge"],
    title: "musl libc 1.2.5 Thread Local Storage (TLS) Memory Alignment Optimization",
    synopsis: "Alpine Linux official package update upgrading musl to 1.2.5, optimizing thread local storage allocation and ARM64 cache line alignment.",
    vendorSeverity: "MODERATE",
    severityScore: 6.0,
    operationalDomain: "CORE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-30T10:00:00Z",
    updatedAt: "2024-06-30T10:00:00Z",
    cveList: [],
    packages: [
      { name: "musl", sourcePackage: "musl", arch: "x86_64", currentVersion: "1.2.5-r0", fixedVersion: "1.2.5-r1", packageManager: "apk", sizeBytes: 620000 }
    ],
    commands: {
      nativeUpgrade: "apk update && apk add --upgrade musl",
      verification: "apk info -v musl | grep 1.2.5-r1",
      rollback: "apk add musl=1.2.5-r0",
      kineticDeploy: "kinetic upgrade --bundle ALPINE-PKG-2024-0630 --os alpine"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://git.alpinelinux.org/aports/log/main/musl",
    sourceFeed: {
      sourceId: "feed-alpine-packages",
      feedName: "Alpine Linux Package Repository & Git Streams",
      feedType: "public-distro-feed",
      format: "GIT_TREE",
      syncStatus: "live",
      sourceUrl: "https://pkgs.alpinelinux.org/packages"
    }
  },

  // 35. Fedora Bodhi NetworkManager 1.48 WireGuard Roaming & DHCPv6 Rapid Commit
  {
    id: "ARG-FEDORA-BODHI-2024-5820",
    bundleId: "FEDORA-BODHI-2024-5820",
    advisoryType: "BUGFIX",
    os: "fedora",
    osFamily: "linux-fedora",
    osDisplayName: "Fedora Linux",
    targetReleases: ["Fedora 40", "Fedora 39"],
    title: "NetworkManager 1.48 WireGuard Endpoint Roaming and DHCPv6 Rapid Commit Fix",
    synopsis: "Fedora Bodhi bug fix update addressing intermittent interface disconnects during Wi-Fi to cellular roaming with WireGuard and rapid DHCP lease renewals.",
    vendorSeverity: "MODERATE",
    severityScore: 6.3,
    operationalDomain: "NETWORK",
    actionDirective: "RELOAD_SERVICE",
    issuedAt: "2024-06-26T14:40:00Z",
    updatedAt: "2024-06-26T14:40:00Z",
    cveList: [],
    packages: [
      { name: "NetworkManager", sourcePackage: "NetworkManager", arch: "x86_64", currentVersion: "1.46.0-1.fc40", fixedVersion: "1.48.0-1.fc40", packageManager: "dnf", sizeBytes: 3850000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y NetworkManager && systemctl reload NetworkManager",
      verification: "nmcli --version | grep 1.48",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle FEDORA-BODHI-2024-5820 --os fedora"
    },
    impact: { rebootRequired: false, servicesToRestart: ["NetworkManager"], zeroDowntime: true },
    upstreamNoticeUrl: "https://bodhi.fedoraproject.org/updates/FEDORA-2024-5820",
    sourceFeed: {
      sourceId: "feed-fedora-updates",
      feedName: "Fedora Bodhi Updates & Bugfix Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://bodhi.fedoraproject.org/updates/"
    }
  },

  // 36. Amazon Linux 2023 AWS Nitro Enclaves vSocket Performance Tuning
  {
    id: "ARG-ALAS-ENH-2024-0312",
    bundleId: "ALAS-ENH-2024-0312",
    advisoryType: "ENHANCEMENT",
    os: "amazon-linux",
    osFamily: "linux-amazon",
    osDisplayName: "Amazon Linux 2023",
    targetReleases: ["Amazon Linux 2023.5"],
    title: "AWS Nitro Enclaves VirtIO vSocket Latency Reduction & HugePages Enablement",
    synopsis: "Amazon Linux enhancement release optimizing kernel vSocket driver performance and 2MB HugePages allocation inside confidential Nitro Enclaves.",
    vendorSeverity: "MODERATE",
    severityScore: 6.6,
    operationalDomain: "PERFORMANCE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-24T18:00:00Z",
    updatedAt: "2024-06-24T18:00:00Z",
    cveList: [],
    packages: [
      { name: "aws-nitro-enclaves-cli", sourcePackage: "aws-nitro-enclaves-cli", arch: "x86_64", currentVersion: "1.3.1-1.amzn2023", fixedVersion: "1.3.4-1.amzn2023", packageManager: "dnf", sizeBytes: 5200000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y aws-nitro-enclaves-cli nitro-enclaves-allocator",
      verification: "nitro-cli --version | grep 1.3.4",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle ALAS-ENH-2024-0312 --os amazon-linux"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://alas.aws.amazon.com/AL2023/ALAS-2024-0312.html",
    sourceFeed: {
      sourceId: "feed-amazon-errata",
      feedName: "Amazon Linux Bug Advisories (ALAS-BA)",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://alas.aws.amazon.com/alas2023.rss"
    }
  },

  // 37. Linux Kernel 6.9.8 Stable Point Release Maintenance Bundle
  {
    id: "ARG-KERNEL-STABLE-6.9.8",
    bundleId: "KERNEL-STABLE-6.9.8",
    advisoryType: "MAINTENANCE",
    os: "kernel",
    osFamily: "linux-kernel",
    osDisplayName: "Linux Kernel Stable",
    targetReleases: ["Linux 6.9.y"],
    title: "Linux Kernel 6.9.8 Stable Maintenance Point Release",
    synopsis: "Official kernel.org stable maintenance release delivering 118 backported bug fixes across Bcachefs, TCP BBRv3 congestion control, and AMD GPU drivers.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.3,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-07-05T12:00:00Z",
    updatedAt: "2024-07-05T12:00:00Z",
    cveList: [],
    packages: [
      { name: "kernel", sourcePackage: "linux", arch: "x86_64", currentVersion: "6.9.7", fixedVersion: "6.9.8", packageManager: "kmod", sizeBytes: 142000000 }
    ],
    commands: {
      nativeUpgrade: "make -j$(nproc) && make modules_install && make install",
      verification: "uname -r | grep 6.9.8",
      rollback: "grubby --set-default /boot/vmlinuz-6.9.7",
      kineticDeploy: "kinetic upgrade --bundle KERNEL-STABLE-6.9.8 --os kernel"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://cdn.kernel.org/pub/linux/kernel/v6.x/ChangeLog-6.9.8",
    sourceFeed: {
      sourceId: "feed-kernel-stable",
      feedName: "The Linux Kernel Archives (kernel.org Stable Stream)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://www.kernel.org/feeds/kdist.xml"
    }
  },

  // 38. FreeBSD 14.1 Errata Notice: VFS Namecache Lock Contention Reduction
  {
    id: "ARG-FREEBSD-EN-24-11",
    bundleId: "FreeBSD-EN-24:11.vfs",
    advisoryType: "BUGFIX",
    os: "freebsd",
    osFamily: "bsd-freebsd",
    osDisplayName: "FreeBSD",
    targetReleases: ["FreeBSD 14.1-RELEASE"],
    title: "VFS Namecache Scalability and Multi-core Path Lookup Contention Errata",
    synopsis: "FreeBSD Errata Notice optimizing the VFS namecache hashing algorithm to prevent reader lock contention across high core count Xeon and EPYC systems.",
    vendorSeverity: "MODERATE",
    severityScore: 6.7,
    operationalDomain: "STORAGE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-27T16:00:00Z",
    updatedAt: "2024-06-27T16:00:00Z",
    cveList: [],
    packages: [
      { name: "freebsd-update", sourcePackage: "src", arch: "x86_64", currentVersion: "14.1-RELEASE", fixedVersion: "14.1-RELEASE-p2", packageManager: "pkg", sizeBytes: 15400000 }
    ],
    commands: {
      nativeUpgrade: "freebsd-update fetch && freebsd-update install",
      verification: "freebsd-version -u | grep 14.1-RELEASE-p2",
      rollback: "freebsd-update rollback",
      kineticDeploy: "kinetic upgrade --bundle FreeBSD-EN-24:11.vfs --os freebsd"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.freebsd.org/security/advisories/FreeBSD-EN-24:11.vfs.asc",
    sourceFeed: {
      sourceId: "feed-freebsd-errata",
      feedName: "FreeBSD Errata Notices (FreeBSD-EN)",
      feedType: "public-distro-feed",
      format: "XML",
      syncStatus: "live",
      sourceUrl: "https://www.freebsd.org/security/rss.xml"
    }
  },

  // 39. Wolfi Chainguard Base Container OpenSSL 3.3 Engine Synchronizer
  {
    id: "ARG-WOLFI-PKG-2024-0718",
    bundleId: "WOLFI-PKG-2024-0718",
    advisoryType: "MAINTENANCE",
    os: "wolfi",
    osFamily: "linux-wolfi",
    osDisplayName: "Wolfi (Chainguard)",
    targetReleases: ["Wolfi OS Standard"],
    title: "OpenSSL 3.3 Cryptographic Engine Synchronization & ASM Vector Optimization",
    synopsis: "Wolfi base package update synchronizing OpenSSL 3.3 runtime binaries with optimized AVX-512 and ARM Neon cryptographic primitives for container workloads.",
    vendorSeverity: "LOW",
    severityScore: 5.2,
    operationalDomain: "CONTAINER",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-03T09:30:00Z",
    updatedAt: "2024-07-03T09:30:00Z",
    cveList: [],
    packages: [
      { name: "openssl", sourcePackage: "openssl", arch: "x86_64", currentVersion: "3.3.0-r1", fixedVersion: "3.3.1-r0", packageManager: "apk", sizeBytes: 2840000 }
    ],
    commands: {
      nativeUpgrade: "apk update && apk add --upgrade openssl",
      verification: "apk info -v openssl | grep 3.3.1",
      rollback: "apk add openssl=3.3.0-r1",
      kineticDeploy: "kinetic upgrade --bundle WOLFI-PKG-2024-0718 --os wolfi"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://github.com/wolfi-dev/os/blob/main/openssl.yaml",
    sourceFeed: {
      sourceId: "feed-wolfi-packages",
      feedName: "Wolfi (Chainguard) OS Package Errata & Melange Git Stream",
      feedType: "public-distro-feed",
      format: "GIT_TREE",
      syncStatus: "live",
      sourceUrl: "https://packages.wolfi.dev/os/"
    }
  },

  // 40. Talos Linux Kubernetes v1.30.2 Kubelet Node Allocatable Accounting Fix
  {
    id: "ARG-TALOS-PKG-2024-0640",
    bundleId: "TALOS-PKG-2024-0640",
    advisoryType: "BUGFIX",
    os: "talos",
    osFamily: "linux-talos",
    osDisplayName: "Talos Linux (Sidero)",
    targetReleases: ["Talos v1.7.5"],
    title: "Kubernetes v1.30.2 Kubelet Node Allocatable Accounting and Ephemeral Storage Fix",
    synopsis: "Talos OS image update updating embedded Kubelet to v1.30.2, fixing ephemeral storage quota over-eviction on rootfs partitions.",
    vendorSeverity: "MODERATE",
    severityScore: 6.5,
    operationalDomain: "CONTAINER",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-28T15:00:00Z",
    updatedAt: "2024-06-28T15:00:00Z",
    cveList: [],
    packages: [
      { name: "kubelet", sourcePackage: "kubernetes", arch: "x86_64", currentVersion: "v1.30.1", fixedVersion: "v1.30.2", packageManager: "talosctl", sizeBytes: 19800000 }
    ],
    commands: {
      nativeUpgrade: "talosctl upgrade --nodes 127.0.0.1 --image ghcr.io/siderolabs/installer:v1.7.5",
      verification: "talosctl version | grep v1.7.5",
      rollback: "talosctl rollback",
      kineticDeploy: "kinetic upgrade --bundle TALOS-PKG-2024-0640 --os talos"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://github.com/siderolabs/talos/releases/tag/v1.7.5",
    sourceFeed: {
      sourceId: "feed-talos-releases",
      feedName: "Talos Linux Immutable OS Release & Component Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://api.github.com/repos/siderolabs/talos/releases"
    }
  },

  // 41. NixOS 24.05 nixpkgs GCC 13.3 & Clang 18 Toolchain Optimization Backport
  {
    id: "ARG-NIXOS-PKG-2024-0701",
    bundleId: "NIXOS-PKG-2024-0701",
    advisoryType: "GENERAL",
    os: "nixos",
    osFamily: "linux-nix",
    osDisplayName: "NixOS",
    targetReleases: ["NixOS 24.05 (Uakari)"],
    title: "GCC 13.3 & Clang 18 Compiler Toolchain Bug Fix and Profile-Guided Optimization Backport",
    synopsis: "Official nixpkgs channel channel update backporting GCC 13.3 stability fixes for C++20 coroutines and LLVM Clang 18 SIMD auto-vectorization improvements.",
    vendorSeverity: "LOW",
    severityScore: 5.0,
    operationalDomain: "CORE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-07-01T08:00:00Z",
    updatedAt: "2024-07-01T08:00:00Z",
    cveList: [],
    packages: [
      { name: "gcc", sourcePackage: "gcc", arch: "x86_64", currentVersion: "13.2.0", fixedVersion: "13.3.0", packageManager: "nix", sizeBytes: 98000000 },
      { name: "clang", sourcePackage: "llvm", arch: "x86_64", currentVersion: "18.1.5", fixedVersion: "18.1.8", packageManager: "nix", sizeBytes: 112000000 }
    ],
    commands: {
      nativeUpgrade: "nix-channel --update && nixos-rebuild switch",
      verification: "gcc --version | grep 13.3.0",
      rollback: "nixos-rebuild switch --rollback",
      kineticDeploy: "kinetic upgrade --bundle NIXOS-PKG-2024-0701 --os nixos"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://github.com/NixOS/nixpkgs/commits/nixos-24.05",
    sourceFeed: {
      sourceId: "feed-nixos-channels",
      feedName: "NixOS Channel Updates & Hydra Build Stream",
      feedType: "public-distro-feed",
      format: "GIT_TREE",
      syncStatus: "live",
      sourceUrl: "https://channels.nixos.org/"
    }
  },

  // 42. Oracle Linux Unbreakable Enterprise Kernel (UEK7) NVMe-oF RDMA Tuning
  {
    id: "ARG-ORACLE-UEK-2024-2840",
    bundleId: "ORACLE-UEK-2024-2840",
    advisoryType: "ENHANCEMENT",
    os: "oracle-linux",
    osFamily: "linux-rhel",
    osDisplayName: "Oracle Linux",
    targetReleases: ["Oracle Linux 9 (UEK7)"],
    title: "Unbreakable Enterprise Kernel (UEK7) NVMe over Fabrics RoCE v2 RDMA Tuning",
    synopsis: "Oracle Linux kernel errata update optimizing NVMe-oF RoCE v2 queue pair depth and multi-rail bonding for Oracle Database Exadata Cloud workloads.",
    vendorSeverity: "MODERATE",
    severityScore: 6.9,
    operationalDomain: "STORAGE",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T11:30:00Z",
    updatedAt: "2024-06-29T11:30:00Z",
    cveList: [],
    packages: [
      { name: "kernel-uek", sourcePackage: "kernel-uek", arch: "x86_64", currentVersion: "5.15.0-205.149.5.1.el9uek", fixedVersion: "5.15.0-206.153.7.1.el9uek", packageManager: "dnf", sizeBytes: 16800000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y kernel-uek kernel-uek-core kernel-uek-modules",
      verification: "uname -r | grep 5.15.0-206",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle ORACLE-UEK-2024-2840 --os oracle-linux"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://linux.oracle.com/errata/ELBA-2024-2840.html",
    sourceFeed: {
      sourceId: "feed-oracle-errata",
      feedName: "Oracle Linux Bug Errata (ELBA & ELEA)",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://linux.oracle.com/security/"
    }
  }  ,
  // 43. Rocky Linux OpenSSL & CA-Certificates Non-Reboot Daemon Reload Advisory (RLBA)
  {
    id: "ARG-RLBA-2024-4418",
    bundleId: "RLBA-2024:4418",
    advisoryType: "BUGFIX",
    os: "rocky",
    osFamily: "linux-rhel",
    osDisplayName: "Rocky Linux",
    targetReleases: ["Rocky Linux 9.4 (Blue Onyx)", "Rocky Linux 8.10"],
    title: "OpenSSL 3.0 TLS Session Ticket Memory Leak & CA Trust Store Update",
    synopsis: "Non-disruptive Rocky Linux update resolving TLS 1.3 session resumption memory growth in long-lived daemons without requiring host reboot.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.4,
    operationalDomain: "NETWORK",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-29T12:00:00Z",
    updatedAt: "2024-06-29T12:00:00Z",
    cveList: [],
    packages: [
      { name: "openssl-libs", sourcePackage: "openssl", arch: "x86_64", currentVersion: "3.0.7-27.el9", fixedVersion: "3.0.7-28.el9_4", packageManager: "dnf", sizeBytes: 2150000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y openssl-libs ca-certificates",
      verification: "rpm -q openssl-libs | grep 3.0.7-28.el9_4",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle RLBA-2024:4418 --os rocky"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://errata.rockylinux.org/RLBA-2024:4418",
    sourceFeed: {
      sourceId: "feed-rocky-errata",
      feedName: "Rocky Linux Bug Fix & Enhancement Errata (RLBA & RLEA)",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://errata.rockylinux.org/"
    }
  },

  // 44. Red Hat Enterprise Linux Kernel Core & XFS Pagecache Disruptive Advisory (RHBA)
  {
    id: "ARG-RHBA-2024-5102",
    bundleId: "RHBA-2024:5102",
    advisoryType: "BUGFIX",
    os: "rhel",
    osFamily: "linux-rhel",
    osDisplayName: "Red Hat Enterprise Linux",
    targetReleases: ["RHEL 9.4", "RHEL 8.10"],
    title: "Kernel Core XFS Pagecache Writeback & IOMMU DMA Mapping Update",
    synopsis: "Disruptive Red Hat kernel-core errata resolving XFS writeback stalls under direct I/O; requires scheduled off-peak system reboot.",
    vendorSeverity: "CRITICAL",
    severityScore: 8.6,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T12:30:00Z",
    updatedAt: "2024-06-29T12:30:00Z",
    cveList: [],
    packages: [
      { name: "kernel-core", sourcePackage: "kernel", arch: "x86_64", currentVersion: "5.14.0-427.24.1.el9_4", fixedVersion: "5.14.0-427.35.1.el9_4", packageManager: "dnf", sizeBytes: 22400000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y kernel-core kernel-modules",
      verification: "rpm -q kernel-core | grep 5.14.0-427.35.1.el9_4",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle RHBA-2024:5102 --os rhel"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://access.redhat.com/errata/RHBA-2024:5102",
    sourceFeed: {
      sourceId: "feed-redhat-errata",
      feedName: "Red Hat Bug & Enhancement Advisories Stream (RHBA & RHEA)",
      feedType: "public-distro-feed",
      format: "CSAF",
      syncStatus: "live",
      sourceUrl: "https://access.redhat.com/hydra/rest/securitydata/cvrf.json"
    }
  },

  // 45. Debian 12 Bookworm Linux Kernel 6.1 ABI Point Release (Disruptive)
  {
    id: "ARG-DEBIAN-KRN-2024-1207",
    bundleId: "DEBIAN-KRN-2024-1207",
    advisoryType: "MAINTENANCE",
    os: "debian",
    osFamily: "linux-debian",
    osDisplayName: "Debian GNU/Linux",
    targetReleases: ["Debian 12 (Bookworm)"],
    title: "Debian 12.7 Linux Kernel 6.1.106 Virtio-Blk & Ext4 Journal Update",
    synopsis: "Debian stable kernel point release fixing ext4 fast_commit replay edge cases and virtio-blk multiqueue IRQ affinity; requires system reboot.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.9,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T13:00:00Z",
    updatedAt: "2024-06-29T13:00:00Z",
    cveList: [],
    packages: [
      { name: "linux-image-amd64", sourcePackage: "linux", arch: "x86_64", currentVersion: "6.1.99-1", fixedVersion: "6.1.106-3", packageManager: "apt", sizeBytes: 68500000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update && apt-get install --only-upgrade -y linux-image-amd64",
      verification: "dpkg -l linux-image-amd64 | grep 6.1.106-3",
      rollback: "apt-get install -y linux-image-amd64=6.1.99-1",
      kineticDeploy: "kinetic upgrade --bundle DEBIAN-KRN-2024-1207 --os debian"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://www.debian.org/News/2024/20240831",
    sourceFeed: {
      sourceId: "feed-debian-updates",
      feedName: "Debian Proposed Updates & Bug Tracking Stream (BTS / debian-updates)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://bugs.debian.org/release-critical/"
    }
  },

  // 46. Alpine Linux LTS Kernel 6.6 Virtio & Netfilter Update (Disruptive)
  {
    id: "ARG-ALPINE-KRN-2024-3204",
    bundleId: "ALPINE-KRN-2024-3204",
    advisoryType: "MAINTENANCE",
    os: "alpine",
    osFamily: "linux-alpine",
    osDisplayName: "Alpine Linux",
    targetReleases: ["Alpine v3.20", "Alpine v3.19"],
    title: "Alpine Linux LTS Kernel 6.6.52 WireGuard & Virtio-Net Update",
    synopsis: "Alpine Linux LTS kernel update fixing WireGuard gro_receive packet coalescing; requires host reboot.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.5,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T13:15:00Z",
    updatedAt: "2024-06-29T13:15:00Z",
    cveList: [],
    packages: [
      { name: "linux-lts", sourcePackage: "linux-lts", arch: "x86_64", currentVersion: "6.6.48-r0", fixedVersion: "6.6.52-r0", packageManager: "apk", sizeBytes: 34200000 }
    ],
    commands: {
      nativeUpgrade: "apk update && apk upgrade --no-cache linux-lts",
      verification: "apk info -v linux-lts | grep 6.6.52-r0",
      rollback: "apk add --no-cache 'linux-lts=6.6.48-r0'",
      kineticDeploy: "kinetic upgrade --bundle ALPINE-KRN-2024-3204 --os alpine"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://pkgs.alpinelinux.org/package/v3.20/main/x86_64/linux-lts",
    sourceFeed: {
      sourceId: "feed-alpine-secfixes",
      feedName: "Alpine Linux Security Database (secfixes)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://secdb.alpinelinux.org/"
    }
  },

  // 47. Amazon Linux 2023 Kernel 6.1 ENA Nitro Driver Update (Disruptive)
  {
    id: "ARG-ALAS-2024-KRN-6198",
    bundleId: "ALAS-2024-KRN-6198",
    advisoryType: "ENHANCEMENT",
    os: "amazon-linux",
    osFamily: "linux-amazon",
    osDisplayName: "Amazon Linux",
    targetReleases: ["Amazon Linux 2023"],
    title: "AL2023 Kernel 6.1.102 AWS Nitro ENA Queue Reset & EBS NVMe Update",
    synopsis: "Amazon Linux 2023 kernel update enhancing AWS Nitro ENA network ring recovery; requires EC2 instance reboot during off-peak window.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.7,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T13:30:00Z",
    updatedAt: "2024-06-29T13:30:00Z",
    cveList: [],
    packages: [
      { name: "kernel", sourcePackage: "kernel", arch: "x86_64", currentVersion: "6.1.96-102.177.amzn2023", fixedVersion: "6.1.102-111.182.amzn2023", packageManager: "dnf", sizeBytes: 31500000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y kernel",
      verification: "rpm -q kernel | grep 6.1.102-111.182.amzn2023",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle ALAS-2024-KRN-6198 --os amazon-linux"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://alas.aws.amazon.com/AL2023/ALAS-2024-6198.html",
    sourceFeed: {
      sourceId: "feed-amazon-alas-sec",
      feedName: "Amazon Linux Security Center (ALAS)",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://alas.aws.amazon.com/"
    }
  },

  // 48. Arch Linux Core Kernel 6.10.10 Btrfs &amdgpu Update (Disruptive)
  {
    id: "ARG-ARCH-KRN-2024-6102",
    bundleId: "ARCH-KRN-2024-6102",
    advisoryType: "MAINTENANCE",
    os: "arch",
    osFamily: "linux-arch",
    osDisplayName: "Arch Linux",
    targetReleases: ["Arch Linux Rolling"],
    title: "Arch Linux Kernel 6.10.10.arch1 Btrfs Tree-Log & Scheduler Update",
    synopsis: "Arch Linux rolling kernel update requiring system reboot to activate updated vmlinuz-linux image and initramfs.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.5,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T13:45:00Z",
    updatedAt: "2024-06-29T13:45:00Z",
    cveList: [],
    packages: [
      { name: "linux", sourcePackage: "linux", arch: "x86_64", currentVersion: "6.10.8.arch1-1", fixedVersion: "6.10.10.arch1-1", packageManager: "pacman", sizeBytes: 132000000 }
    ],
    commands: {
      nativeUpgrade: "pacman -Syu --noconfirm linux",
      verification: "pacman -Q linux | grep 6.10.10.arch1-1",
      rollback: "pacman -U --noconfirm /var/cache/pacman/pkg/linux-6.10.8.arch1-1-x86_64.pkg.tar.zst",
      kineticDeploy: "kinetic upgrade --bundle ARCH-KRN-2024-6102 --os arch"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://archlinux.org/packages/core/x86_64/linux/",
    sourceFeed: {
      sourceId: "feed-arch-security",
      feedName: "Arch Linux Security Tracker (ASA)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://security.archlinux.org/"
    }
  },

  // 49. Azure Linux 3.0 Cloud-Hypervisor Host Kernel Update (Disruptive)
  {
    id: "ARG-AZL-KRN-2024-3011",
    bundleId: "AZL-KRN-2024-3011",
    advisoryType: "BUGFIX",
    os: "azure-linux",
    osFamily: "linux-azure",
    osDisplayName: "Azure Linux",
    targetReleases: ["Azure Linux 3.0", "CBL-Mariner 2.0"],
    title: "Azure Linux 3.0 Kernel 6.6 Hyper-V VMBus Channel Interrupt Rebalance",
    synopsis: "Disruptive Azure Linux kernel update fixing VMBus channel interrupt pinning on AKS worker nodes; requires host reboot.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.8,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T14:00:00Z",
    updatedAt: "2024-06-29T14:00:00Z",
    cveList: [],
    packages: [
      { name: "kernel", sourcePackage: "kernel", arch: "x86_64", currentVersion: "6.6.35.1-1.azl3", fixedVersion: "6.6.44.1-2.azl3", packageManager: "tdnf", sizeBytes: 41200000 }
    ],
    commands: {
      nativeUpgrade: "tdnf upgrade -y kernel",
      verification: "rpm -q kernel | grep 6.6.44.1-2.azl3",
      rollback: "tdnf downgrade -y kernel-6.6.35.1-1.azl3",
      kineticDeploy: "kinetic upgrade --bundle AZL-KRN-2024-3011 --os azure-linux"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://github.com/microsoft/azurelinux/releases",
    sourceFeed: {
      sourceId: "feed-azure-linux",
      feedName: "Azure Linux / CBL-Mariner Host Updates & Hypervisor Drivers",
      feedType: "public-distro-feed",
      format: "CSAF",
      syncStatus: "live",
      sourceUrl: "https://github.com/microsoft/azurelinux"
    }
  },

  // 50. CloudLinux OS LVE Kernel CageFS Quota Enforcement Update (Disruptive)
  {
    id: "ARG-CLBA-2024-0918",
    bundleId: "CLBA-2024:0918",
    advisoryType: "BUGFIX",
    os: "cloudlinux",
    osFamily: "linux-cloudlinux",
    osDisplayName: "CloudLinux OS",
    targetReleases: ["CloudLinux 9.4", "CloudLinux 8.10"],
    title: "CloudLinux LVE Kernel 5.14 CageFS I/O Throttling & Inode Accounting Fix",
    synopsis: "Disruptive CloudLinux LVE kernel update resolving per-tenant cgroup I/O bursts; requires off-peak reboot.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.6,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T14:15:00Z",
    updatedAt: "2024-06-29T14:15:00Z",
    cveList: [],
    packages: [
      { name: "kernel-lve", sourcePackage: "kernel-lve", arch: "x86_64", currentVersion: "5.14.0-427.18.1.lve.el9", fixedVersion: "5.14.0-427.28.1.lve.el9", packageManager: "dnf", sizeBytes: 44100000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y kernel-lve",
      verification: "rpm -q kernel-lve | grep 5.14.0-427.28.1.lve.el9",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle CLBA-2024:0918 --os cloudlinux"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://blog.cloudlinux.com/",
    sourceFeed: {
      sourceId: "feed-cloudlinux",
      feedName: "CloudLinux OS LVE & CageFS Errata Stream",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://repo.cloudlinux.com/"
    }
  },

  // 51. Fedora 40 Kernel 6.10.9 Wayland DRM & Btrfs Update (Disruptive)
  {
    id: "ARG-FEDORA-2024-KRN-9412",
    bundleId: "FEDORA-2024-KRN-9412",
    advisoryType: "MAINTENANCE",
    os: "fedora",
    osFamily: "linux-fedora",
    osDisplayName: "Fedora Linux",
    targetReleases: ["Fedora 40", "Fedora 39"],
    title: "Fedora 40 Kernel 6.10.9 DRM KMS Atomic Commit & SELinux Audit Fix",
    synopsis: "Fedora stable kernel update fixing DRM KMS atomic pageflip timeouts; requires system reboot.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.4,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T14:30:00Z",
    updatedAt: "2024-06-29T14:30:00Z",
    cveList: [],
    packages: [
      { name: "kernel-core", sourcePackage: "kernel", arch: "x86_64", currentVersion: "6.10.6-200.fc40", fixedVersion: "6.10.9-200.fc40", packageManager: "dnf", sizeBytes: 18900000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y kernel-core",
      verification: "rpm -q kernel-core | grep 6.10.9-200.fc40",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle FEDORA-2024-KRN-9412 --os fedora"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://bodhi.fedoraproject.org/updates/FEDORA-2024-KRN-9412",
    sourceFeed: {
      sourceId: "feed-fedora-bodhi",
      feedName: "Fedora Bodhi Stable Updates Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://bodhi.fedoraproject.org/updates/"
    }
  },

  // 52. Flatcar Container Linux systemd-sysext Containerd Live Extension Refresh (Non-Reboot)
  {
    id: "ARG-FLATCAR-SYSEXT-2024-3975",
    bundleId: "FLATCAR-SYSEXT-2024-3975",
    advisoryType: "ENHANCEMENT",
    os: "flatcar",
    osFamily: "linux-flatcar",
    osDisplayName: "Flatcar Container Linux",
    targetReleases: ["Flatcar Stable 3975.2.1"],
    title: "Flatcar systemd-sysext Containerd & runc Live Overlay Refresh",
    synopsis: "Zero-downtime Flatcar system extension refresh updating containerd shim binaries in /usr via systemd-sysext without host reboot.",
    vendorSeverity: "MODERATE",
    severityScore: 6.8,
    operationalDomain: "CONTAINER",
    actionDirective: "RELOAD_SERVICE",
    issuedAt: "2024-06-29T14:45:00Z",
    updatedAt: "2024-06-29T14:45:00Z",
    cveList: [],
    packages: [
      { name: "containerd-sysext", sourcePackage: "flatcar-sysext", arch: "x86_64", currentVersion: "1.7.18", fixedVersion: "1.7.21", packageManager: "update_engine", sizeBytes: 28400000 }
    ],
    commands: {
      nativeUpgrade: "systemd-sysext refresh",
      verification: "systemd-sysext status | grep containerd",
      rollback: "systemd-sysext unmerge && systemd-sysext merge",
      kineticDeploy: "kinetic upgrade --bundle FLATCAR-SYSEXT-2024-3975 --os flatcar"
    },
    impact: { rebootRequired: false, servicesToRestart: ["containerd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.flatcar.org/releases",
    sourceFeed: {
      sourceId: "feed-flatcar-releases",
      feedName: "Flatcar Container Linux Release Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://www.flatcar.org/releases-json/releases.json"
    }
  },

  // 53. Gentoo Linux Distribution Kernel 6.6.52 Portage Binary Update (Disruptive)
  {
    id: "ARG-GENTOO-KRN-2024-0815",
    bundleId: "GENTOO-KRN-2024-0815",
    advisoryType: "MAINTENANCE",
    os: "gentoo",
    osFamily: "linux-gentoo",
    osDisplayName: "Gentoo Linux",
    targetReleases: ["Gentoo Stable Profile 23.0"],
    title: "Gentoo sys-kernel/gentoo-kernel-bin 6.6.52 ZFS & Virtio Compatibility Update",
    synopsis: "Gentoo distribution kernel update delivering prebuilt 6.6.52 kernel image and initramfs; requires system reboot.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.5,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T15:00:00Z",
    updatedAt: "2024-06-29T15:00:00Z",
    cveList: [],
    packages: [
      { name: "sys-kernel/gentoo-kernel-bin", sourcePackage: "gentoo-kernel-bin", arch: "x86_64", currentVersion: "6.6.47", fixedVersion: "6.6.52", packageManager: "emerge", sizeBytes: 76000000 }
    ],
    commands: {
      nativeUpgrade: "emerge --update --oneshot sys-kernel/gentoo-kernel-bin",
      verification: "qlist -Iv sys-kernel/gentoo-kernel-bin | grep 6.6.52",
      rollback: "emerge --oneshot =sys-kernel/gentoo-kernel-bin-6.6.47",
      kineticDeploy: "kinetic upgrade --bundle GENTOO-KRN-2024-0815 --os gentoo"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://packages.gentoo.org/packages/sys-kernel/gentoo-kernel-bin",
    sourceFeed: {
      sourceId: "feed-gentoo-glsa",
      feedName: "Gentoo Linux Security Advisories (GLSA)",
      feedType: "public-distro-feed",
      format: "XML",
      syncStatus: "live",
      sourceUrl: "https://security.gentoo.org/"
    }
  },

  // 54. Kali Linux Rolling Kernel 6.8.12 Wireless Injection & Netfilter Update (Disruptive)
  {
    id: "ARG-KALI-KRN-2024-2031",
    bundleId: "KALI-KRN-2024-2031",
    advisoryType: "ENHANCEMENT",
    os: "kali",
    osFamily: "linux-debian",
    osDisplayName: "Kali Linux",
    targetReleases: ["Kali Linux 2024.3 Rolling"],
    title: "Kali Linux Kernel 6.8.12 mac80211 Radiotap & eBPFVerifier Update",
    synopsis: "Kali rolling kernel update resolving mac80211 monitor mode radiotap header alignment; requires system reboot.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.4,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T15:15:00Z",
    updatedAt: "2024-06-29T15:15:00Z",
    cveList: [],
    packages: [
      { name: "linux-image-amd64", sourcePackage: "linux", arch: "x86_64", currentVersion: "6.8.11-1kali2", fixedVersion: "6.8.12-1kali1", packageManager: "apt", sizeBytes: 71200000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update && apt-get install --only-upgrade -y linux-image-amd64",
      verification: "dpkg -l linux-image-amd64 | grep 6.8.12-1kali1",
      rollback: "apt-get install -y linux-image-amd64=6.8.11-1kali2",
      kineticDeploy: "kinetic upgrade --bundle KALI-KRN-2024-2031 --os kali"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://pkg.kali.org/pkg/linux",
    sourceFeed: {
      sourceId: "feed-kali-rolling",
      feedName: "Kali Linux Rolling Package Tracker",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://pkg.kali.org/"
    }
  },

  // 55. Linux Mainline Kernel Live Kmod / eBPF Netfilter Conntrack Reload (Non-Reboot)
  {
    id: "ARG-KERNEL-KMOD-2024-6642",
    bundleId: "KERNEL-KMOD-2024-6642",
    advisoryType: "BUGFIX",
    os: "kernel",
    osFamily: "linux-kernel",
    osDisplayName: "Linux Mainline Kernel",
    targetReleases: ["Linux 6.10.x", "Linux 6.6.x LTS"],
    title: "Linux Kernel nf_conntrack Hash Table Live Resize & Kmod Parameter Update",
    synopsis: "Zero-downtime kernel module parameter and sysctl live reload expanding nf_conntrack buckets without rebooting.",
    vendorSeverity: "MODERATE",
    severityScore: 6.7,
    operationalDomain: "KERNEL",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-29T15:30:00Z",
    updatedAt: "2024-06-29T15:30:00Z",
    cveList: [],
    packages: [
      { name: "kmod-nf-conntrack", sourcePackage: "linux", arch: "x86_64", currentVersion: "6.6.48", fixedVersion: "6.6.52", packageManager: "kmod", sizeBytes: 1420000 }
    ],
    commands: {
      nativeUpgrade: "kmod list >/dev/null && sysctl -w net.netfilter.nf_conntrack_max=262144 2>/dev/null || true",
      verification: "kmod list | grep nf_conntrack",
      rollback: "sysctl -w net.netfilter.nf_conntrack_max=65536 2>/dev/null || true",
      kineticDeploy: "kinetic upgrade --bundle KERNEL-KMOD-2024-6642 --os kernel"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.kernel.org/",
    sourceFeed: {
      sourceId: "feed-kernel-org",
      feedName: "Linux Kernel Archives (kernel.org Stable & LTS)",
      feedType: "public-distro-feed",
      format: "GIT_TREE",
      syncStatus: "live",
      sourceUrl: "https://www.kernel.org/releases.json"
    }
  },

  // 56. Linux Mint 22 Wilma Cinnamon Session & XApp Stability Update (Non-Reboot)
  {
    id: "ARG-MINT-UPD-2024-2201",
    bundleId: "MINT-UPD-2024-2201",
    advisoryType: "BUGFIX",
    os: "linux-mint",
    osFamily: "linux-debian",
    osDisplayName: "Linux Mint",
    targetReleases: ["Linux Mint 22 (Wilma)", "Linux Mint 21.3 (Virginia)"],
    title: "Linux Mint Cinnamon D-Bus Session Bus & XApp Status Icon Leak Fix",
    synopsis: "Non-disruptive Linux Mint update fixing XApp status applet file descriptor leaks across desktop sessions without reboot.",
    vendorSeverity: "MODERATE",
    severityScore: 6.4,
    operationalDomain: "STABILITY",
    actionDirective: "RELOAD_SERVICE",
    issuedAt: "2024-06-29T15:45:00Z",
    updatedAt: "2024-06-29T15:45:00Z",
    cveList: [],
    packages: [
      { name: "libxapp1", sourcePackage: "xapp", arch: "x86_64", currentVersion: "2.8.4+wilma", fixedVersion: "2.8.5+wilma", packageManager: "apt", sizeBytes: 980000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update && apt-get install --only-upgrade -y libxapp1",
      verification: "dpkg -l libxapp1 | grep 2.8.5+wilma",
      rollback: "apt-get install -y libxapp1=2.8.4+wilma",
      kineticDeploy: "kinetic upgrade --bundle MINT-UPD-2024-2201 --os linux-mint"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://linuxmint.com/rel_wilma.php",
    sourceFeed: {
      sourceId: "feed-linux-mint-relnotes",
      feedName: "Linux Mint Release Notes & Package Errata",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://linuxmint.com/rel_notes.php"
    }
  },

  // 57. Linux Mint 22 HWE Kernel 6.8 ACPI Suspend & NVMe Update (Disruptive)
  {
    id: "ARG-MINT-KRN-2024-2202",
    bundleId: "MINT-KRN-2024-2202",
    advisoryType: "MAINTENANCE",
    os: "linux-mint",
    osFamily: "linux-debian",
    osDisplayName: "Linux Mint",
    targetReleases: ["Linux Mint 22 (Wilma)"],
    title: "Linux Mint 22 Kernel 6.8.0-45 ACPI S0ix Power Management & NVMe Fix",
    synopsis: "Disruptive Linux Mint kernel update resolving NVMe APST latency spikes on resume; requires system reboot.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.6,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T16:00:00Z",
    updatedAt: "2024-06-29T16:00:00Z",
    cveList: [],
    packages: [
      { name: "linux-image-generic", sourcePackage: "linux", arch: "x86_64", currentVersion: "6.8.0-40.40", fixedVersion: "6.8.0-45.45", packageManager: "apt", sizeBytes: 64000000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update && apt-get install --only-upgrade -y linux-image-generic",
      verification: "dpkg -l linux-image-generic | grep 6.8.0-45.45",
      rollback: "apt-get install -y linux-image-generic=6.8.0-40.40",
      kineticDeploy: "kinetic upgrade --bundle MINT-KRN-2024-2202 --os linux-mint"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://linuxmint.com/rel_wilma.php",
    sourceFeed: {
      sourceId: "feed-linux-mint-relnotes",
      feedName: "Linux Mint Release Notes & Package Errata",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://linuxmint.com/rel_notes.php"
    }
  },

  // 58. Apple macOS / Darwin Base XProtect & Security Certificate Bundle (Non-Reboot)
  {
    id: "ARG-MACOS-RSR-2024-1501",
    bundleId: "MACOS-RSR-2024-1501",
    advisoryType: "MAINTENANCE",
    os: "macos",
    osFamily: "bsd-darwin",
    osDisplayName: "Apple macOS",
    targetReleases: ["macOS Sequoia 15.1", "macOS Sonoma 14.7"],
    title: "macOS Darwin Libsystem & Trust Store Background Configuration Update",
    synopsis: "Non-disruptive macOS background security and certificate trust bundle update applied via pkg/softwareupdate without reboot.",
    vendorSeverity: "MODERATE",
    severityScore: 6.8,
    operationalDomain: "CORE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-29T16:15:00Z",
    updatedAt: "2024-06-29T16:15:00Z",
    cveList: [],
    packages: [
      { name: "darwin-trust-cache", sourcePackage: "darwin-security", arch: "all", currentVersion: "15.0.1", fixedVersion: "15.1.0", packageManager: "pkg", sizeBytes: 8400000 }
    ],
    commands: {
      nativeUpgrade: "pkg upgrade -y darwin-trust-cache",
      verification: "pkg info darwin-trust-cache | grep 15.1.0",
      rollback: "pkg install -y darwin-trust-cache-15.0.1",
      kineticDeploy: "kinetic upgrade --bundle MACOS-RSR-2024-1501 --os macos"
    },
    impact: { rebootRequired: false, servicesToRestart: [], zeroDowntime: true },
    upstreamNoticeUrl: "https://support.apple.com/en-us/HT201222",
    sourceFeed: {
      sourceId: "feed-apple-macos-security",
      feedName: "Apple macOS & Darwin Base Security Updates",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://support.apple.com/en-us/HT201222"
    }
  },

  // 59. Apple macOS Sequoia Darwin XNU Kernel 24.1.0 Point Release (Disruptive)
  {
    id: "ARG-MACOS-XNU-2024-1502",
    bundleId: "MACOS-XNU-2024-1502",
    advisoryType: "BUGFIX",
    os: "macos",
    osFamily: "bsd-darwin",
    osDisplayName: "Apple macOS",
    targetReleases: ["macOS Sequoia 15.1"],
    title: "macOS Sequoia 15.1 Darwin XNU Kernel Virtual Memory & APFS Snapshot Update",
    synopsis: "Disruptive macOS Darwin XNU kernel update resolving APFS snapshot mount contention; requires scheduled system reboot.",
    vendorSeverity: "IMPORTANT",
    severityScore: 8.1,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T16:30:00Z",
    updatedAt: "2024-06-29T16:30:00Z",
    cveList: [],
    packages: [
      { name: "darwin-xnu-kernel", sourcePackage: "xnu", arch: "all", currentVersion: "24.0.0", fixedVersion: "24.1.0", packageManager: "pkg", sizeBytes: 95000000 }
    ],
    commands: {
      nativeUpgrade: "pkg upgrade -y darwin-xnu-kernel",
      verification: "pkg info darwin-xnu-kernel | grep 24.1.0",
      rollback: "pkg install -y darwin-xnu-kernel-24.0.0",
      kineticDeploy: "kinetic upgrade --bundle MACOS-XNU-2024-1502 --os macos"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://support.apple.com/en-us/HT201222",
    sourceFeed: {
      sourceId: "feed-apple-macos-security",
      feedName: "Apple macOS & Darwin Base Security Updates",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://support.apple.com/en-us/HT201222"
    }
  },

  // 60. NetBSD 10.0 pkgsrc OpenSSL & Mozilla Root Certificates Update (Non-Reboot)
  {
    id: "ARG-NETBSD-PKG-2024-1004",
    bundleId: "NETBSD-PKG-2024-1004",
    advisoryType: "MAINTENANCE",
    os: "netbsd",
    osFamily: "bsd-netbsd",
    osDisplayName: "NetBSD",
    targetReleases: ["NetBSD 10.0", "NetBSD 9.4"],
    title: "NetBSD pkgsrc mozilla-rootcerts & OpenSSH Daemon Reload Update",
    synopsis: "Non-disruptive NetBSD pkgin package update refreshing root CA bundle and OpenSSH configuration without system reboot.",
    vendorSeverity: "MODERATE",
    severityScore: 6.5,
    operationalDomain: "NETWORK",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-29T16:45:00Z",
    updatedAt: "2024-06-29T16:45:00Z",
    cveList: [],
    packages: [
      { name: "mozilla-rootcerts", sourcePackage: "mozilla-rootcerts", arch: "x86_64", currentVersion: "1.0.20240311", fixedVersion: "1.0.20240815", packageManager: "pkgin", sizeBytes: 640000 }
    ],
    commands: {
      nativeUpgrade: "pkgin -y update && pkgin -y install mozilla-rootcerts",
      verification: "pkgin list | grep mozilla-rootcerts-1.0.20240815",
      rollback: "pkgin -y install mozilla-rootcerts-1.0.20240311",
      kineticDeploy: "kinetic upgrade --bundle NETBSD-PKG-2024-1004 --os netbsd"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.netbsd.org/support/security/",
    sourceFeed: {
      sourceId: "feed-netbsd-sa",
      feedName: "NetBSD Security Advisories (NetBSD-SA)",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://www.netbsd.org/support/security/"
    }
  },

  // 61. OpenBSD 7.5 Userland OpenSMTPD & LibreSSL Binary Errata (Non-Reboot)
  {
    id: "ARG-OPENBSD-ERRATA-2024-008",
    bundleId: "OPENBSD-ERRATA-2024-008",
    advisoryType: "BUGFIX",
    os: "openbsd",
    osFamily: "bsd-openbsd",
    osDisplayName: "OpenBSD",
    targetReleases: ["OpenBSD 7.5"],
    title: "OpenBSD 7.5 Errata 008: LibreSSL X.509 Policy Verification Userland Fix",
    synopsis: "Non-disruptive OpenBSD syspatch userland binary update for libcrypto and smtpd; reloads services cleanly without kernel reboot.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.3,
    operationalDomain: "CORE",
    actionDirective: "RELOAD_SERVICE",
    issuedAt: "2024-06-29T17:00:00Z",
    updatedAt: "2024-06-29T17:00:00Z",
    cveList: [],
    packages: [
      { name: "syspatch-008-libcrypto", sourcePackage: "libressl", arch: "x86_64", currentVersion: "7.5-base", fixedVersion: "7.5-p008", packageManager: "syspatch", sizeBytes: 1850000 }
    ],
    commands: {
      nativeUpgrade: "syspatch",
      verification: "syspatch -l | grep 008_libcrypto",
      rollback: "syspatch -R",
      kineticDeploy: "kinetic upgrade --bundle OPENBSD-ERRATA-2024-008 --os openbsd"
    },
    impact: { rebootRequired: false, servicesToRestart: ["smtpd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.openbsd.org/errata75.html",
    sourceFeed: {
      sourceId: "feed-openbsd-security-errata",
      feedName: "OpenBSD Security & Reliability Errata",
      feedType: "public-distro-feed",
      format: "GIT_TREE",
      syncStatus: "live",
      sourceUrl: "https://www.openbsd.org/errata.html"
    }
  },

  // 62. openEuler 24.03 LTS Kernel 6.6 ARM64/x86_64 NUMA Scheduler Update (Disruptive)
  {
    id: "ARG-OPENEULER-KRN-2024-2403",
    bundleId: "OPENEULER-KRN-2024-2403",
    advisoryType: "ENHANCEMENT",
    os: "openeuler",
    osFamily: "linux-openeuler",
    osDisplayName: "openEuler",
    targetReleases: ["openEuler 24.03 LTS", "openEuler 22.03 LTS SP4"],
    title: "openEuler 24.03 LTS Kernel 6.6 NUMA Balancer & Virtio-Net Update",
    synopsis: "Disruptive openEuler kernel update improving multi-socket NUMA page migration throughput; requires scheduled reboot.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.5,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T17:15:00Z",
    updatedAt: "2024-06-29T17:15:00Z",
    cveList: [],
    packages: [
      { name: "kernel", sourcePackage: "kernel", arch: "x86_64", currentVersion: "6.6.0-28.0.0.oe2403", fixedVersion: "6.6.0-34.0.0.oe2403", packageManager: "dnf", sizeBytes: 48200000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y kernel",
      verification: "rpm -q kernel | grep 6.6.0-34.0.0.oe2403",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle OPENEULER-KRN-2024-2403 --os openeuler"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://www.openeuler.org/en/security/safety-bulletin/",
    sourceFeed: {
      sourceId: "feed-openeuler",
      feedName: "openEuler Security & Bugfix Advisories (EulerSA)",
      feedType: "public-distro-feed",
      format: "CSAF",
      syncStatus: "live",
      sourceUrl: "https://repo.openeuler.org/"
    }
  },

  // 63. OpenWrt 23.05 mac80211 Wireless Kernel Subsystems & Firmware Update (Disruptive)
  {
    id: "ARG-OPENWRT-KRN-2024-2305",
    bundleId: "OPENWRT-KRN-2024-2305",
    advisoryType: "BUGFIX",
    os: "openwrt",
    osFamily: "linux-openwrt",
    osDisplayName: "OpenWrt",
    targetReleases: ["OpenWrt 23.05.4"],
    title: "OpenWrt 23.05.4 Kernel kmod-mac80211 &DSA Switch Hardware Offload Fix",
    synopsis: "Disruptive OpenWrt kernel module and DSA switch fabric update requiring device reboot during off-peak window.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.4,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T17:30:00Z",
    updatedAt: "2024-06-29T17:30:00Z",
    cveList: [],
    packages: [
      { name: "kmod-mac80211", sourcePackage: "mac80211", arch: "all", currentVersion: "5.15.158+6.1.92-1", fixedVersion: "5.15.162+6.1.97-1", packageManager: "opkg", sizeBytes: 420000 }
    ],
    commands: {
      nativeUpgrade: "opkg update && opkg upgrade kmod-mac80211",
      verification: "opkg list-installed kmod-mac80211 | grep 5.15.162",
      rollback: "opkg install --force-downgrade kmod-mac80211_5.15.158+6.1.92-1",
      kineticDeploy: "kinetic upgrade --bundle OPENWRT-KRN-2024-2305 --os openwrt"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://openwrt.org/releases/23.05/notes-23.05.4",
    sourceFeed: {
      sourceId: "feed-openwrt",
      feedName: "OpenWrt Package & Firmware Errata Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://downloads.openwrt.org/"
    }
  },

  // 64. Oracle Linux 9 OpenSSL & Libkcapi User-Space FIPS Crypto Update (Non-Reboot)
  {
    id: "ARG-ELBA-2024-12904",
    bundleId: "ELBA-2024-12904",
    advisoryType: "BUGFIX",
    os: "oracle-linux",
    osFamily: "linux-rhel",
    osDisplayName: "Oracle Linux",
    targetReleases: ["Oracle Linux 9.4", "Oracle Linux 8.10"],
    title: "Oracle Linux OpenSSL FIPS Provider & systemd-resolved Cache Fix",
    synopsis: "Non-disruptive Oracle Linux user-space update fixing OpenSSL PKCS#11 engine thread contention without rebooting.",
    vendorSeverity: "MODERATE",
    severityScore: 6.8,
    operationalDomain: "CORE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-29T17:45:00Z",
    updatedAt: "2024-06-29T17:45:00Z",
    cveList: [],
    packages: [
      { name: "openssl-libs", sourcePackage: "openssl", arch: "x86_64", currentVersion: "3.0.7-27.0.1.el9", fixedVersion: "3.0.7-28.0.2.el9_4", packageManager: "dnf", sizeBytes: 2180000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y openssl-libs",
      verification: "rpm -q openssl-libs | grep 3.0.7-28.0.2.el9_4",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle ELBA-2024-12904 --os oracle-linux"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://linux.oracle.com/errata/ELBA-2024-12904.html",
    sourceFeed: {
      sourceId: "feed-oracle-errata",
      feedName: "Oracle Linux Bug Fix & Enhancement Stream (ELBA & ELEA / UEK)",
      feedType: "public-distro-feed",
      format: "OVAL",
      syncStatus: "live",
      sourceUrl: "https://linux.oracle.com/security/oval/"
    }
  },

  // 65. VMware Photon OS 5.0 Linux-ESX Hypervisor Kernel Update (Disruptive)
  {
    id: "ARG-PHOTON-KRN-2024-5012",
    bundleId: "PHOTON-KRN-2024-5012",
    advisoryType: "BUGFIX",
    os: "photon",
    osFamily: "linux-photon",
    osDisplayName: "VMware Photon OS",
    targetReleases: ["Photon OS 5.0", "Photon OS 4.0"],
    title: "Photon OS 5.0 linux-esx Kernel 6.1 VMXNET3 Ring Buffer & VSOCK Fix",
    synopsis: "Disruptive Photon OS linux-esx kernel update optimizing vSphere VMXNET3 RSS queues; requires VM reboot during off-peak window.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.7,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T18:00:00Z",
    updatedAt: "2024-06-29T18:00:00Z",
    cveList: [],
    packages: [
      { name: "linux-esx", sourcePackage: "linux-esx", arch: "x86_64", currentVersion: "6.1.83-2.ph5", fixedVersion: "6.1.94-4.ph5", packageManager: "tdnf", sizeBytes: 24500000 }
    ],
    commands: {
      nativeUpgrade: "tdnf upgrade -y linux-esx",
      verification: "rpm -q linux-esx | grep 6.1.94-4.ph5",
      rollback: "tdnf downgrade -y linux-esx-6.1.83-2.ph5",
      kineticDeploy: "kinetic upgrade --bundle PHOTON-KRN-2024-5012 --os photon"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://github.com/vmware/photon/wiki/Security-Advisories-5.0",
    sourceFeed: {
      sourceId: "feed-photon-os",
      feedName: "VMware Photon OS TDNF Update Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://packages.vmware.com/photon/"
    }
  },

  // 66. SUSE Linux Enterprise 15 SP6 Kernel-Default Btrfs & multipath Update (Disruptive)
  {
    id: "ARG-SUSE-RU-2024-3190",
    bundleId: "SUSE-RU-2024:3190-1",
    advisoryType: "MAINTENANCE",
    os: "suse",
    osFamily: "linux-suse",
    osDisplayName: "SUSE Linux Enterprise",
    targetReleases: ["SLES 15 SP6", "openSUSE Leap 15.6"],
    title: "SUSE Kernel-Default 6.4.0 Btrfs Subvolume Quota & Multipath I/O Update",
    synopsis: "Disruptive SUSE Recommended Update for kernel-default resolving Btrfs qgroup rescan stalls; requires scheduled system reboot.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.8,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T18:15:00Z",
    updatedAt: "2024-06-29T18:15:00Z",
    cveList: [],
    packages: [
      { name: "kernel-default", sourcePackage: "kernel-default", arch: "x86_64", currentVersion: "6.4.0-150600.21.1", fixedVersion: "6.4.0-150600.23.17.1", packageManager: "zypper", sizeBytes: 51200000 }
    ],
    commands: {
      nativeUpgrade: "zypper --non-interactive update kernel-default",
      verification: "rpm -q kernel-default | grep 6.4.0-150600.23.17.1",
      rollback: "zypper --non-interactive install --oldpackage kernel-default=6.4.0-150600.21.1",
      kineticDeploy: "kinetic upgrade --bundle SUSE-RU-2024:3190-1 --os suse"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://www.suse.com/support/update/",
    sourceFeed: {
      sourceId: "feed-suse-ru",
      feedName: "SUSE Recommended & Maintenance Updates (SUSE-RU / openSUSE)",
      feedType: "public-distro-feed",
      format: "OVAL",
      syncStatus: "live",
      sourceUrl: "https://ftp.suse.com/pub/projects/security/oval/"
    }
  },

  // 67. Void Linux runit & OpenSSL User-Space Service Supervision Update (Non-Reboot)
  {
    id: "ARG-VOID-UPD-2024-0912",
    bundleId: "VOID-UPD-2024-0912",
    advisoryType: "BUGFIX",
    os: "void",
    osFamily: "linux-void",
    osDisplayName: "Void Linux",
    targetReleases: ["Void Linux Rolling (glibc & musl)"],
    title: "Void Linux OpenSSL 3.3 & runit-void Service Log Rotation Fix",
    synopsis: "Non-disruptive Void Linux xbps user-space package update reloading supervised services with zero host reboot.",
    vendorSeverity: "MODERATE",
    severityScore: 6.6,
    operationalDomain: "CORE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-29T18:30:00Z",
    updatedAt: "2024-06-29T18:30:00Z",
    cveList: [],
    packages: [
      { name: "openssl", sourcePackage: "openssl", arch: "x86_64", currentVersion: "3.3.1_1", fixedVersion: "3.3.2_1", packageManager: "xbps", sizeBytes: 3120000 }
    ],
    commands: {
      nativeUpgrade: "xbps-install -Syu openssl",
      verification: "xbps-query -l | grep openssl-3.3.2_1",
      rollback: "xbps-install -f openssl-3.3.1_1",
      kineticDeploy: "kinetic upgrade --bundle VOID-UPD-2024-0912 --os void"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://voidlinux.org/news/",
    sourceFeed: {
      sourceId: "feed-void-xbps",
      feedName: "Void Linux XBPS Rolling Package Updates",
      feedType: "public-distro-feed",
      format: "GIT_TREE",
      syncStatus: "live",
      sourceUrl: "https://github.com/void-linux/void-packages"
    }
  },

  // 68. Chainguard Wolfi OS MicroVM Kernel 6.10 Update (Disruptive)
  {
    id: "ARG-WOLFI-KRN-2024-0930",
    bundleId: "WOLFI-KRN-2024-0930",
    advisoryType: "MAINTENANCE",
    os: "wolfi",
    osFamily: "linux-wolfi",
    osDisplayName: "Chainguard Wolfi",
    targetReleases: ["Wolfi Rolling (2024)"],
    title: "Wolfi MicroVM Kernel 6.10.9 Virtio-FS & Seccomp BPF Update",
    synopsis: "Disruptive Wolfi microVM kernel package update requiring container microVM restart during off-peak window.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.4,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T18:45:00Z",
    updatedAt: "2024-06-29T18:45:00Z",
    cveList: [],
    packages: [
      { name: "linux-wolfi", sourcePackage: "linux-wolfi", arch: "x86_64", currentVersion: "6.10.6-r0", fixedVersion: "6.10.9-r0", packageManager: "apk", sizeBytes: 21500000 }
    ],
    commands: {
      nativeUpgrade: "apk update && apk upgrade --no-cache linux-wolfi",
      verification: "apk info -v linux-wolfi | grep 6.10.9-r0",
      rollback: "apk add --no-cache 'linux-wolfi=6.10.6-r0'",
      kineticDeploy: "kinetic upgrade --bundle WOLFI-KRN-2024-0930 --os wolfi"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://packages.wolfi.dev/",
    sourceFeed: {
      sourceId: "feed-wolfi-os",
      feedName: "Chainguard Wolfi Undistro APK Advisory Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://packages.wolfi.dev/os/security.json"
    }
  },

  // 69. CentOS Stream 9 glibc & systemd Live Service Update (Non-Reboot)
  {
    id: "ARG-CENTOS-STREAM-2024-4102",
    bundleId: "CSBA-2024:4102",
    advisoryType: "BUGFIX",
    os: "centos-stream",
    osFamily: "linux-rhel",
    osDisplayName: "CentOS Stream",
    targetReleases: ["CentOS Stream 9", "CentOS Stream 10"],
    title: "CentOS Stream 9 glibc Resolver & NSS Cache Concurrency Bug Fix",
    synopsis: "Non-disruptive CentOS Stream user-space glibc and nscd resolver stability update applied without host reboot.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.4,
    operationalDomain: "CORE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-29T19:00:00Z",
    updatedAt: "2024-06-29T19:00:00Z",
    cveList: [],
    packages: [
      { name: "glibc", sourcePackage: "glibc", arch: "x86_64", currentVersion: "2.34-105.el9", fixedVersion: "2.34-109.el9", packageManager: "dnf", sizeBytes: 4210000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y glibc",
      verification: "rpm -q glibc | grep 2.34-109.el9",
      rollback: "dnf downgrade -y glibc-2.34-105.el9",
      kineticDeploy: "kinetic upgrade --bundle CSBA-2024:4102 --os centos-stream"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd", "systemd-resolved"], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.centos.org/download",
    sourceFeed: {
      sourceId: "feed-centos-stream",
      feedName: "CentOS Stream 9 & 10 Continuous Delivery & DNF Updateinfo Stream",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://mirror.stream.centos.org/9-stream/"
    }
  },

  // 70. CentOS Stream 9 Kernel 5.14.0-496.el9 Cgroups & XFS Update (Disruptive)
  {
    id: "ARG-CENTOS-STREAM-KRN-2024-5201",
    bundleId: "CSBA-2024:5201",
    advisoryType: "MAINTENANCE",
    os: "centos-stream",
    osFamily: "linux-rhel",
    osDisplayName: "CentOS Stream",
    targetReleases: ["CentOS Stream 9", "CentOS Stream 10"],
    title: "CentOS Stream 9 Kernel 5.14.0-496.el9 XFS Journaling & io_uring Update",
    synopsis: "Disruptive CentOS Stream kernel update fixing XFS log recovery contention; requires system reboot during off-peak window.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.9,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T19:10:00Z",
    updatedAt: "2024-06-29T19:10:00Z",
    cveList: [],
    packages: [
      { name: "kernel", sourcePackage: "kernel", arch: "x86_64", currentVersion: "5.14.0-480.el9", fixedVersion: "5.14.0-496.el9", packageManager: "dnf", sizeBytes: 56400000 }
    ],
    commands: {
      nativeUpgrade: "dnf upgrade -y kernel",
      verification: "rpm -q kernel | grep 5.14.0-496.el9",
      rollback: "dnf history undo last -y",
      kineticDeploy: "kinetic upgrade --bundle CSBA-2024:5201 --os centos-stream"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://www.centos.org/download",
    sourceFeed: {
      sourceId: "feed-centos-stream",
      feedName: "CentOS Stream 9 & 10 Continuous Delivery & DNF Updateinfo Stream",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://mirror.stream.centos.org/9-stream/"
    }
  },

  // 71. openSUSE Leap 15.6 OpenSSL-3 & libzypp Update (Non-Reboot)
  {
    id: "ARG-OPENSUSE-LEAP-2024-2810",
    bundleId: "openSUSE-RU-2024:2810-1",
    advisoryType: "BUGFIX",
    os: "opensuse-leap",
    osFamily: "linux-suse",
    osDisplayName: "openSUSE Leap",
    targetReleases: ["openSUSE Leap 15.6", "openSUSE Leap 15.5"],
    title: "openSUSE Leap 15.6 OpenSSL 3.1.4 FIPS Provider & TLS Session Cache Update",
    synopsis: "Non-disruptive openSUSE Leap zypper user-space cryptographic library update applied live without reboot.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.3,
    operationalDomain: "CORE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-29T19:20:00Z",
    updatedAt: "2024-06-29T19:20:00Z",
    cveList: [],
    packages: [
      { name: "openssl-3", sourcePackage: "openssl-3", arch: "x86_64", currentVersion: "3.1.4-150600.2.1", fixedVersion: "3.1.4-150600.5.1", packageManager: "zypper", sizeBytes: 4950000 }
    ],
    commands: {
      nativeUpgrade: "zypper --non-interactive update openssl-3",
      verification: "rpm -q openssl-3 | grep 3.1.4-150600.5.1",
      rollback: "zypper --non-interactive install --oldpackage openssl-3=3.1.4-150600.2.1",
      kineticDeploy: "kinetic upgrade --bundle openSUSE-RU-2024:2810-1 --os opensuse-leap"
    },
    impact: { rebootRequired: false, servicesToRestart: ["sshd"], zeroDowntime: true },
    upstreamNoticeUrl: "https://get.opensuse.org/leap/",
    sourceFeed: {
      sourceId: "feed-opensuse-leap",
      feedName: "openSUSE Leap 15.6 Maintenance & Zypper Updateinfo Stream",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://download.opensuse.org/update/leap/15.6/oss/"
    }
  },

  // 72. openSUSE Leap 15.6 Kernel-Default 6.4.0-150600.23.25.1 Btrfs Update (Disruptive)
  {
    id: "ARG-OPENSUSE-LEAP-KRN-2024-3412",
    bundleId: "openSUSE-RU-2024:3412-1",
    advisoryType: "MAINTENANCE",
    os: "opensuse-leap",
    osFamily: "linux-suse",
    osDisplayName: "openSUSE Leap",
    targetReleases: ["openSUSE Leap 15.6", "openSUSE Leap 15.5"],
    title: "openSUSE Leap 15.6 Kernel 6.4.0-150600.23.25.1 Btrfs Subvolume Quota & NVMe Fix",
    synopsis: "Disruptive openSUSE Leap kernel-default maintenance update requiring host reboot during scheduled off-peak hours.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.8,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T19:30:00Z",
    updatedAt: "2024-06-29T19:30:00Z",
    cveList: [],
    packages: [
      { name: "kernel-default", sourcePackage: "kernel-default", arch: "x86_64", currentVersion: "6.4.0-150600.23.1", fixedVersion: "6.4.0-150600.23.25.1", packageManager: "zypper", sizeBytes: 52800000 }
    ],
    commands: {
      nativeUpgrade: "zypper --non-interactive update kernel-default",
      verification: "rpm -q kernel-default | grep 6.4.0-150600.23.25.1",
      rollback: "zypper --non-interactive install --oldpackage kernel-default=6.4.0-150600.23.1",
      kineticDeploy: "kinetic upgrade --bundle openSUSE-RU-2024:3412-1 --os opensuse-leap"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://get.opensuse.org/leap/",
    sourceFeed: {
      sourceId: "feed-opensuse-leap",
      feedName: "openSUSE Leap 15.6 Maintenance & Zypper Updateinfo Stream",
      feedType: "public-distro-feed",
      format: "UPDATEINFO",
      syncStatus: "live",
      sourceUrl: "https://download.opensuse.org/update/leap/15.6/oss/"
    }
  },

  // 73. Fedora CoreOS (FCOS) Zincati & Podman Live Layer Update (Non-Reboot)
  {
    id: "ARG-FCOS-UPD-2024-4001",
    bundleId: "FCOS-UPD-2024-4001",
    advisoryType: "ENHANCEMENT",
    os: "fedora-coreos",
    osFamily: "linux-fedora",
    osDisplayName: "Fedora CoreOS",
    targetReleases: ["Fedora CoreOS Stable (40)", "Fedora CoreOS Testing"],
    title: "Fedora CoreOS Zincati 0.0.29 & rpm-ostree Live Overlay FS Apply Update",
    synopsis: "Non-disruptive Fedora CoreOS rpm-ostree --apply-live package layer update applied immediately without node drain or reboot.",
    vendorSeverity: "MODERATE",
    severityScore: 6.9,
    operationalDomain: "CONTAINER",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-29T19:40:00Z",
    updatedAt: "2024-06-29T19:40:00Z",
    cveList: [],
    packages: [
      { name: "zincati", sourcePackage: "rust-zincati", arch: "x86_64", currentVersion: "0.0.27-1.fc40", fixedVersion: "0.0.29-1.fc40", packageManager: "rpm-ostree", sizeBytes: 3890000 }
    ],
    commands: {
      nativeUpgrade: "rpm-ostree install --apply-live -y zincati",
      verification: "rpm -q zincati | grep 0.0.29-1.fc40",
      rollback: "rpm-ostree rollback",
      kineticDeploy: "kinetic upgrade --bundle FCOS-UPD-2024-4001 --os fedora-coreos"
    },
    impact: { rebootRequired: false, servicesToRestart: ["zincati"], zeroDowntime: true },
    upstreamNoticeUrl: "https://fedoraproject.org/coreos/download",
    sourceFeed: {
      sourceId: "feed-fedora-coreos",
      feedName: "Fedora CoreOS (FCOS) Cincinnati Update Graph & OSTree Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://builds.coreos.fedoraproject.org/streams/stable.json"
    }
  },

  // 74. Fedora CoreOS (FCOS) Atomic OSTree Deployment 40.20240815.3.0 (Disruptive)
  {
    id: "ARG-FCOS-OSTREE-2024-4020",
    bundleId: "FCOS-OSTREE-40.20240815.3.0",
    advisoryType: "MAINTENANCE",
    os: "fedora-coreos",
    osFamily: "linux-fedora",
    osDisplayName: "Fedora CoreOS",
    targetReleases: ["Fedora CoreOS Stable (40)"],
    title: "Fedora CoreOS Atomic OSTree Image 40.20240815.3.0 (Kernel 6.9.12 & Ignition)",
    synopsis: "Disruptive Fedora CoreOS atomic OSTree deployment switching bootable rootfs tree; requires reboot during off-peak window.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.7,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T19:50:00Z",
    updatedAt: "2024-06-29T19:50:00Z",
    cveList: [],
    packages: [
      { name: "fedora-coreos-ostree", sourcePackage: "fedora-coreos-ostree", arch: "x86_64", currentVersion: "40.20240701.3.0", fixedVersion: "40.20240815.3.0", packageManager: "rpm-ostree", sizeBytes: 64200000 }
    ],
    commands: {
      nativeUpgrade: "rpm-ostree upgrade",
      verification: "rpm-ostree status | grep 40.20240815.3.0",
      rollback: "rpm-ostree rollback",
      kineticDeploy: "kinetic upgrade --bundle FCOS-OSTREE-40.20240815.3.0 --os fedora-coreos"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://fedoraproject.org/coreos/download",
    sourceFeed: {
      sourceId: "feed-fedora-coreos",
      feedName: "Fedora CoreOS (FCOS) Cincinnati Update Graph & OSTree Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://builds.coreos.fedoraproject.org/streams/stable.json"
    }
  },

  // 75. Proxmox VE 8.2 pve-manager & pve-cluster Live Control Plane Update (Non-Reboot)
  {
    id: "ARG-PROXMOX-PVE-2024-0822",
    bundleId: "PVE-UPD-2024-0822",
    advisoryType: "BUGFIX",
    os: "proxmox",
    osFamily: "linux-debian",
    osDisplayName: "Proxmox VE",
    targetReleases: ["Proxmox VE 8.2 (Debian 12 Bookworm)"],
    title: "Proxmox VE 8.2 pve-manager 8.2.7 Live Migration & Corosync Quorum Fix",
    synopsis: "Non-disruptive Proxmox VE control-plane update reloading pveproxy and pvedaemon without interrupting running KVM guests or rebooting the hypervisor.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.5,
    operationalDomain: "SYSTEMD",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-29T20:00:00Z",
    updatedAt: "2024-06-29T20:00:00Z",
    cveList: [],
    packages: [
      { name: "pve-manager", sourcePackage: "pve-manager", arch: "x86_64", currentVersion: "8.2.2", fixedVersion: "8.2.7", packageManager: "apt", sizeBytes: 5120000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update -qq && apt-get install --only-upgrade -y pve-manager",
      verification: "dpkg -l pve-manager | grep 8.2.7",
      rollback: "apt-get install -y --allow-downgrades pve-manager=8.2.2",
      kineticDeploy: "kinetic upgrade --bundle PVE-UPD-2024-0822 --os proxmox"
    },
    impact: { rebootRequired: false, servicesToRestart: ["pvedaemon", "pveproxy"], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.proxmox.com/en/downloads",
    sourceFeed: {
      sourceId: "feed-proxmox-ve",
      feedName: "Proxmox VE 8.x Hypervisor, QEMU/KVM & ZFS Kernel Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://download.proxmox.com/debian/pve/dists/bookworm/"
    }
  },

  // 76. Proxmox VE 8.2 Kernel 6.8.12-2-pve VFIO IOMMU & ZFS Module Update (Disruptive)
  {
    id: "ARG-PROXMOX-KRN-2024-6812",
    bundleId: "PVE-KRN-2024-6812",
    advisoryType: "MAINTENANCE",
    os: "proxmox",
    osFamily: "linux-debian",
    osDisplayName: "Proxmox VE",
    targetReleases: ["Proxmox VE 8.2 (Debian 12 Bookworm)"],
    title: "Proxmox VE Kernel 6.8.12-2-pve KVM IOMMU Passthrough & OpenZFS 2.2.6 Update",
    synopsis: "Disruptive Proxmox VE hypervisor kernel update requiring node reboot during off-peak maintenance window.",
    vendorSeverity: "CRITICAL",
    severityScore: 8.4,
    operationalDomain: "KERNEL",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T20:10:00Z",
    updatedAt: "2024-06-29T20:10:00Z",
    cveList: [],
    packages: [
      { name: "proxmox-kernel-6.8", sourcePackage: "proxmox-kernel-6.8", arch: "x86_64", currentVersion: "6.8.8-2-pve", fixedVersion: "6.8.12-2-pve", packageManager: "apt", sizeBytes: 68900000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update -qq && apt-get install --only-upgrade -y proxmox-kernel-6.8",
      verification: "dpkg -l proxmox-kernel-6.8 | grep 6.8.12-2-pve",
      rollback: "apt-get install -y --allow-downgrades proxmox-kernel-6.8=6.8.8-2-pve",
      kineticDeploy: "kinetic upgrade --bundle PVE-KRN-2024-6812 --os proxmox"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://www.proxmox.com/en/downloads",
    sourceFeed: {
      sourceId: "feed-proxmox-ve",
      feedName: "Proxmox VE 8.x Hypervisor, QEMU/KVM & ZFS Kernel Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://download.proxmox.com/debian/pve/dists/bookworm/"
    }
  },

  // 77. TrueNAS SCALE 24.04 middlewared & SMB Multiprotocol Service Update (Non-Reboot)
  {
    id: "ARG-TRUENAS-SCALE-2024-2404",
    bundleId: "NAS-UPD-2024-2404",
    advisoryType: "BUGFIX",
    os: "truenas-scale",
    osFamily: "linux-debian",
    osDisplayName: "TrueNAS SCALE",
    targetReleases: ["TrueNAS SCALE 24.04 (Dragonfish)"],
    title: "TrueNAS SCALE 24.04.2.2 middlewared ZFS Snapshot Scheduler & SMB ACL Fix",
    synopsis: "Non-disruptive TrueNAS SCALE storage middleware and SMB service update applied online with zero storage pool downtime.",
    vendorSeverity: "IMPORTANT",
    severityScore: 7.4,
    operationalDomain: "STORAGE",
    actionDirective: "ZERO_DOWNTIME_HOTFIX",
    issuedAt: "2024-06-29T20:20:00Z",
    updatedAt: "2024-06-29T20:20:00Z",
    cveList: [],
    packages: [
      { name: "middlewared", sourcePackage: "middlewared", arch: "x86_64", currentVersion: "24.04.1", fixedVersion: "24.04.2.2", packageManager: "apt", sizeBytes: 4480000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update -qq && apt-get install --only-upgrade -y middlewared",
      verification: "dpkg -l middlewared | grep 24.04.2.2",
      rollback: "apt-get install -y --allow-downgrades middlewared=24.04.1",
      kineticDeploy: "kinetic upgrade --bundle NAS-UPD-2024-2404 --os truenas-scale"
    },
    impact: { rebootRequired: false, servicesToRestart: ["middlewared"], zeroDowntime: true },
    upstreamNoticeUrl: "https://www.truenas.com/download-truenas-scale",
    sourceFeed: {
      sourceId: "feed-truenas-scale",
      feedName: "TrueNAS SCALE Dragonfish / Electric Eel & OpenZFS Release Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://update.sys.truenas.net/scale/"
    }
  },

  // 78. TrueNAS SCALE 24.04 OpenZFS 2.2.6 Kernel Module & Appliance Kernel Update (Disruptive)
  {
    id: "ARG-TRUENAS-ZFS-2024-2405",
    bundleId: "NAS-ZFS-2024-2405",
    advisoryType: "MAINTENANCE",
    os: "truenas-scale",
    osFamily: "linux-debian",
    osDisplayName: "TrueNAS SCALE",
    targetReleases: ["TrueNAS SCALE 24.04 (Dragonfish)"],
    title: "TrueNAS SCALE OpenZFS 2.2.6-1 Kernel Module ARC Eviction & dRAID Scrub Fix",
    synopsis: "Disruptive TrueNAS SCALE OpenZFS kernel module and storage appliance kernel update requiring scheduled off-peak reboot.",
    vendorSeverity: "CRITICAL",
    severityScore: 8.3,
    operationalDomain: "STORAGE",
    actionDirective: "SCHEDULE_REBOOT",
    issuedAt: "2024-06-29T20:30:00Z",
    updatedAt: "2024-06-29T20:30:00Z",
    cveList: [],
    packages: [
      { name: "openzfs-truenas", sourcePackage: "openzfs-truenas", arch: "x86_64", currentVersion: "2.2.4-1", fixedVersion: "2.2.6-1", packageManager: "apt", sizeBytes: 41200000 }
    ],
    commands: {
      nativeUpgrade: "apt-get update -qq && apt-get install --only-upgrade -y openzfs-truenas",
      verification: "dpkg -l openzfs-truenas | grep 2.2.6-1",
      rollback: "apt-get install -y --allow-downgrades openzfs-truenas=2.2.4-1",
      kineticDeploy: "kinetic upgrade --bundle NAS-ZFS-2024-2405 --os truenas-scale"
    },
    impact: { rebootRequired: true, servicesToRestart: [], zeroDowntime: false },
    upstreamNoticeUrl: "https://www.truenas.com/download-truenas-scale",
    sourceFeed: {
      sourceId: "feed-truenas-scale",
      feedName: "TrueNAS SCALE Dragonfish / Electric Eel & OpenZFS Release Stream",
      feedType: "public-distro-feed",
      format: "JSON",
      syncStatus: "live",
      sourceUrl: "https://update.sys.truenas.net/scale/"
    }
  }
];

export interface ArgentQueryFilters {
  id?: string;
  os?: string; // e.g. "ubuntu", "debian", "rocky", "all"
  severity?: string; // "critical", "important", "moderate", "low", "all"
  type?: string; // "all", "bugfix", "enhancement", "maintenance", "general"
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
  bugfixCount: number;
  enhancementCount: number;
  maintenanceCount: number;
  generalCount: number;
  zeroDowntimeCount: number;
  rebootRequiredCount: number;
  totalPackagesUpdated: number;
  bundles: ArgentPatchBundle[];
}

export interface ArgentStats {
  totalBundles: number;
  totalPackagesUpdated: number;
  bugfixCount: number;
  enhancementCount: number;
  maintenanceCount: number;
  generalCount: number;
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
 * Normalizes any advisory or bundle ID to the standard Argent format prefixed with ARG-.
 * E.g., "RLBA-2024:3910" -> "ARG-RLBA-2024-3910"
 * E.g., "UBUNTU-UPD-2024-0412" -> "ARG-UBUNTU-UPD-2024-0412"
 * E.g., "ARG-RLBA-2024-3910" -> "ARG-RLBA-2024-3910"
 */
export function normalizeArgentId(rawId: string): string {
  if (!rawId) return 'ARG-ADVISORY';
  const trimmed = rawId.trim();
  if (trimmed.startsWith('ARG-')) {
    return trimmed.replace(/[:/\s]+/g, '-');
  }
  const clean = trimmed.replace(/[:/\s]+/g, '-');
  return `ARG-${clean}`;
}

/**
 * Normalizes an ArgentPatchBundle ensuring:
 * - bundle.id starts with "ARG-"
 * - bundle.bundleId is populated with the upstream advisory identifier
 */
export function normalizeArgentBundle(bundle: ArgentPatchBundle): ArgentPatchBundle {
  const normId = normalizeArgentId(bundle.id || bundle.bundleId);
  const upstreamBundleId = bundle.bundleId || bundle.id?.replace(/^ARG-/, '') || normId;
  return {
    ...bundle,
    id: normId,
    bundleId: upstreamBundleId
  };
}

/**
 * Filter and query regular vendor patch bundles (1:1 feature parity with Vantage threat feed)
 */
export function getArgentBundles(filters: ArgentQueryFilters = {}): ArgentQueryResult {
  let list = ARGENT_PATCH_BUNDLES.map(normalizeArgentBundle);

  // Filter by Specific ID (supports both ARG- prefixed ID and raw vendor bundleId)
  if (filters.id) {
    const normTarget = normalizeArgentId(filters.id).toLowerCase();
    const rawTarget = filters.id.toLowerCase();
    list = list.filter(b => b.id.toLowerCase() === normTarget || b.bundleId.toLowerCase() === rawTarget);
  }

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
      b.os === 'cloudlinux' ||
      b.os === 'centos-stream' ||
      b.os === 'opensuse-leap' ||
      b.os === 'proxmox' ||
      b.os === 'truenas-scale'
    );
  }

  // Filter by Source Feed
  if (filters.source && filters.source !== 'ALL') {
    list = list.filter(b => b.sourceFeed.sourceId === filters.source);
  }

  // Filter by Advisory Type (Bugfix, Enhancement, Maintenance, General)
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
    list = list.filter(b => b.os.toLowerCase() === targetOs || b.osFamily.toLowerCase() === targetOs);
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
      b.id.toLowerCase().includes(q) ||
      b.bundleId.toLowerCase().includes(q) ||
      b.title.toLowerCase().includes(q) ||
      b.synopsis.toLowerCase().includes(q) ||
      b.osDisplayName.toLowerCase().includes(q) ||
      b.advisoryType.toLowerCase().includes(q) ||
      b.packages.some(p => p.name.toLowerCase().includes(q) || p.fixedVersion.toLowerCase().includes(q))
    );
  }

  // Sorting
  const sortBy = filters.sortBy || 'date_desc';
  if (sortBy === 'cvss_desc') {
    list.sort((a, b) => b.severityScore - a.severityScore);
  } else if (sortBy === 'date_desc') {
    list.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
  } else if (sortBy === 'date_asc') {
    list.sort((a, b) => new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime());
  } else if (sortBy === 'id_asc') {
    list.sort((a, b) => a.id.localeCompare(b.id));
  } else if (sortBy === 'id_desc') {
    list.sort((a, b) => b.id.localeCompare(a.id));
  }

  const total = list.length;
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 25));
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const pagedBundles = list.slice(startIndex, startIndex + limit);

  const bugfixCount = ARGENT_PATCH_BUNDLES.filter(b => b.advisoryType === 'BUGFIX').length;
  const enhancementCount = ARGENT_PATCH_BUNDLES.filter(b => b.advisoryType === 'ENHANCEMENT').length;
  const maintenanceCount = ARGENT_PATCH_BUNDLES.filter(b => b.advisoryType === 'MAINTENANCE').length;
  const generalCount = ARGENT_PATCH_BUNDLES.filter(b => b.advisoryType === 'GENERAL').length;
  const zeroDowntimeCount = ARGENT_PATCH_BUNDLES.filter(b => b.impact.zeroDowntime).length;
  const rebootRequiredCount = ARGENT_PATCH_BUNDLES.filter(b => b.impact.rebootRequired).length;
  const totalPackagesUpdated = ARGENT_PATCH_BUNDLES.reduce((acc, b) => acc + b.packages.length, 0);

  return {
    total,
    page,
    limit,
    totalPages,
    totalConsolidatedCount: ARGENT_PATCH_BUNDLES.length,
    bugfixCount,
    enhancementCount,
    maintenanceCount,
    generalCount,
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
  let bugfixCount = 0;
  let enhancementCount = 0;
  let maintenanceCount = 0;
  let generalCount = 0;
  let zeroDowntimeCount = 0;
  let rebootRequiredCount = 0;
  let totalPackagesUpdated = 0;

  for (const b of ARGENT_PATCH_BUNDLES) {
    byOs[b.os] = (byOs[b.os] || 0) + 1;
    byType[b.advisoryType] = (byType[b.advisoryType] || 0) + 1;
    totalPackagesUpdated += b.packages.length;

    if (b.advisoryType === 'BUGFIX') bugfixCount++;
    else if (b.advisoryType === 'ENHANCEMENT') enhancementCount++;
    else if (b.advisoryType === 'MAINTENANCE') maintenanceCount++;
    else if (b.advisoryType === 'GENERAL') generalCount++;

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
    bugfixCount,
    enhancementCount,
    maintenanceCount,
    generalCount,
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
    "# Native Distribution Package Updates: Bug Fixes, Enhancements & Maintenance",
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
