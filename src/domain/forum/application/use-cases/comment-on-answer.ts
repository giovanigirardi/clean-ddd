import { UniqueEntityId } from "@/core/entities/unique-entity-id";

import { AnswerComment } from "../../enterprise/entities/answer-comment";

import { type Either, left, right } from "@/core/either";
import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import type { AnswersRepository } from "../repositories/answers-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found";

interface CommentOnAnswerUseCaseRequest {
	authorId: string;
	content: string;
	answerId: string;
}

type CommentOnAnswerUseCaseResponse = Either<ResourceNotFoundError, { answerComment: AnswerComment }>;

export class CommentOnAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private answerCommentsRepository: AnswerCommentsRepository,
	) {}

	async execute({
		authorId,
		content,
		answerId,
	}: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		const answerComment = AnswerComment.create({
			authorId: new UniqueEntityId(authorId),
			answerId: new UniqueEntityId(answerId),
			content: content,
		});

		await this.answerCommentsRepository.create(answerComment);

		return right({ answerComment });
	}
}
