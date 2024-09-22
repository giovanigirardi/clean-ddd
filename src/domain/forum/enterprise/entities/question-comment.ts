import { Entity } from "@/core/entities/entity";

import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export interface QuestionCommentProps {
	authorId: UniqueEntityId;
	questionId: UniqueEntityId;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
}

export class QuestionComment extends Entity<QuestionCommentProps> {
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

	static create(props: Optional<QuestionCommentProps, "createdAt">, id?: UniqueEntityId) {
		const questionComment = new QuestionComment(
			{
				...props,
				createdAt: new Date(),
			},
			id,
		);

		return questionComment;
	}
}
