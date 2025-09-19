#!/usr/bin/env bun
import * as fs from "fs";
import * as path from "node:path";
import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import docx, { type DocxOptions } from "remark-docx";
import clipboard from "clipboardy";
import open from "open";
import { Command } from "commander";

const program = new Command();

function randomId(length: number = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

program
  .name("todocx")
  .description("Convert Markdown to DOCX")
  .option("-i, --input <file>", "Input markdown file. If omitted, read from clipboard")
  .option("-o, --output <file>", "Output DOCX file")
  .parse(process.argv);

const options = program.opts<{ input?: string; output?: string }>();

let inputFile = options.input;
let outputFile = options.output ?? `output-${randomId()}.docx`;

let markdownText: string;

if (inputFile) {
  if (!fs.existsSync(inputFile)) {
    console.error(`Input file does not exist: ${inputFile}`);
    process.exit(1);
  }
  markdownText = fs.readFileSync(inputFile, "utf-8");
} else {
  markdownText = clipboard.readSync();
  if (!markdownText) {
    console.error("Clipboard is empty and no input file provided.");
    process.exit(1);
  }
}

const processor = unified().use(markdown).use(gfm).use(docx, { output: "buffer" } as DocxOptions);

(async () => {
  try {
    const doc = await processor.process(markdownText);
    const buffer = await doc.result as Buffer;
    fs.writeFileSync(outputFile, buffer);

    console.log(`Word file generated: ${outputFile}`);

    await open(path.resolve(outputFile));
  } catch (err) {
    console.error("Error processing markdown:", err);
    process.exit(1);
  }
})();
