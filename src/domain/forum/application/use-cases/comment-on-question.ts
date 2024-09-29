import { UniqueEntityId } from "@/core/entities/unique-entity-id";

import { QuestionComment } from "../../enterprise/entities/question-comment";

import { type Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import type { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import type { QuestionsRepository } from "../repositories/questions-repository";

interface CommentOnQuestionUseCaseRequest {
	authorId: string;
	content: string;
	questionId: string;
}

type CommentOnQuestionUseCaseResponse = Either<ResourceNotFoundError, { questionComment: QuestionComment }>;

export class CommentOnQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionCommentsRepository: QuestionCommentsRepository,
	) {}

	async execute({
		authorId,
		content,
		questionId,
	}: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		const questionComment = QuestionComment.create({
			authorId: new UniqueEntityId(authorId),
			questionId: new UniqueEntityId(questionId),
			content: content,
		});

		await this.questionCommentsRepository.create(questionComment);

		return right({ questionComment });
	}
}
