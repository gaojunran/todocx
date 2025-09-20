#!/usr/bin/env bun
import * as fs from "fs";
import * as path from "node:path";
import { unified } from "unified";
import docx, { type DocxOptions } from "remark-docx";
import clipboard from "clipboardy";
import open from "open";
import { Command } from "commander";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeMermaid from "rehype-mermaid";
import rehypeRemark from "rehype-remark";
import sizeOf from "image-size";

const program = new Command();

function randomId(length: number = 6) {
	const chars =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}

program
	.name("todocx")
	.description("Convert Markdown to DOCX")
	.option(
		"-i, --input <file>",
		"Input markdown file. If omitted, read from clipboard",
	)
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

const processor = unified()
	.use(remarkParse)
  .use(remarkGfm)
	.use(remarkRehype)
	.use(rehypeMermaid, {
		strategy: "img-png",
	})
	.use(rehypeRemark)
	.use(docx, {
		output: "buffer",
		imageResolver: (src: string) => {
			if (src.startsWith("data:image/png;base64,")) {
				const base64 = src.replace("data:image/png;base64,", "");
				const imageBuffer = Buffer.from(base64, "base64");
				const dimensions = sizeOf(imageBuffer); // { width, height }
				return {
					image: imageBuffer,
					width: dimensions.width ?? 800,
					height: dimensions.height ?? 600,
				};
			}
			return {
				image: new Uint8Array(),
				width: 1000,
				height: 600,
			};
		},
	} as unknown as DocxOptions);

(async () => {
	try {
		const doc = await processor.process(markdownText);
		const buffer = (await doc.result) as Buffer;
		fs.writeFileSync(outputFile, buffer);

		console.log(`Word file generated: ${outputFile}`);

		await open(path.resolve(outputFile));
	} catch (err) {
		console.error("Error processing markdown:", err);
		process.exit(1);
	}
})();
