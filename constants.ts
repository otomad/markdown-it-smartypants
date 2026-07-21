export const chars = {
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
	leftDoubleQuotesSibe: "“\ufe02",
	rightDoubleQuotesSibe: "”\ufe02",
	leftSingleQuotesSibe: "‘\ufe02",
	rightSingleQuotesSibe: "’\ufe02",
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

export const regexes = {
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
