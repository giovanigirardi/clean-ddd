import { UniqueEntityId } from "@/core/entities/unique-entity-id";

import { AnswerComment } from "../../enterprise/entities/answer-comment";

import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import type { AnswersRepository } from "../repositories/answers-repository";

interface CommentOnAnswerUseCaseRequest {
	authorId: string;
	content: string;
	answerId: string;
}

export class CommentOnAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private answerCommentsRepository: AnswerCommentsRepository,
	) {}

	async execute({ authorId, content, answerId }: CommentOnAnswerUseCaseRequest) {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			throw new Error("Answer not found");
		}

		const answerComment = AnswerComment.create({
			authorId: new UniqueEntityId(authorId),
			answerId: new UniqueEntityId(answerId),
			content: content,
		});

		await this.answerCommentsRepository.create(answerComment);

		return { answerComment };
	}
}
