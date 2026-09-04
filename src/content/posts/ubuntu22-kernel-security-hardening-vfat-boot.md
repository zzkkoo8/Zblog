---
title: Ubuntu 22.04 内核漏洞修复：在 VFAT /boot 的定制系统上完成安全升级
author: zzkkoo8
pubDatetime: 2026-09-03T21:40:00+08:00
slug: ubuntu22-kernel-security-hardening-vfat-boot
featured: true
draft: false
tags:
  - Ubuntu
  - Linux
  - Kernel
  - 安全加固
  - 故障排查
description: 记录一次定制 Ubuntu 22.04 硬件设备的内核漏洞修复：/boot 被挂载为 VFAT，标准 linux-image 安装失败；最终通过临时暴露 ext4 /boot、显式安装修复内核、回写 VFAT 并完成真实重启验收。
---

这次处理的是一台产品定制的 Ubuntu 22.04 硬件设备。目标很明确：修复 `CVE-2026-43284` 和 `CVE-2026-46300`，只升级 Jammy GA 5.15 内核，不做整机 `apt upgrade`。

真正困难的地方不是 CVE，而是这台设备的启动布局。

修复前：

```text
Ubuntu 22.04 LTS / amd64
运行内核：5.15.0-72-generic
/dev/sda2 ext4 -> /
/dev/sda1 VFAT/FAT16 -> /boot
UEFI + GRUB 2.06
```

产品把 EFI、GRUB、kernel 和 initrd 全部放进了同一个 VFAT `/boot`：

```text
/dev/sda1 VFAT
└── /boot
    ├── EFI/BOOT/BOOTX64.EFI
    ├── grub/grub.cfg
    ├── vmlinuz-*
    └── initrd.img-*
```

而 Ubuntu 原生 `linux-image` 安装流程会在 `/boot` 下执行 hard link、symbolic link、initramfs 和 GRUB 相关操作。VFAT 不支持 Linux 的硬链接和软链接语义，所以标准安装直接撞墙。

## 最初的失败：不是 kernel 包坏了

现场出现过两类关键错误：

```text
ln: failed to create hard link ... Operation not permitted
```

以及：

```text
Failed to create symlink to vmlinuz-...: Operation not permitted
```

随后会看到典型的半安装状态：

```text
linux-image-<new>      iF
linux-image-generic    iU
linux-generic          iU
```

新 `vmlinuz` 可能已经出现在 `/boot`，但新 `initrd.img` 没有生成，GRUB 甚至可能出现一个只有 kernel、没有 initrd 的不完整启动项。

这时不能因为：

```text
linux-generic is already the newest version
```

或者 `/boot/vmlinuz-<new>` 已经存在，就认为升级成功。

真正应该看的至少是：

```bash
uname -r
sudo dpkg --audit
ls -lh /boot/vmlinuz-* /boot/initrd.img-*
grep -nE 'menuentry|linux[[:space:]]|initrd[[:space:]]' /boot/grub/grub.cfg
```

根因最后被现场文件系统测试直接证实：VFAT 上普通文件可写，但 hard link 和 symlink 都返回 `Operation not permitted`。

所以这不是某个 5.15 内核包损坏，而是**产品的 `/boot=VFAT` 设计与 Ubuntu 原生 kernel package 安装机制存在结构性冲突**。

## 临时模块屏蔽能缓解，但不是最终答案

在正式升级方案还没验证完成前，先做过一次补偿性缓解。

现场确认设备没有使用 IPsec/XFRM、AFS/RxRPC，且 `esp4`、`esp6`、`rxrpc` 都是可卸载模块，因此临时写入 modprobe 配置，阻止三个模块加载。

实际验证结果：

- `modprobe esp4/esp6/rxrpc` 均被 `/bin/false` 拒绝；
- 三个模块均未加载；
- 管理网络、Docker、业务容器、SSH、Web 服务没有新增异常。

这只能作为过渡措施。最终目标仍然是启动到包含 Ubuntu backport 修复的 GA 内核。

## 最终可行方案：安装时临时让 `/boot` 回到 ext4

现场最终验证成功的方案，不是修改 `/etc/fstab` 永久重分区，也不是强行改 `linux-update-symlinks`。

思路是：

```text
正常运行时：
/dev/sda1 VFAT -> /boot

维护窗口安装内核时：
/dev/sda1 VFAT -> 临时目录
/dev/sda2 ext4 -> /boot（根分区里的真实目录）

在 ext4 /boot 中完成：
kernel 安装 -> initramfs -> dpkg configure -> GRUB

再把真正需要的版本文件回写 VFAT，恢复真实 /boot，最后重新生成 GRUB。
```

这解决了两个问题：

1. Ubuntu 内核安装阶段获得了正常的 Linux 文件系统语义；
2. 产品最终启动布局仍保持原样，不在这次安全加固中做永久分区架构改造。

## 一个容易踩的坑：`mount --move` 在这台 appliance 上不可用

原本考虑过：

```bash
mount --move /boot <临时目录>
```

真实宿主上失败了，原因和 appliance 的 mount propagation / 层级约束有关。

最终有效方法是：

