import { Entity } from "@/core/entities/entity";

import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export interface AnswerCommentProps {
	authorId: UniqueEntityId;
	answerId: UniqueEntityId;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
}

export class AnswerComment extends Entity<AnswerCommentProps> {
	get content(): string {
		return this.props.content;
	}

	get authorId() {
		return this.props.authorId;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	set content(value: string) {
		this.props.content = value;
		this.touch();
	}

	static create(props: Optional<AnswerCommentProps, "createdAt">, id?: UniqueEntityId) {
		const answerComment = new AnswerComment(
			{
				...props,
				createdAt: new Date(),
			},
			id,
		);

		return answerComment;
	}
}
