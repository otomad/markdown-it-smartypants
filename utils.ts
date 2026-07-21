import { enableSvsQuotes } from "fullwidth-quotes";
import { chars, regexes } from "./constants.js";
import { defaultOptions, type Options } from "./options.js";

export default function parseText(text: string, options: Options = defaultOptions) {
	for (const [key, defaultValue] of Object.entries(defaultOptions)) options[key as keyof Options] ??= defaultValue;

	if (options["3EmDashes-3EmDash"])
		// 3 hyphens → em dash (English em dash)
		if (text.includes("---")) text = text.replaceAll(/(?<!-)---(?!-)/g, chars.emDash);
	if (options["2Hyphen-EnDash"])
		// 2 hyphens → en dash
		if (text.includes("--")) text = text.replaceAll(/(?<!-)--(?!-)/g, chars.enDash);
	if (options["3EmDashes-3EmDash"])
		// 3 em dashes → 3-em dash
		if (text.includes(chars.emDash.repeat(3))) text = text.replaceAll(/(?<!—)———(?!—)/g, chars.emDashX3);
	if (options["2EmDashes-2EmDash"])
		// 2 em dashes (Chinese em dash) → 2-em dash
		if (text.includes(chars.emDash.repeat(2))) text = text.replaceAll(/(?<!—)——(?!—)/g, chars.emDashX2);
	if (options["2HorizBar-2EmDash"])
		// 2 horizontal bars (Chinese em dash, due to some fonts break the 2 em dashes) → 2-em dash
		if (text.includes(chars.horizontalBar.repeat(2))) text = text.replaceAll(/(?<!―)――(?!―)/g, chars.emDashX2);
	if (options["2BoxDrawHoriz-2EmDash"])
		// 2 box drawing light horizontals (Chinese em dash, due to some fonts break the 2 em dashes) → 2-em dash
		if (text.includes(chars.boxDrawingsHorizontal.repeat(2))) text = text.replaceAll(/(?<![─-▟🬀-🯿𜰀-𜺿])──(?![─-▟🬀-🯿𜰀-𜺿])/gu, chars.emDashX2);

	if (options["Periods-MiddleEllipsis"]) {
		// 12 periods (irregular form) → 4 middle ellipses (Chinese long text ellipsis)
		if (text.includes(".".repeat(12))) text = text.replaceAll(/(?<!\.)\.{12}(?!\.)/g, chars.middleEllipsis.repeat(4));
		// 6 periods (irregular form) → 2 middle ellipses (Chinese ellipsis)
		if (text.includes("......")) text = text.replaceAll(/(?<!\.)\.{6}(?!\.)/g, chars.middleEllipsis.repeat(2));
	}
	if (options["Periods-BottomEllipsis"]) {
		// 4 periods → bottom ellipsis (English ellipsis) + period.
		if (text.includes("....")) text = text.replaceAll(/(?<!\.)\.{4}(?!\.)/g, chars.bottomEllipsis + ".");
		// 3 periods → bottom ellipsis (English ellipsis)
		if (text.includes("...")) text = text.replaceAll(/(?<!\.)\.{3}(?!\.)/g, chars.bottomEllipsis);
	}
	if (options["Bottom-MiddleEllipsis"]) {
		// 4 bottom ellipses → 4 middle ellipses (Chinese long text ellipsis)
		if (text.includes(chars.bottomEllipsis.repeat(4))) text = text.replaceAll(/(?<!…)…{4}(?!…)/g, chars.middleEllipsis.repeat(4));
		// 2 bottom ellipses → 2 middle ellipses (Chinese ellipsis)
		if (text.includes(chars.bottomEllipsis.repeat(2))) text = text.replaceAll(/(?<!…)…{2}(?!…)/g, chars.middleEllipsis.repeat(2));
	}
	if (options["CjkPeriods-MiddleEllipsis"]) {
		// 12 Chinese periods (irregular form) → 4 middle ellipses (Chinese long text ellipsis)
		if (text.includes("。".repeat(12))) text = text.replaceAll(/(?<!。)。{12}(?!。)/g, chars.middleEllipsis.repeat(4));
		// 6 Chinese periods (irregular form) → 2 middle ellipses (Chinese ellipsis)
		if (text.includes("。。。。。。")) text = text.replaceAll(/(?<!。)。{6}(?!。)/g, chars.middleEllipsis.repeat(2));
		// 3 periods (English ellipsis) → 2 middle ellipses (Chinese ellipsis)
		if (text.includes("。。。")) text = text.replaceAll(/(?<!。)。{3}(?!。)/g, chars.middleEllipsis.repeat(2));
	}

	if (options["2LessGreaterThan-DoubleAngleQuote"]) {
		// 2 less than signs → left pointing double angle quotation mark
		if (text.includes("<<")) text = text.replaceAll("<<", chars.leftAngleQuotes);
		// 2 greater than signs → right pointing double angle quotation mark
		if (text.includes(">>")) text = text.replaceAll(">>", chars.rightAngleQuotes);
	}

	if (options["Straight-CurlyQuote"])
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

	if (options["Halfwidth-FullwidthCurlyQuote"])
		// halfwidth quotation mark → fullwidth quotation mark (recognition)
		if (text.includes("“") || text.includes("”") || text.includes("‘") || text.includes("’")) {
			text = enableSvsQuotes(text);
		}

	return text;
}
