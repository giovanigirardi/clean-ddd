import { Entity } from "../../core/entities/entity";

import type { UniqueEntityId } from "../../core/entities/unique-entity-id";
import type { Slug } from "./value-objects/slug";

interface QuestionProps {
	authorId: UniqueEntityId;
	bestAnswerId?: UniqueEntityId;
	title: string;
	content: string;
	slug: Slug;
	createdAt: Date;
	updatedAt?: Date;
}

export class Question extends Entity<QuestionProps> {}
