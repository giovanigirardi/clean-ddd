import { faker } from "@faker-js/faker";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question, type QuestionProps } from "@/domain/forum/enterprise/entities/question";

export function makeQuestion(override: Partial<QuestionProps> = {}, id?: UniqueEntityId) {
	const question = Question.create(
		{
			authorId: new UniqueEntityId(),
			content: faker.lorem.sentence(),
			title: faker.lorem.text(),
			...override,
		},
		id,
	);

	return question;
}
