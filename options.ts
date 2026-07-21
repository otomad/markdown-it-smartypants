const optionNames = [
	"3Hyphen-EmDash",
	"2Hyphen-EnDash",
	"3EmDashes-3EmDash",
	"2EmDashes-2EmDash",
	"2HorizBar-2EmDash",
	"2BoxDrawHoriz-2EmDash",
	"2BoxDrawHoriz-2EmDash",
	"Periods-BottomEllipsis",
	"Periods-MiddleEllipsis",
	"Bottom-MiddleEllipsis",
	"CjkPeriods-MiddleEllipsis",
	"2LessGreaterThan-DoubleAngleQuote",
	"Straight-CurlyQuote",
	"Halfwidth-FullwidthCurlyQuote",
] as const;

export type Options = Partial<Record<(typeof optionNames)[number], boolean>>;

export const defaultOptions = Object.freeze(
	Object.fromEntries(optionNames.map(optionName => [optionName, true])),
) as Readonly<Record<keyof Options, true>>;
