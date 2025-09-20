# todocx

A handy tool to convert markdown file to a docx file.

It can be used often when you have to use LLM to finish a Word report.

## Installation

### Using [bun](https://bun.sh/)

```sh
bun i -g todocx
bun pm trust -g todocx  # to run script to install pandoc
```

You may need to add bun's global bin folder to PATH.

## Usage

### Simplest

Copy markdown content to clipboard -> Run `todocx` -> The converted docx file with a random name will be opened.

### Specify an input file

Run `todocx input.md` -> The converted docx file with a random name will be opened.

### Specify an output name

Run `todocx input.md output.docx` -> The converted docx file with the specified name will be opened.
