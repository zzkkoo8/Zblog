---
title: 一次 Ubuntu 22.04 内核漏洞修复，把我带进了 /boot VFAT 的坑
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
description: 记录一次 Ubuntu 22.04 内核漏洞修复中，因为产品把 VFAT 分区直接挂载到 /boot，最终导致 linux-image 安装、initramfs 生成和 dpkg 状态连续异常的排查过程。
---

这次事情的起点其实很普通：Ubuntu 22.04 上发现了需要修复的内核漏洞。

目标也不复杂——只升级 GA 5.15 内核和必要依赖，不做整机 `apt upgrade`，尽量把变更面控制到最小。

一开始我以为这会是一件很标准的事情：

```bash
sudo apt-get update
apt-cache policy linux-generic
sudo apt-get -s install linux-generic
sudo apt-get install linux-generic
```

结果真正花时间的不是漏洞本身，而是一套产品定制过的启动盘布局。

## 原本以为只是一次普通内核升级

Ubuntu 22.04 Server 默认 GA 内核轨道是 5.15。针对这次处理的漏洞，没有必要为了修复 CVE 主动切到 HWE 6.8，继续跟随 `linux-generic` 的 GA 5.15 更新即可。

这种场景下，我更倾向于明确安装目标：

```bash
sudo apt-get install linux-generic
```

而不是直接：

```bash
sudo apt upgrade
```

原因很简单：这次要解决的是内核漏洞，不希望顺手把服务器上一堆无关软件一起升级。

真正的问题出现在安装过程中。

## 第一个异常：Operation not permitted

现场执行标准 kernel package 安装后，开始出现类似错误：

```text
Failed to create symlink to vmlinuz-...: Operation not permitted
```

随后 `update-initramfs` 还可能继续报：

```text
ln: failed to create hard link '/boot/initrd.img-....dpkg-bak' ...: Operation not permitted
```

如果只看第一眼，很容易怀疑几个方向：

- 某个具体 kernel package 损坏；
- `/boot` 权限异常；
- `fs.protected_hardlinks` 之类的内核安全参数阻止了操作；
- APT / dpkg 状态有问题。

但继续往下查后，问题和这些都不完全一样。

## 真正的根因在 /boot

先看挂载关系：

```bash
findmnt /
findmnt /boot
findmnt /boot/efi 2>/dev/null || true
```

现场产品的磁盘布局大致是：

```text
/dev/sda2 ext4  -> /
/dev/sda1 vfat  -> /boot
```

也就是说，这台设备不是常见的“Linux 文件系统上的 `/boot` + 独立 EFI 分区”，而是把 EFI、GRUB、kernel、initrd 全塞进了同一个 VFAT 分区：

```text
/dev/sda1 VFAT
└── /boot
    ├── EFI/BOOT/BOOTX64.EFI
    ├── grub/grub.cfg
    ├── vmlinuz-*
    └── initrd.img-*
```

这时问题基本就清楚了。

VFAT/FAT 不具备标准 Linux hard-link / symlink 语义，而 Ubuntu 的 `linux-image` maintainer scripts、`linux-update-symlinks`、`update-initramfs` 在安装内核时会依赖这些文件系统能力。

为了确认，不需要反复重装 kernel，直接做一个最小 hard-link 测试就够了：

```bash
sudo bash -c 't=/boot/.kernel-hardlink-test.$$; : > "$t"; ln "$t" "$t.link"; rc=$?; ls -li "$t" "$t.link" 2>/dev/null || true; rm -f "$t" "$t.link"; exit $rc'
```

如果这里直接得到：

```text
Operation not permitted
```

就已经证明 `/boot` 的文件系统语义和 Ubuntu 原生 kernel package 流程不兼容。

这也是这次排查里最重要的一点：**不是某一个 5.15 内核包坏了，而是启动盘设计和 Ubuntu 的标准升级机制存在结构性冲突。**

## 一次失败安装，会把问题继续放大

kernel 安装不是简单把一个 `vmlinuz` 文件复制进去就结束。

一次失败后，可能同时出现几种状态：

```text
linux-image-<new>      iF
linux-image-generic    iU
linux-generic          iU
```

这时候新版本的：

```text
/boot/vmlinuz-<new>
```

可能已经存在，但对应的：

```text
/boot/initrd.img-<new>
```

却没有成功生成。

更麻烦的是，GRUB 甚至可能生成一个不完整启动项：有新 kernel，却没有对应 initrd。

所以看到下面这些现象，都不能直接宣布升级成功：

