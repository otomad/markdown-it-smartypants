import { enableSvsQuotes } from "fullwidth-quotes";

const chars = {
	leftDoubleQuotesAmbiguous: "“",
	rightDoubleQuotesAmbiguous: "”",
	leftSingleQuotesAmbiguous: "‘",
	rightSingleQuotesAmbiguous: "’",
	leftDoubleQuotesHalfwidth: "“\ufe00",
	rightDoubleQuotesHalfwidth: "”\ufe00",
	leftSingleQuotesHalfwidth: "‘\ufe00",
	rightSingleQuotesHalfwidth: "’\ufe00",
	leftDoubleQuotesFullwidth: "“\ufe01",
	rightDoubleQuotesFullwidth: "”\ufe01",
	leftSingleQuotesFullwidth: "‘\ufe01",
	rightSingleQuotesFullwidth: "’\ufe01",
	leftDoubleQuotesMongolian: "“\ufe02",
	rightDoubleQuotesMongolian: "”\ufe02",
	leftSingleQuotesMongolian: "‘\ufe02",
	rightSingleQuotesMongolian: "’\ufe02",
	leftAngleQuotes: "«",
	rightAngleQuotes: "»",
	bottomEllipsis: "…",
	middleEllipsis: "⋯",
	enDash: "–",
	emDash: "—",
	horizontalBar: "―",
	boxDrawingsHorizontal: "─",
	emDashX2: "⸺",
	emDashX3: "⸻",
} as const;

const regexes = {
	// Special case if the very first character is a quote
	// followed by punctuation at a non-word-break. Close the quotes by brute force:
	singleQuoteStart: /^'(?=[\p{P}\p{S}]\B)/gu,
	doubleQuoteStart: /^"(?=[\p{P}\p{S}]\B)/gu,

	// Special case for double sets of quotes, e.g.:
	// <p>He said, "'Quoted' words in a larger quote."</p>
	doubleQuoteSets: /"'(?=\w)/g,
	singleQuoteSets: /'"(?=\w)/g,
	doubleQuoteSets2: /(?<=\p{Term})'"/gu,
	singleQuoteSets2: /(?<=\p{Term})"'/gu,

	// Special case for decade abbreviations (the '80s):
	decadeAbbr: /(?<!\w)'(?=\d+s)/g,

	// Get most opening double quotes:
	openingDoubleQuotes: /([\s\-–—])"(?=\w)/g,

	// Double closing quotes:
	closingDoubleQuotes: /"(?=\s)/g, // r'"(?=\s)',
	closingDoubleQuotes2: /(?<=[^ \t\r\n\p{Ps}\p{Pi}\-\x02\x03])"/gu,

	// Get most opening single quotes:
	openingSingleQuotes: /([\s\-–—])'(?=\w)/g,

	// Single closing quotes:
	closingSingleQuotes: /(?<=[^ \t\r\n\p{Ps}\p{Pi}\-\x02\x03])'(?!\s|s\b|\d)/gu,
	closingSingleQuotes2: /'(\s|s\b)/g,

	// All remaining quotes should be opening ones.
	remainingSingleQuotes: "'",
	remainingDoubleQuotes: '"',
} as const;

