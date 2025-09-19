# todocx

A handy tool to convert markdown file to a docx file.

It can be used often when you have to use LLM to finish a Word report.

## Installation

### Using [bun](https://bun.sh/) (currently the only way)

```sh
bun i -g todocx
```

You may need to add bun's global bin folder to PATH.

## Usage

### Simplest

Copy markdown content to clipboard -> Run `todocx` -> The converted docx file with a random name will be opened.

### Specify an input file

Run `todocx -i input.md` -> The converted docx file with a random name will be opened.

### Specify an output name

Run `todocx -i input.md -o output.docx` -> The converted docx file with the specified name will be opened.
