#!/bin/bash
# ==============================================================================
# Exultia Linux - Automated Bare-Metal & Virtual Disk Installer
# ==============================================================================
set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

echo -e "${CYAN}${BOLD}"
echo "+=============================================================================+"
echo "|                   EXULTIA LINUX 2026.1 INSTALLER                            |"
echo "|      Sovereign Operating System with Autonomous Threat Remediator           |"
echo "+=============================================================================+"
echo -e "${RESET}"

TARGET_DISK="$1"
if [ -z "$TARGET_DISK" ]; then
    echo -e "${YELLOW}Available Disks:${RESET}"
    lsblk -d -o NAME,SIZE,TYPE,MODEL | grep "disk"
    echo ""
    read -p "Enter target disk device to install Exultia Linux (e.g. /dev/sda, /dev/vda, /dev/nvme0n1): " TARGET_DISK
fi

if [ ! -b "$TARGET_DISK" ]; then
    echo -e "${RED}[ERROR] Invalid block device: $TARGET_DISK${RESET}"
    exit 1
fi

echo -e "\n${YELLOW}${BOLD}[WARNING] All data on ${TARGET_DISK} will be permanently erased!${RESET}"
read -p "Are you sure you want to proceed with the installation? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Installation aborted by user."
    exit 0
fi

echo -e "\n${BOLD}[1/5] Partitioning ${TARGET_DISK} with GPT layout...${RESET}"
parted -s "$TARGET_DISK" -- mklabel gpt
parted -s "$TARGET_DISK" -- mkpart ESP fat32 1MiB 512MiB
parted -s "$TARGET_DISK" -- set 1 esp on
parted -s "$TARGET_DISK" -- mkpart primary ext4 512MiB 100%

# Resolve partition paths (handles /dev/nvme0n1p1 vs /dev/sda1)
if [[ "$TARGET_DISK" =~ nvme|mmcblk ]]; then
    BOOT_PART="${TARGET_DISK}p1"
    ROOT_PART="${TARGET_DISK}p2"
else
    BOOT_PART="${TARGET_DISK}1"
    ROOT_PART="${TARGET_DISK}2"
fi

echo -e "${BOLD}[2/5] Formatting filesystems...${RESET}"
mkfs.fat -F 32 -n EXULTIA_BOOT "$BOOT_PART"
mkfs.ext4 -L EXULTIA_ROOT -F "$ROOT_PART"

echo -e "${BOLD}[3/5] Mounting target root filesystems at /mnt...${RESET}"
mount "$ROOT_PART" /mnt
mkdir -p /mnt/boot
mount "$BOOT_PART" /mnt/boot

echo -e "${BOLD}[4/5] Generating hardware configuration and staging flake...${RESET}"
nixos-generate-config --root /mnt

# Copy Exultia OS configuration and modules into /mnt/etc/nixos
mkdir -p /mnt/etc/nixos/modules /mnt/etc/nixos/pkgs /mnt/etc/nixos/profiles
if [ -d "/etc/exultia-os" ]; then
    cp -r /etc/exultia-os/* /mnt/etc/nixos/
fi

echo -e "${BOLD}[5/5] Executing nixos-install...${RESET}"
nixos-install --no-root-password

echo -e "\n${GREEN}${BOLD}+=============================================================================+${RESET}"
echo -e "${GREEN}${BOLD}|             EXULTIA LINUX INSTALLATION COMPLETED SUCCESSFULLY!             |${RESET}"
echo -e "${GREEN}${BOLD}+=============================================================================+${RESET}"
echo -e "You can now reboot your system into Exultia Linux."
echo -e "Run: ${CYAN}reboot${RESET}\n"
