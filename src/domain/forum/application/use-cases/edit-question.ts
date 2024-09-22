import type { QuestionsRepository } from "../repositories/questions-repository";

interface EditQuestionUseCaseRequest {
	questionId: string;
	authorId: string;
	title: string;
	content: string;
}

export class EditQuestionUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({ questionId, authorId, content, title }: EditQuestionUseCaseRequest) {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			throw new Error("Question not found");
		}

		if (authorId !== question.authorId.toString()) {
			throw new Error("Only the author can edit the question");
		}

		question.title = title;
		question.content = content;

		await this.questionsRepository.save(question);

		return {};
	}
}
