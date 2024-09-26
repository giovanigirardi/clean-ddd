import { type Either, right } from "@/core/either";
import type { QuestionComment } from "../../enterprise/entities/question-comment";
import type { QuestionCommentsRepository } from "../repositories/question-comments-repository";

interface ListQuestionCommentsUseCaseRequest {
	questionId: string;
	page: number;
}

type ListQuestionCommentsUseCaseResponse = Either<null, { questionComments: QuestionComment[] }>;

export class ListQuestionCommentsUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({
		questionId,
		page,
	}: ListQuestionCommentsUseCaseRequest): Promise<ListQuestionCommentsUseCaseResponse> {
		const questionComments = await this.questionCommentsRepository.findManyByQuestionId(questionId, { page });

		return right({ questionComments });
	}
}
