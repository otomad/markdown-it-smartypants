# markdown-it-smartypants

> A [markdown-it](https://github.com/markdown-it/markdown-it) plugin that brings [SmartyPants](https://daringfireball.net/projects/smartypants/)-style typographic enhancements to your Markdown. Also usable as a standalone text transformer.

**SmartyPants** — originally created by [John Gruber](https://daringfireball.net/) in Perl and later ported to Python — intelligently converts plain ASCII punctuation into their proper typographic equivalents: straight quotes become curly ("smart") quotes, `--` becomes an en-dash, `---` becomes an em-dash, `...` becomes an ellipsis, and more.

This project is a modern JavaScript/TypeScript implementation, available both as a markdown-it plugin and as a standalone utility function. It extends the original SmartyPants with additional typographic rules tailored for multilingual (especially CJK) content.

## Installation

```bash
npm install markdown-it-smartypants
```

## Usage

### As a markdown-it plugin

```js
import MarkdownIt from "markdown-it";
import smartypants from "markdown-it-smartypants";

const md = new MarkdownIt().use(smartypants);

md.render('"Hello," she said -- with a grin...');
// → <p>&#x201C;Hello,&#x201D; she said &#x2013; with a grin&#x2026;</p>
```

With custom options:

```js
md.use(smartypants, {
  "2Hyphen-EnDash": false,   // leave -- as-is
  "Periods-BottomEllipsis": false, // leave ... as-is
});
```

### As a standalone text transformer

You can use `parseText` directly to transform plain text without markdown-it or any other Markdown rendering tool:

```js
import parseText from "markdown-it-smartypants/utils";

parseText('"Hello," she said -- with a grin...');
// → &#x201C;Hello,&#x201D; she said &#x2013; with a grin&#x2026;
```

This is useful when you only need typographic replacements on plain text — no Markdown parsing overhead, no dependencies on markdown-it.

## Options

All options are **enabled by default**. Pass `false` for any rule you want to disable.

| Option | Input | Output | Description |
|---|---|---|---|
| `3Hyphen-EmDash` | `---` | `—` | Three hyphens → em dash |
| `2Hyphen-EnDash` | `--` | `–` | Two hyphens → en dash |
| `3EmDashes-3EmDash` | `———` | `⸻` | Three em dashes → 3-em dash |
| `2EmDashes-2EmDash` | `——` | `⸺` | Two em dashes → 2-em dash |
| `2HorizBar-2EmDash` | `――` | `⸺` | Two horizontal bars → 2-em dash |
| `2BoxDrawHoriz-2EmDash` | `──` | `⸺` | Two box-drawing horizontals → 2-em dash |
| `Periods-BottomEllipsis` | `...` / `....` | `…` / `….` | Three/four periods → bottom ellipsis |
| `Periods-MiddleEllipsis` | `......` / `............` | `⋯⋯` / `⋯⋯⋯⋯` | Six/twelve periods → middle ellipses |
| `Bottom-MiddleEllipsis` | `……` / `…………` | `⋯⋯` / `⋯⋯⋯⋯` | Bottom ellipses → middle ellipses |
| `CjkPeriods-MiddleEllipsis` | `。。。` / `。。。。。。` / `。。。。。。。。。。。。` | `⋯⋯` / `⋯⋯⋯⋯` | CJK periods → middle ellipses |
| `2LessGreaterThan-DoubleAngleQuote` | `<<` / `>>` | `«` / `»` | Double less/greater-than → angle quotes |
| `Straight-CurlyQuote` | `"` / `'` | `"`/`"` / `'`/`'` | Straight quotes → curly quotes |
| `Halfwidth-FullwidthCurlyQuote` | halfwidth `"` `"` `'` `'` | fullwidth variants | Halfwidth → fullwidth curly quotes |

### Option detail: `Straight-CurlyQuote`

This rule uses heuristic context-aware parsing adapted from the [Python-Markdown SmartyPants extension](https://github.com/Python-Markdown/markdown). It determines whether a straight quote should open or close based on surrounding characters, handling:

- Quotes at the very start of text, followed by punctuation
- Nested double and single quotes (`"'quoted' words"`)
- Decade abbreviations (`the '80s`)
- Opening quotes after whitespace or dashes
- Closing quotes before whitespace or at word boundaries
- Possessives and contractions

### Option detail: CJK-related rules

Several rules (`2HorizBar-2EmDash`, `2BoxDrawHoriz-2EmDash`, `Periods-MiddleEllipsis`, `Bottom-MiddleEllipsis`, `CjkPeriods-MiddleEllipsis`, `Halfwidth-FullwidthCurlyQuote`) handle typographic conventions specific to Chinese, Japanese, and Korean text, where:

- Two-em dashes (`⸺`) are used as Chinese em dashes, often input as two consecutive em dashes, horizontal bars, or box-drawing characters due to font rendering issues
- Middle ellipses (`⋯`) are the standard ellipsis in CJK typography, centered vertically on the line
- Fullwidth curly quotes are preferred in CJK contexts for better alignment with fullwidth characters

## Why?

*This section is adapted from [John Gruber's original SmartyPants page](https://daringfireball.net/projects/smartypants/).*

In many writing contexts — especially on the web — people use straight, "typewriter" quotation marks (`"` and `'`) and makeshift dash/ellipsis approximations (`--`, `...`). These are holdovers from the mechanical constraints of typewriters, not intentional typographic choices.

Proper typographic punctuation — curly quotes, en and em dashes, true ellipses — improves readability and gives text a more polished, professional appearance. As John Gruber put it:

> "Many aspects of website design have improved to the point that nuances and flourishes formerly reserved for the printed page are feasible and pleasing."

The elegance of SmartyPants (and this plugin) is that **authors don't need to change how they write**. They keep typing plain ASCII characters — `"like this"` and `a thought--perhaps` — and the transformation to typographically correct punctuation happens automatically at render time. No need to memorize HTML entities or hunt for special characters.

## Why Not?

*Also adapted from Gruber's original.*

SmartyPants is not for everyone or every context:

**It can guess wrong.** The curly-quote algorithm uses heuristics. While it handles most cases correctly, edge cases exist — especially with unusual punctuation patterns, contractions, or possessives at word boundaries.

**Straight quotes are intentional sometimes.** In code, ASCII art, certain branding styles, or when indicating feet/inches (`5'10"`), straight quotes are correct and converting them would be wrong. This plugin is safe to use within markdown-it because it operates only on text content — code blocks and code spans are naturally excluded from processing.

**Not everyone likes the look.** Some designers and readers genuinely prefer the clean, consistent appearance of straight quotes. Typography is, to some degree, a matter of taste.

**It adds processing cost.** Each text token goes through pattern matching and replacement. For most use cases the overhead is negligible, but if you're rendering thousands of documents per second, every bit counts.

The good news: with markdown-it-smartypants, you can enable only the rules you want and disable the rest. Prefer en/em dashes but hate smart quotes? Just turn off `Straight-CurlyQuote`.

## How It Works

The plugin disables markdown-it's built-in `replacements` rule (which does basic `--` → `–` and `---` → `—` conversions) and replaces it with a more comprehensive text renderer. By the time markdown-it reaches the text rendering stage, all Markdown formatting tokens have been parsed and stripped away — so the plugin sees only plain text, free from HTML or Markdown interference.

```
Markdown source → Tokenized → Rendering (plugin hooks here) → HTML output
```

## Related Projects

- [Original SmartyPants (Perl)](https://daringfireball.net/projects/smartypants/) — John Gruber's original implementation
- [Python-Markdown SmartyPants](https://github.com/Python-Markdown/markdown) — the Python port that inspired parts of this project
- [fullwidth-quotes](https://www.npmjs.com/package/fullwidth-quotes) — used internally for halfwidth-to-fullwidth curly quote conversion

## License

MIT
