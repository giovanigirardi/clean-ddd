import { faker } from "@faker-js/faker";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerComment, type AnswerCommentProps } from "@/domain/forum/enterprise/entities/answer-comment";

export function makeAnswerComment(override: Partial<AnswerCommentProps> = {}, id?: UniqueEntityId) {
	const answerComment = AnswerComment.create(
		{
			answerId: new UniqueEntityId(),
			authorId: new UniqueEntityId(),
			content: faker.lorem.sentence(),
			...override,
		},
		id,
	);

	return answerComment;
}