```text
linux-generic is already the newest version
```

或者：

```text
/boot/vmlinuz-<new> 已经存在
```

真正应该看的至少有三件事：

```bash
sudo dpkg --audit
ls -lh /boot/vmlinuz-* /boot/initrd.img-* 2>/dev/null
uname -r
```

其中 `uname -r` 在 reboot 前仍然显示旧内核，这是正常现象。只有重启后它才代表当前真正运行的 kernel。

## 这里最危险的动作是“继续试”

碰到这类故障后，一个很自然的反应是继续执行：

```bash
sudo dpkg --configure -a
sudo apt-get install linux-generic
sudo update-initramfs -u -k all
sudo update-grub
```

但如果根因已经确认是 `/boot=vfat`，这些命令只会重复撞到同一个限制，还可能不断叠加半配置 package。

这次最终形成的原则是：

> 一旦确认产品定制的 `/boot` 与 Ubuntu 原生 kernel package 不兼容，就停止标准 APT/DPKG 内核事务，不再靠反复执行命令碰运气。

如果新 kernel 没有完整 initrd，或者 package 还处于 `iF` / `iU` 状态，也不要因为“文件已经装了一半”就贸然 reboot。

当前已经验证可运行的旧 kernel，反而是这时最重要的回退资产。

因此几条底线很明确：

- 不删除当前旧 kernel；
- 不执行 `apt autoremove`；
- 新 kernel 没有完整 initrd 时不重启；
- 不修改 `linux-update-symlinks` 或跳过 maintainer script，强行把 dpkg 状态伪装成成功；
- 先解决产品启动链兼容性，再谈长期 kernel 升级。

## 这次之后，我给内核升级加了几个硬检查

以前看到 CVE，思路可能是“确认版本 → 升级 → reboot → 验收”。

现在我会在安装 kernel 之前先检查：

```bash
sudo dpkg --audit
findmnt /boot
findmnt /boot/efi 2>/dev/null || true
df -h /boot
apt-cache policy linux-generic
sudo apt-get -s install linux-generic
```

如果设备是标准 Ubuntu，这些检查成本很低。

如果设备是厂商定制系统，它们却可能提前发现真正决定升级成败的问题：

- `/boot` 是否使用了不适合标准 kernel package 的文件系统；
- dpkg 是否已经有历史遗留事务；
- boot 空间是否够；
- 当前 kernel 是否由 Ubuntu 元包正常跟踪；
- 模拟安装是否会带来异常依赖或删除动作。

对生产设备来说，多花几分钟做这些检查，比 kernel 安装到一半再处理 `iF/iU` 状态便宜得多。

## 安全加固不等于“看到漏洞就 apt upgrade”

这次折腾让我重新确认了一件事：安全补丁本身往往不是最复杂的部分，真正复杂的是补丁要落到什么系统上。

同样写着 Ubuntu 22.04：

- 普通 Ubuntu Server；
- 厂商重新打包的 appliance；
- 改过 GRUB / initramfs 的产品；
- 自己设计过 `/boot` 的硬件设备；

它们对“执行 `apt-get install linux-generic`”这条命令的含义可能完全不同。

所以现在我的处理顺序变成了：

```text
确认漏洞修复基线
        ↓
确认系统/产品的 kernel 管理方式
        ↓
检查 dpkg、/boot、GRUB、initramfs、回退条件
        ↓
模拟安装
        ↓
正式安装
        ↓
确认 vmlinuz + initrd + GRUB 完整
        ↓
再 reboot
        ↓
用 uname -r 和业务状态验收
```

“能安装一个新 kernel package”和“系统已经安全、可以重启”之间，中间其实隔着不少东西。

## 完整操作手册放在 Zwiki

这篇博客只记录这次排查的过程和我最后留下来的经验。

完整的 Ubuntu 22.04 内核安全加固 SOP，包括：

- GA 5.15 内核升级；
- `dpkg` / APT 前置检查；
- `/boot` hard-link 检查；
- 在线和离线升级；
- 重启前检查；
- 回退；
- 产品定制系统 `/boot=vfat` 的特殊处置；
- 无法立即升级时的临时缓解；

统一维护在 Zwiki：

**[Ubuntu22 内核漏洞安全加固](https://zwiki.gitbook.io/zwiki-docs/infrastructure/system/ubuntu22-kernel-security-hardening)**

博客记录为什么踩坑，Zwiki 维护以后真正拿来执行的版本。这样下次再遇到类似设备，就不用重新从 `Operation not permitted` 开始猜了。
