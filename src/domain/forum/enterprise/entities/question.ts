import dayjs from "dayjs";

import { AggregateRoot } from "@/core/entities/aggregate-root";

import { Slug } from "./value-objects/slug";

import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";
import { QuestionAttachmentList } from "./question-attachment-list";

export interface QuestionProps {
	authorId: UniqueEntityId;
	bestAnswerId?: UniqueEntityId;
	attachments: QuestionAttachmentList;
	title: string;
	content: string;
	slug: Slug;
	createdAt: Date;
	updatedAt?: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
	get title() {
		return this.props.title;
	}

	get content() {
		return this.props.content;
	}

	get authorId() {
		return this.props.authorId;
	}

	get slug() {
		return this.props.slug;
	}

	get bestAnswerId() {
		return this.props.bestAnswerId;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get isNew() {
		return dayjs().diff(this.props.createdAt, "day") <= 3;
	}

	get excerpt() {
		return this.props.content.substring(0, 120).trimEnd().concat("...");
	}

	get attachments() {
		return this.props.attachments;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	set title(value: string) {
		this.props.title = value;
		this.props.slug = Slug.createFromText(value);
		this.touch();
	}

	set content(value: string) {
		this.props.content = value;
		this.touch();
	}

	set bestAnswerId(value: UniqueEntityId | undefined) {
		this.props.bestAnswerId = value;
		this.touch();
	}

	set attachments(value: QuestionAttachmentList) {
		this.props.attachments = value;
		this.touch();
	}

	static create(props: Optional<QuestionProps, "createdAt" | "slug" | "attachments">, id?: UniqueEntityId) {
		const question = new Question(
			{
				...props,
				slug: props.slug ?? Slug.createFromText(props.title),
				createdAt: props.createdAt ?? new Date(),
				attachments: props.attachments ?? new QuestionAttachmentList(),
			},
			id,
		);

		return question;
	}
}
