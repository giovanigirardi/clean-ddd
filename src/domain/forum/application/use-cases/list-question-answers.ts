import type { AnswersRepository } from "../repositories/answers-repository";

interface ListQuestionAnswersUseCaseRequest {
	questionId: string;
	page: number;
}

export class ListQuestionAnswersUseCase {
	constructor(private questionsRepository: AnswersRepository) {}

	async execute({ questionId, page }: ListQuestionAnswersUseCaseRequest) {
		const answers = await this.questionsRepository.findManyByQuestionId(questionId, { page });

		return { answers };
	}
}
