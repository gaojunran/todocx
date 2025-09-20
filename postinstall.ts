#!/usr/bin/env bun
import { $ } from "bun";

type Mapping = Record<string, string | string[]>;

const pandocMappings: Record<string, string | string[]> = {
  choco: "pandoc",
  winget: "JohnMacFarlane.Pandoc",
  brew: "pandoc",
  port: "pandoc",
  apt: "pandoc",
  dnf: "pandoc",
  pacman: ["-S", "pandoc"],
};

export default async function postinstall(program: string, mapping: Mapping) {
  if (await $`${program} --version`.quiet()) {
    console.log(`✅ Found program: ${program}`);
    return;
  }
  for (const [pkgManager, installCmd] of Object.entries(mapping)) {
    try {
      // 检查包管理器是否存在
      await $`${pkgManager} --version`.quiet();

      console.log(`✅ Found package manager: ${pkgManager}`);

      // 构造安装命令
      if (Array.isArray(installCmd)) {
        console.log(`📦 Installing ${program} via ${pkgManager} ${installCmd.join(" ")}`);
        await $`${pkgManager} ${installCmd}`;
      } else {
        console.log(`📦 Installing ${program} via ${pkgManager} ${installCmd}`);
        await $`${pkgManager} install ${installCmd} -y`;
      }

      console.log("🎉 Pandoc installed successfully!");
      return;
    } catch {
      // 没找到就继续尝试下一个
      console.log(`⚠️ ${pkgManager} not found`);
    }
  }

  console.error("🚨 No supported package manager found. Please install pandoc manually.");
  process.exit(1);
}

postinstall("pandoc", pandocMappings);
