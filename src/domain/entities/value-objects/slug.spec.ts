import { expect, test } from "vitest";

import { Slug } from "./slug";

test("it should be able to create a new slug from text", () => {
	const text = " An exámple text-";
	const expectedSlug = "an-example-text";

	const slug = Slug.createFromText(text);

	expect(slug.value).toBe(expectedSlug);
});
