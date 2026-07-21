import type { PluginSimple } from "markdown-it";
import { parseText } from "./utils.js";

const smartypantsPlugin: PluginSimple = md => {
	// Disable build-in replacement rule.
	md.core.ruler.disable("replacements", true);

	// Cache original text render function.
	const defaultRender =
		md.renderer.rules.text || ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options));

	// Proxy text rendering: at this moment, each `token.content` has only plain text, and there is no HTML or markdown tag interference
	md.renderer.rules.text = function (tokens, index, options, env, self) {
		const token = tokens[index];
		let text = token.content;

		// Perform core parsing logic.
		// At this moment, `*"foo"*` has been stripped to plain `"foo"`.
		text = parseText(text);

		// Write the replaced text back and submit it to the default renderer for output.
		// It will automatically handle HTML escape, such as `&quot;` changes back to the normal character.
		token.content = text;
		return defaultRender(tokens, index, options, env, self);
	};
};

export default smartypantsPlugin;
