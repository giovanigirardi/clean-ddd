import { faker } from "@faker-js/faker";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionComment, type QuestionCommentProps } from "@/domain/forum/enterprise/entities/question-comment";

export function makeQuestionComment(override: Partial<QuestionCommentProps> = {}, id?: UniqueEntityId) {
	const questionComment = QuestionComment.create(
		{
			questionId: new UniqueEntityId(),
			authorId: new UniqueEntityId(),
			content: faker.lorem.sentence(),
			...override,
		},
		id,
	);

	return questionComment;
}
