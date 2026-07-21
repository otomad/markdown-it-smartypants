# markdown-it-smartypants

[![npm](https://img.shields.io/npm/v/markdown-it-smartypants?logo=npm&logoColor=%23CB3837&label=npm&labelColor=white&color=%23CB3837)](https://www.npmjs.org/package/markdown-it-smartypants)
[![GitHub](https://img.shields.io/npm/v/markdown-it-smartypants?logo=github&label=GitHub&color=%23181717)](https://github.com/otomad/markdown-it-smartypants)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)][license-url]

[license-url]: https://opensource.org/licenses/MIT

> A [markdown-it](https://github.com/markdown-it/markdown-it) plugin that brings [SmartyPants](https://daringfireball.net/projects/smartypants/)-style typographic enhancements to your Markdown. Also usable as a standalone text transformer.

**SmartyPants** — originally created by [John Gruber](https://daringfireball.net/) in Perl and later ported to Python — intelligently converts plain ASCII punctuation into their proper typographic equivalents: straight ("dumb") quotes become curly (“smart”) quotes, `--` becomes an en-dash, `---` becomes an em-dash, `...` becomes an ellipsis, and more.

This project is a modern JavaScript/TypeScript implementation, available both as a markdown-it plugin and as a standalone utility function. It extends the original SmartyPants with additional typographic rules tailored for multilingual (especially CJK) content.

## Installation

```bash
# npm
npm install markdown-it-smartypants

# yarn
yarn add markdown-it-smartypants

# pnpm
pnpm add markdown-it-smartypants
```

## Usage

### As a markdown-it plugin

```js
import markdownit from "markdown-it";
import smartypants from "markdown-it-smartypants";

const md = new markdownit().use(smartypants);

md.render('"Hello," she said -- with a grin...');
// → <p>“Hello,” she said – with a grin…</p>
```

With custom options:

```js
md.use(smartypants, {
  "2Hyphen-EnDash": false, // leave -- as-is
  "Periods-BottomEllipsis": false, // leave ... as-is
});
```

### As a standalone text transformer

You can use `parseText` directly to transform plain text without markdown-it or any other Markdown rendering tool:

```js
import parseText from "markdown-it-smartypants/utils";

parseText('"Hello," she said -- with a grin...');
// → “Hello,” she said – with a grin…
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
| `Straight-CurlyQuote` | `"` / `'` | `“`/`”` / `‘`/`’` | Straight quotes → curly quotes |
| `Halfwidth-FullwidthCurlyQuote` | halfwidth `“` `”` `‘` `’` | fullwidth variants | Halfwidth curly quotes → fullwidth curly quotes |

### Option detail: `Straight-CurlyQuote`

This rule uses heuristic context-aware parsing adapted from the [Python-Markdown SmartyPants extension](https://Python-Markdown.github.io/extensions/smarty). It determines whether a straight quote should open or close based on surrounding characters, handling:

- Quotes at the very start of text, followed by punctuation.
- Nested double and single quotes (`“‘quoted’ words”`).
- Decade abbreviations (`the ’80s`).
- Opening quotes after whitespace or dashes.
- Closing quotes before whitespace or at word boundaries.
- Possessives and contractions.

### Option detail: CJK-related rules

Several rules (`2HorizBar-2EmDash`, `2BoxDrawHoriz-2EmDash`, `Periods-MiddleEllipsis`, `Bottom-MiddleEllipsis`, `CjkPeriods-MiddleEllipsis`, `Halfwidth-FullwidthCurlyQuote`) handle typographic conventions specific to Chinese, Japanese, and Korean text, where:

- Two-em dashes (`⸺`) are used as Chinese em dashes, often input as two consecutive em dashes, horizontal bars, or box-drawing characters due to font rendering issues.
- Middle ellipses (`⋯⋯`) are the ellipsis in CJK typography, centered vertically on the line.
- Fullwidth curly quotes are preferred in CJK contexts for better alignment with fullwidth characters.

---

> *The sections below are adapted from [John Gruber’s original SmartyPants page](https://daringfireball.net/projects/smartypants/).*

## Why?

**Because proper typographic punctuation looks sharp.**

---

In many writing contexts — especially on the web — people use straight, “typewriter” quotation marks (`"` and `'`) and makeshift dash/ellipsis approximations (`--`, `...`). These are holdovers from the mechanical constraints of typewriters, not intentional typographic choices.

Proper typographic punctuation — curly quotes, en and em dashes, true ellipses — improves readability and gives text a more polished, professional appearance.

> “Many aspects of website design have improved to the point that nuances and flourishes formerly reserved for the printed page are feasible and pleasing.”

The elegance of SmartyPants (and this plugin) is that **authors don’t need to change how they input**. They keep typing plain ASCII characters — `"like this"` and `a thought--perhaps` — and the transformation to typographically correct punctuation happens automatically at render time. No need to memorize HTML entities or hunt for special characters.

## Why Not?

For one thing, you might not care.

Most normal, mentally stable individuals do not take notice of proper typographic punctuation. Many design and typography nerds, however, break out in a nasty rash when they encounter, say, a restaurant sign that uses a straight apostrophe to spell “Joe’s”.

If you’re the sort of person who just doesn’t care, you might well want to continue not caring. Using straight quotes — and sticking to the 7-bit ASCII character set in general — is certainly a simpler way to live.

Even if you *do* care about accurate typography, you still might want to think twice before educating the quote characters in your weblog. One side effect of publishing curly quote HTML entities is that it makes your weblog a bit harder for others to quote from using copy-and-paste. What happens is that when they copy text from your blog, they copy the 8-bit curly quote characters (as well as the 8-bit characters for em-dashes and ellipses, if you use these options). These characters are not standard across different text encoding methods, which is why they need to be encoded as HTML entities.

People copying text from your weblog, however, may not notice that you’re using curly quotes, and they’ll go ahead and paste the unencoded 8-bit characters copied from their browser into an email message or their own weblog. When pasted as raw “smart quotes”, these characters are likely to get mangled beyond recognition.

That said, my own opinion is that any decent text editor or email client should be able to stupefy smart quote characters into their 7-bit equivalents, and I don’t consider it my problem if you’re using an indecent text editor or email client.

## How It Works

The plugin disables markdown-it’s built-in `replacements` rule (which does basic `--` → `–` and `---` → `—` conversions) and replaces it with a more comprehensive text renderer. By the time markdown-it reaches the text rendering stage, all Markdown formatting tokens have been parsed and stripped away — so the plugin sees only plain text, free from HTML or Markdown interference.

```
Markdown source → Tokenized → Rendering (plugin hooks here) → HTML output
```

## Algorithmic Shortcomings

One situation in which quotes will get curled the wrong way is when apostrophes are used at the start of leading contractions. For example:

```
'Twas the night before Christmas.
```

In the case above, SmartyPants will turn the apostrophe into an opening single-quote, when in fact it should be a closing one. I don’t think this problem can be solved in the general case — every word processor I’ve tried gets this wrong as well. In such cases, it’s best to use the proper HTML entity for closing single-quotes (`&#8217;` or `&rsquo;`) by hand, or to use the raw UTF-8 quote character ( ’ ).

## Related Projects

- [Original SmartyPants (Perl)](https://daringfireball.net/projects/smartypants/) — John Gruber’s original implementation.
- [Python-Markdown SmartyPants](https://Python-Markdown.github.io/extensions/smarty) — the Python port that inspired parts of this project.
- [fullwidth-quotes](https://www.npmjs.com/package/fullwidth-quotes) — used internally for halfwidth-to-fullwidth curly quote conversion.

## License

[MIT](LICENSE)