```text
sync
umount /boot
mount /dev/sda1 <临时目录>
```

此时根分区 ext4 中原本被挂载遮住的 `/boot` 目录重新暴露出来。

在这个状态下**禁止重启**，因为固件实际启动文件仍位于临时挂载的 VFAT 中。

## 不装 linux-generic 元包，而是显式安装三个 kernel 包

这台产品的包管理也不是标准 Ubuntu：宿主甚至没有完整 `/var/lib/apt/lists`，原内核也不是通过 `linux-generic` 元包维护。

现场验证发现：

- 安装 `linux-generic` 会额外拉入 headers、firmware、microcode 等大量内容；
- 对 appliance 来说变更面没有必要这么大；
- 真正修复所需的是目标 GA 内核的 image、modules、modules-extra。

所以最终使用独立临时 APT 索引，并显式安装：

```text
linux-image-5.15.0-191-generic
linux-modules-5.15.0-191-generic
linux-modules-extra-5.15.0-191-generic
```

安装完成后执行：

```text
dpkg --configure -a
update-initramfs -u -k 5.15.0-191-generic
update-grub
dpkg --audit
apt-get check
```

并确认新旧两套 kernel、initrd、GRUB 启动项都完整存在。

## 回写 VFAT 时，又踩了两个坑

ext4 `/boot` 中会出现方便使用的 symlink，例如：

```text
vmlinuz
vmlinuz.old
initrd.img
initrd.img.old
```

但产品原来的 VFAT `/boot` 并不依赖这些链接，GRUB 直接使用带版本号的真实文件。

如果回写时错误展开这些链接，会同时造成容量和文件系统语义问题。

现场证伪了两种写法：

```text
cp -aL ext4:/boot -> VFAT
```

会尝试保留 hard-link 关系，VFAT 报 `Operation not permitted`。

而：

```text
rsync --copy-links --no-hard-links
```

会把四个 convenience symlink 展开成额外的完整 kernel/initrd 文件，最终把 260MB VFAT 写满，出现 `No space left on device`。

最后真正有效的是：

```bash
rsync -rltD --no-links /boot/ <VFAT临时挂载点>/
```

只复制真实版本文件，跳过 symlink。

回写前还增加了一个容量门禁：按真实 regular file 总大小计算，并额外预留 32MiB，不够空间就停止，不删除旧内核硬腾空间。

## 最重要的一步：恢复 VFAT 后再跑一次 update-grub

临时 ext4 `/boot` 阶段生成的 GRUB，是基于当时的挂载视角。

所以回写结束后必须先恢复：

```text
/dev/sda1 VFAT -> /boot
```

然后再次执行：

```bash
update-grub
```

这样 GRUB 最终记录的才是产品实际启动路径：

```text
/vmlinuz-5.15.0-191-generic
/initrd.img-5.15.0-191-generic
```

而不是临时 ext4 视角下的错误路径。

这一点非常关键。

## 最终结果：真实重启验证通过

测试机最终成功从：

```text
5.15.0-72-generic
```

升级并启动到：

```text
5.15.0-191-generic
```

对应 Ubuntu package version：

```text
5.15.0-191.201
```

高于两项 CVE 在 Jammy GA 5.15 的最低修复版本：

```text
5.15.0-181.191
```

重启后验证包括：

- `/boot` 已恢复为原来的 VFAT；
- 新旧两套 GRUB 启动项都保留；
- `dpkg --audit`、`apt-get check` 通过；
- 10 个产品容器全部正常；
- minion、hwminion、SSH、Docker 正常；
- 管理网络和默认路由正常；
- Intel `igb`、KVM、overlay、bridge 正常；
- iptables / 产品流量处理正常；
- HTTPS 返回 200；
- 临时 `esp4/esp6/rxrpc` 屏蔽配置已经撤销。

这意味着这次不只是“kernel package 装上了”，而是完成了真正的**重启后系统和产品级验收**。

## 这次最后留下来的几个结论

1. 看到 Ubuntu 22.04，不代表可以直接套标准 Ubuntu 内核升级 SOP。
2. `/boot=vfat` 的 appliance 必须先解决安装阶段的文件系统语义问题。
3. 不要在半安装状态反复 `apt install`、`dpkg --configure -a` 碰运气。
4. 安装 appliance 内核时，显式 image/modules/modules-extra 往往比引入整个 `linux-generic` 元包更可控。
5. 临时 ext4 `/boot` 方案能工作，但一定要有带外控制台、完整备份、容量门禁和旧内核回退。
6. VFAT 回写不能展开 convenience symlink。
7. 最终 `update-grub` 必须在真实 VFAT `/boot` 已恢复之后执行。
8. 是否修复不能只看 package 文件存在，必须以 reboot 后 `uname -r` 和业务验收为准。

完整、可复制执行的维护窗口 SOP 统一放在 Zwiki：

**[Ubuntu22 内核漏洞安全加固](https://zwiki.gitbook.io/zwiki-docs/infrastructure/system/ubuntu22-kernel-security-hardening)**

Zblog 保留排查过程和工程结论；Zwiki 维护最终可以直接执行的版本。