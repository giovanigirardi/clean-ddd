import type { QuestionCommentsRepository } from "../repositories/question-comments-repository";

interface ListQuestionCommentsUseCaseRequest {
	questionId: string;
	page: number;
}

export class ListQuestionCommentsUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({ questionId, page }: ListQuestionCommentsUseCaseRequest) {
		const questionComments = await this.questionCommentsRepository.findManyByQuestionId(questionId, { page });

		return { questionComments };
	}
}
