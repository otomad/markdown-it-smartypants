import { defineConfig } from "oxfmt";

export default defineConfig({
	printWidth: 120,
	tabWidth: 4,
	useTabs: true,
	semi: true,
	singleQuote: false,
	arrowParens: "avoid",
	overrides: [
		{
			files: ["utils.*"],
			options: {
				printWidth: 150,
			},
		},
	],
});
