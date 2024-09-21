import { randomUUID } from "node:crypto";

import type { Slug } from "./value-objects/slug";

interface QuestionProps {
	title: string;
	content: string;
	authorId: string;
	slug: Slug;
	id?: string;
}

export class Question {
	public id: string;
	public title: string;
	public content: string;
	public slug: Slug;
	public authorId: string;

	constructor(props: QuestionProps, id?: string) {
		this.title = props.title;
		this.content = props.content;
		this.authorId = props.authorId;
		this.slug = props.slug;
		this.id = id ?? randomUUID();
	}
}
