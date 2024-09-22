import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository";

interface ListAnswerCommentsUseCaseRequest {
	answerId: string;
	page: number;
}

export class ListAnswerCommentsUseCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({ answerId, page }: ListAnswerCommentsUseCaseRequest) {
		const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, { page });

		return { answerComments };
	}
}