export function parseText(text: string) {
	// 3 hyphens → em dash (English em dash)
	if (text.includes("---")) text = text.replaceAll(/(?<!-)---(?!-)/g, chars.emDash);
	// 2 hyphens → en dash
	if (text.includes("--")) text = text.replaceAll(/(?<!-)--(?!-)/g, chars.enDash);
	// 3 em dashes → 3-em dash
	if (text.includes(chars.emDash.repeat(3))) text = text.replaceAll(/(?<!—)———(?!—)/g, chars.emDashX3);
	// 2 em dashes (Chinese em dash) → 2-em dash
	if (text.includes(chars.emDash.repeat(2))) text = text.replaceAll(/(?<!—)——(?!—)/g, chars.emDashX2);
	// 2 horizontal bars (Chinese em dash, due to some fonts break the 2 em dashes) → 2-em dash
	if (text.includes(chars.horizontalBar.repeat(2))) text = text.replaceAll(/(?<!―)――(?!―)/g, chars.emDashX2);
	// 2 box drawing light horizontals (Chinese em dash, due to some fonts break the 2 em dashes) → 2-em dash
	if (text.includes(chars.boxDrawingsHorizontal.repeat(2)))
		text = text.replaceAll(/(?<![─-▟🬀-🯿𜰀-𜺿])──(?![─-▟🬀-🯿𜰀-𜺿])/gu, chars.emDashX2);

	// 12 periods (irregular form) → 4 middle ellipses (Chinese long text ellipsis)
	if (text.includes(".".repeat(12))) text = text.replaceAll(/(?<!\.)\.{12}(?!\.)/g, chars.middleEllipsis.repeat(4));
	// 6 periods (irregular form) → 2 middle ellipses (Chinese ellipsis)
	if (text.includes("......")) text = text.replaceAll(/(?<!\.)\.{6}(?!\.)/g, chars.middleEllipsis.repeat(2));
	// 4 periods → bottom ellipsis (English ellipsis) + period.
	if (text.includes("....")) text = text.replaceAll(/(?<!\.)\.{4}(?!\.)/g, chars.bottomEllipsis + ".");
	// 3 periods → bottom ellipsis (English ellipsis)
	if (text.includes("...")) text = text.replaceAll(/(?<!\.)\.{3}(?!\.)/g, chars.bottomEllipsis);
	// 4 bottom ellipses → 4 middle ellipses (Chinese long text ellipsis)
	if (text.includes(chars.bottomEllipsis.repeat(4)))
		text = text.replaceAll(/(?<!…)…{4}(?!…)/g, chars.middleEllipsis.repeat(4));
	// 2 bottom ellipses → 2 middle ellipses (Chinese ellipsis)
	if (text.includes(chars.bottomEllipsis.repeat(2)))
		text = text.replaceAll(/(?<!…)…{2}(?!…)/g, chars.middleEllipsis.repeat(2));
	// 12 Chinese periods (irregular form) → 4 middle ellipses (Chinese long text ellipsis)
	if (text.includes("。".repeat(12))) text = text.replaceAll(/(?<!。)。{12}(?!。)/g, chars.middleEllipsis.repeat(4));
	// 6 Chinese periods (irregular form) → 2 middle ellipses (Chinese ellipsis)
	if (text.includes("。。。。。。")) text = text.replaceAll(/(?<!。)。{6}(?!。)/g, chars.middleEllipsis.repeat(2));
	// 3 periods (English ellipsis) → 2 middle ellipses (Chinese ellipsis)
	if (text.includes("。。。")) text = text.replaceAll(/(?<!。)。{3}(?!。)/g, chars.middleEllipsis.repeat(2));

	// 2 less than signs → left pointing double angle quotation mark
	if (text.includes("<<")) text = text.replaceAll("<<", chars.leftAngleQuotes);
	// 2 greater than signs → right pointing double angle quotation mark
	if (text.includes(">>")) text = text.replaceAll(">>", chars.rightAngleQuotes);

	// straight quotation mark → curly quotation mark (recognition)
	if (text.includes('"') || text.includes("'")) {
		// Convert from Python version:
		// https://github.com/Python-Markdown/markdown/blob/8453df010daf9547efcc20a05bb12c0e2fd2016a/markdown/extensions/smarty.py
		text = text
			.replaceAll(regexes.singleQuoteStart, chars.rightSingleQuotesAmbiguous)
			.replaceAll(regexes.doubleQuoteStart, chars.rightDoubleQuotesAmbiguous)
			.replaceAll(regexes.doubleQuoteSets, chars.leftDoubleQuotesAmbiguous + chars.leftSingleQuotesAmbiguous)
			.replaceAll(regexes.singleQuoteSets, chars.leftSingleQuotesAmbiguous + chars.leftDoubleQuotesAmbiguous)
			.replaceAll(regexes.doubleQuoteSets2, chars.rightSingleQuotesAmbiguous + chars.rightDoubleQuotesAmbiguous)
			.replaceAll(regexes.singleQuoteSets2, chars.rightDoubleQuotesAmbiguous + chars.rightSingleQuotesAmbiguous)
			.replaceAll(regexes.decadeAbbr, chars.rightSingleQuotesAmbiguous)
			.replaceAll(regexes.openingSingleQuotes, "$1" + chars.leftSingleQuotesAmbiguous)
			.replaceAll(regexes.closingSingleQuotes, chars.rightSingleQuotesAmbiguous)
			.replaceAll(regexes.closingSingleQuotes2, chars.rightSingleQuotesAmbiguous + "$1")
			.replaceAll(regexes.remainingSingleQuotes, chars.leftSingleQuotesAmbiguous)
			.replaceAll(regexes.openingDoubleQuotes, "$1" + chars.leftDoubleQuotesAmbiguous)
			.replaceAll(regexes.closingDoubleQuotes, chars.rightDoubleQuotesAmbiguous)
			.replaceAll(regexes.closingDoubleQuotes2, chars.rightDoubleQuotesAmbiguous)
			.replaceAll(regexes.remainingDoubleQuotes, chars.rightDoubleQuotesAmbiguous);
	}

	// halfwidth quotation mark → fullwidth quotation mark (recognition)
	if (text.includes("“") || text.includes("”") || text.includes("‘") || text.includes("’")) {
		text = enableSvsQuotes(text);
	}

	return text;
}
