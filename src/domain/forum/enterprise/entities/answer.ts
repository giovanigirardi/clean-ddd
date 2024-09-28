import { AggregateRoot } from "@/core/entities/aggregate-root";
import { AnswerAttachmentList } from "./answer-attachment-list";

import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export interface AnswerProps {
	authorId: UniqueEntityId;
	questionId: UniqueEntityId;
	attachments: AnswerAttachmentList;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
}

export class Answer extends AggregateRoot<AnswerProps> {
	get content(): string {
		return this.props.content;
	}

	get authorId() {
		return this.props.authorId;
	}

	get questionId() {
		return this.props.questionId;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
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

	set content(value: string) {
		this.props.content = value;
		this.touch();
	}

	set attachments(value: AnswerAttachmentList) {
		this.props.attachments = value;
		this.touch();
	}

	static create(props: Optional<AnswerProps, "createdAt" | "attachments">, id?: UniqueEntityId) {
		const answer = new Answer(
			{
				...props,
				createdAt: new Date(),
				attachments: props.attachments ?? new AnswerAttachmentList(),
			},
			id,
		);

		return answer;
	}
}
