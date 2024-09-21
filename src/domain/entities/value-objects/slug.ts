import { kebabCase } from "lodash-es";

export class Slug {
	public value: string;

	constructor(value: string) {
		this.value = value;
	}

	/**
	 * Receives a text and creates a slug from it.
	 *
	 * Example: "An example text" -> "an-example-text"
	 *
	 * @param text {string} The text to be converted to a slug.
	 */
	static createFromText(text: string) {
		const slugText = kebabCase(text);

		return new Slug(slugText);
	}
}
