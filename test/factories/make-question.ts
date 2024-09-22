import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question, type QuestionProps } from "@/domain/forum/enterprise/entities/question";

export function makeQuestion(override: Partial<QuestionProps> = {}) {
	const question = Question.create({
		authorId: new UniqueEntityId(),
		content: "Content",
		title: "Title",
		...override,
	});

	return question;
}
