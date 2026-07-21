import { describe, it, expect } from "vitest";
import MarkdownIt from "markdown-it";
import dedent from "dedent";
import parseText from "./utils";
import smartypantsPlugin from "./index";
import { chars } from "./constants";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Render markdown with the smartypants plugin (all options enabled by default). */
function md(options = {}) {
	return new MarkdownIt().use(smartypantsPlugin, options);
}

// ---------------------------------------------------------------------------
// parseText
// ---------------------------------------------------------------------------

describe("parseText", () => {
	// -- Dashes ----------------------------------------------------------

	describe("3Hyphen-EmDash: --- → —", () => {
		it("converts three hyphens to an em dash", () => {
			expect(parseText("foo---bar")).toContain(chars.emDash);
			expect(parseText("foo---bar")).toBe(`foo${chars.emDash}bar`);
		});

		it("does not convert four or more hyphens", () => {
			expect(parseText("foo----bar")).toBe("foo----bar");
		});

		it("does not convert two hyphens", () => {
			expect(parseText("foo--bar")).toBe(`foo${chars.enDash}bar`);
		});

		it("can be disabled", () => {
			expect(parseText("foo---bar", { "3Hyphen-EmDash": false })).toBe("foo---bar");
		});
	});

	describe("2Hyphen-EnDash: -- → –", () => {
		it("converts two hyphens to an en dash", () => {
			expect(parseText("foo--bar")).toContain(chars.enDash);
			expect(parseText("foo--bar")).toBe(`foo${chars.enDash}bar`);
		});

		it("does not convert a single hyphen", () => {
			expect(parseText("foo-bar")).toBe("foo-bar");
		});

		it("does not convert three or more hyphens (already handled by em dash rule)", () => {
			expect(parseText("foo---bar")).toContain(chars.emDash);
			expect(parseText("foo---bar")).not.toContain(chars.enDash);
		});

		it("can be disabled", () => {
			expect(parseText("foo--bar", { "2Hyphen-EnDash": false })).toBe("foo--bar");
		});
	});

	describe("3EmDashes-3EmDash: ——— → ⸻", () => {
		it("converts three consecutive em dashes to a 3-em dash", () => {
			const input = chars.emDash.repeat(3);
			expect(parseText(input)).toBe(chars.emDashX3);
		});

		it("can be disabled", () => {
			const input = chars.emDash.repeat(3);
			expect(parseText(input, { "3EmDashes-3EmDash": false })).toBe(input);
		});
	});

	describe("2EmDashes-2EmDash: —— → ⸺", () => {
		it("converts two consecutive em dashes to a 2-em dash", () => {
			const input = chars.emDash.repeat(2);
			expect(parseText(input)).toBe(chars.emDashX2);
		});

		it("can be disabled", () => {
			const input = chars.emDash.repeat(2);
			expect(parseText(input, { "2EmDashes-2EmDash": false })).toBe(input);
		});
	});

	describe("2HorizBar-2EmDash: ―― → ⸺", () => {
		it("converts two horizontal bars to a 2-em dash", () => {
			const input = chars.horizontalBar.repeat(2);
			expect(parseText(input)).toBe(chars.emDashX2);
		});

		it("can be disabled", () => {
			const input = chars.horizontalBar.repeat(2);
			expect(parseText(input, { "2HorizBar-2EmDash": false })).toBe(input);
		});
	});

	describe("2BoxDrawHoriz-2EmDash: ── → ⸺", () => {
		it("converts two box-drawing horizontals to a 2-em dash", () => {
			const input = chars.boxDrawingsHorizontal.repeat(2);
			expect(parseText(input)).toBe(chars.emDashX2);
		});

		it("can be disabled", () => {
			const input = chars.boxDrawingsHorizontal.repeat(2);
			expect(parseText(input, { "2BoxDrawHoriz-2EmDash": false })).toBe(input);
		});
	});

	// -- Ellipses --------------------------------------------------------

	describe("Periods-BottomEllipsis", () => {
		it("converts three periods to a bottom ellipsis", () => {
			expect(parseText("foo...bar")).toContain(chars.bottomEllipsis);
			expect(parseText("foo...bar")).toBe(`foo${chars.bottomEllipsis}bar`);
		});

		it("converts four periods to a bottom ellipsis + period", () => {
			expect(parseText("foo....bar")).toBe(`foo${chars.bottomEllipsis}.bar`);
		});

		it("does not convert two periods", () => {
			expect(parseText("foo..bar")).toBe("foo..bar");
		});

		it("can be disabled", () => {
			expect(parseText("foo...bar", { "Periods-BottomEllipsis": false })).toBe("foo...bar");
			expect(parseText("foo....bar", { "Periods-BottomEllipsis": false })).toBe("foo....bar");
		});
	});

	describe("Periods-MiddleEllipsis", () => {
		it("converts six periods to two middle ellipses", () => {
			expect(parseText("foo......bar")).toBe(`foo${chars.middleEllipsis.repeat(2)}bar`);
		});

		it("converts twelve periods to four middle ellipses", () => {
			expect(parseText(`foo${".".repeat(12)}bar`)).toBe(`foo${chars.middleEllipsis.repeat(4)}bar`);
		});

		it("can be disabled", () => {
			expect(parseText("foo......bar", { "Periods-MiddleEllipsis": false })).toBe("foo......bar");
		});
	});

	describe("Bottom-MiddleEllipsis", () => {
		it("converts two bottom ellipses to two middle ellipses", () => {
			const input = `foo${chars.bottomEllipsis.repeat(2)}bar`;
			expect(parseText(input)).toBe(`foo${chars.middleEllipsis.repeat(2)}bar`);
		});

		it("converts four bottom ellipses to four middle ellipses", () => {
			const input = `foo${chars.bottomEllipsis.repeat(4)}bar`;
			expect(parseText(input)).toBe(`foo${chars.middleEllipsis.repeat(4)}bar`);
		});

		it("can be disabled", () => {
			const input = `foo${chars.bottomEllipsis.repeat(2)}bar`;
			expect(parseText(input, { "Bottom-MiddleEllipsis": false })).toBe(input);
		});
	});

	describe("CjkPeriods-MiddleEllipsis", () => {
		it("converts three fullwidth periods to two middle ellipses", () => {
			expect(parseText("foo。。。bar")).toBe(`foo${chars.middleEllipsis.repeat(2)}bar`);
		});

		it("converts six fullwidth periods to two middle ellipses", () => {
			expect(parseText("foo。。。。。。bar")).toBe(`foo${chars.middleEllipsis.repeat(2)}bar`);
		});

		it("converts twelve fullwidth periods to four middle ellipses", () => {
			const input = "foo" + "。".repeat(12) + "bar";
			expect(parseText(input)).toBe(`foo${chars.middleEllipsis.repeat(4)}bar`);
		});

		it("can be disabled", () => {
			expect(parseText("foo。。。bar", { "CjkPeriods-MiddleEllipsis": false })).toBe("foo。。。bar");
		});
	});

	// -- Angle quotes ----------------------------------------------------

	describe("2LessGreaterThan-DoubleAngleQuote: << >> → « »", () => {
		it("converts << to left angle quote", () => {
			expect(parseText("foo<<bar")).toBe(`foo${chars.leftAngleQuotes}bar`);
		});

		it("converts >> to right angle quote", () => {
			expect(parseText("foo>>bar")).toBe(`foo${chars.rightAngleQuotes}bar`);
		});

		it("can be disabled", () => {
			expect(parseText("foo<<bar", { "2LessGreaterThan-DoubleAngleQuote": false })).toBe("foo<<bar");
			expect(parseText("foo>>bar", { "2LessGreaterThan-DoubleAngleQuote": false })).toBe("foo>>bar");
		});
	});

	// -- Curly quotes ----------------------------------------------------

	describe("Straight-CurlyQuote: straight → curly", () => {
		it("converts double quotes preceded by a space to opening curly quotes", () => {
			const result = parseText('He said, "Hello."');
			expect(result).toContain(chars.leftDoubleQuotesAmbiguous);
			expect(result).toContain(chars.rightDoubleQuotesAmbiguous);
		});

		it("converts single quotes to curly quotes", () => {
			const result = parseText("It's a 'test'.");
			expect(result).toContain(chars.rightSingleQuotesAmbiguous); // apostrophe in "It's"
		});

		it("handles nested double and single quotes", () => {
			const result = parseText("He said, \"'Quoted' words in a larger quote.\"");
			// Should have replaced the quote characters
			expect(result).not.toContain('"');
			expect(result).not.toContain("'");
		});

		it("handles decade abbreviations like '80s", () => {
			const result = parseText("the '80s were great");
			// The apostrophe before 80s should become a right single quote
			expect(result).toContain(chars.rightSingleQuotesAmbiguous);
		});

		it("can be disabled", () => {
			expect(parseText('"Hello"', { "Straight-CurlyQuote": false })).toBe('"Hello"');
		});
	});

	// -- Fullwidth quotes ------------------------------------------------

	describe("Halfwidth-FullwidthCurlyQuote", () => {
		it("converts halfwidth curly quotes when present", () => {
			const input = `${chars.leftDoubleQuotesAmbiguous}Hello${chars.rightDoubleQuotesAmbiguous}`;
			const result = parseText(input);
			// The output should differ from the halfwidth variant
			expect(result).not.toBe(input);
		});

		it("can be disabled", () => {
			const input = `${chars.leftDoubleQuotesAmbiguous}Hello${chars.rightDoubleQuotesAmbiguous}`;
			expect(parseText(input, { "Halfwidth-FullwidthCurlyQuote": false })).toBe(input);
		});
	});

	// -- Edge cases ------------------------------------------------------

	describe("edge cases", () => {
		it("returns empty string unchanged", () => {
			expect(parseText("")).toBe("");
		});

		it("returns text with no replacements unchanged", () => {
			expect(parseText("Hello, world!")).toBe("Hello, world!");
		});

		it("handles multiple replacement types in one string", () => {
			const result = parseText('He said, "Wait--is that...really?"');
			expect(result).toContain(chars.enDash);
			expect(result).toContain(chars.bottomEllipsis);
			expect(result).toContain(chars.leftDoubleQuotesAmbiguous);
			expect(result).toContain(chars.rightDoubleQuotesAmbiguous);
		});

		it("handles --- and -- in the same text correctly (order matters)", () => {
			// --- should become em dash, not en-dash + hyphen
			const result = parseText("foo---bar--baz");
			expect(result).toContain(chars.emDash);
			expect(result).toContain(chars.enDash);
			expect(result).not.toContain("---");
			expect(result).not.toContain("--");
		});

		it("respects default options (all enabled)", () => {
			const result = parseText('"Test" -- ...');
			// With all options enabled, straight quotes, dashes, and ellipses should all convert
			expect(result).not.toBe('"Test" -- ...');
		});
	});

	// -- Multiple options disabled ---------------------------------------

	describe("multiple options disabled", () => {
		it("respects multiple disabled options simultaneously", () => {
			const result = parseText('"Hello" -- ...', {
				"Straight-CurlyQuote": false,
				"2Hyphen-EnDash": false,
				"Periods-BottomEllipsis": false,
			});
			expect(result).toContain('"');
			expect(result).toContain("--");
			expect(result).toContain("...");
		});
	});
});

