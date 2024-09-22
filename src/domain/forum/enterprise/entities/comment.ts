import { Entity } from "@/core/entities/entity";

import type { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface CommentProps {
	authorId: UniqueEntityId;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
}

export abstract class Comment<T extends CommentProps> extends Entity<T> {
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
}
