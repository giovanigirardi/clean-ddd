import { type Either, right } from "@/core/either";
import type { AnswerComment } from "../../enterprise/entities/answer-comment";
import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository";

interface ListAnswerCommentsUseCaseRequest {
	answerId: string;
	page: number;
}

type ListAnswerCommentsUseCaseResponse = Either<null, { answerComments: AnswerComment[] }>;

export class ListAnswerCommentsUseCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({ answerId, page }: ListAnswerCommentsUseCaseRequest): Promise<ListAnswerCommentsUseCaseResponse> {
		const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, { page });

		return right({ answerComments });
	}
}