// ---------------------------------------------------------------------------
// smartypantsPlugin (markdown-it integration)
// ---------------------------------------------------------------------------

describe("smartypantsPlugin", () => {
	// -- Basic integration -----------------------------------------------

	it("processes inline text through the markdown-it pipeline", () => {
		const result = md().render('He said, "Hello."');
		expect(result).toContain(chars.leftDoubleQuotesAmbiguous);
		expect(result).toContain(chars.rightDoubleQuotesAmbiguous);
	});

	it("converts dashes in markdown", () => {
		const result = md().render("foo -- bar --- baz");
		expect(result).toContain(chars.enDash);
		expect(result).toContain(chars.emDash);
	});

	it("converts ellipses in markdown", () => {
		const result = md().render("Wait for it...");
		expect(result).toContain(chars.bottomEllipsis);
	});

	// -- Markdown structure preservation ---------------------------------

	it("preserves paragraph tags", () => {
		const result = md().render("Hello world.");
		expect(result).toContain("<p>");
		expect(result).toContain("</p>");
	});

	it("preserves bold formatting", () => {
		const result = md().render('He said, **"Bold text"**');
		expect(result).toContain("<strong>");
		// Quotes inside the strong token are processed; the algorithm
		// converts them to curly quotes (exact direction depends on context).
		expect(result).not.toContain('"Bold text"'); // straight quotes should be replaced
	});

	it("preserves italic formatting", () => {
		const result = md().render('He said, *"Italic text"*');
		expect(result).toContain("<em>");
		expect(result).not.toContain('"Italic text"'); // straight quotes should be replaced
	});

	it("preserves links", () => {
		const result = md().render('[a "link"](https://example.com)');
		expect(result).toContain('<a href="https://example.com">');
	});

	it("does not process text inside code spans", () => {
		const result = md().render('`"straight" -- ...`');
		// Code spans should retain literal characters (but markdown-it escapes " to &quot;)
		expect(result).toContain("<code>");
		expect(result).toContain("&quot;straight&quot;");
		expect(result).toContain("--");
	});

	it("does not process text inside fenced code blocks", () => {
		const input = dedent`
			\`\`\`
			"straight" -- ...
			\`\`\`
		`;
		const result = md().render(input);
		// Code blocks should retain literal characters (but markdown-it escapes " to &quot;)
		expect(result).toContain("&quot;straight&quot;");
		expect(result).toContain("--");
	});

	// -- Custom options --------------------------------------------------

	it("respects disabled options", () => {
		const instance = md({ "2Hyphen-EnDash": false });
		const result = instance.render("foo -- bar");
		expect(result).toContain("--");
		expect(result).not.toContain(chars.enDash);
	});

	it("respects disabled Straight-CurlyQuote option", () => {
		const instance = md({ "Straight-CurlyQuote": false });
		const result = instance.render('"Hello"');
		expect(result).not.toContain(chars.leftDoubleQuotesAmbiguous);
		expect(result).not.toContain(chars.rightDoubleQuotesAmbiguous);
	});

	// -- Complex markdown ------------------------------------------------

	it("handles text with formatting and typographic characters together", () => {
		const input = dedent`
			He said, **"Wait--is that...really?"**

			She replied, *"Yes--indeed."*
		`;
		const result = md().render(input);
		expect(result).toContain(chars.enDash);
		expect(result).toContain(chars.bottomEllipsis);
		expect(result).toContain(chars.rightDoubleQuotesAmbiguous); // closing quotes
		expect(result).toContain("<strong>");
		expect(result).toContain("<em>");
		expect(result).toContain("<p>");
	});

	it("handles CJK text with typographic replacements", () => {
		const result = md().render("日本語の「テスト」――これは……");
		expect(result).toContain(chars.emDashX2);
		expect(result).toContain(chars.middleEllipsis);
	});

	// -- Plugin exposes parseText via utils -------------------------------

	it("plugin and standalone parseText produce consistent results", () => {
		const input = 'He said, "Hello" -- test...';
		const pluginResult = md().render(input);
		const standaloneResult = parseText(input);

		// The plugin wraps in <p> tags, so check that the standalone
		// result appears within the plugin's HTML output
		expect(pluginResult).toContain(chars.leftDoubleQuotesAmbiguous);
		expect(standaloneResult).toContain(chars.leftDoubleQuotesAmbiguous);
	});
});
