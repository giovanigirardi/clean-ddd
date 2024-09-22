import { UniqueEntityId } from "@/core/entities/unique-entity-id";

import type { AnswersRepository } from "../repositories/answers-repository";
import type { QuestionsRepository } from "../repositories/questions-repository";

interface ChooseQuestionBestAnswerUseCaseRequest {
	answerId: string;
	authorId: string;
}

export class ChooseQuestionBestAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private questionsRepository: QuestionsRepository,
	) {}

	async execute({ answerId, authorId }: ChooseQuestionBestAnswerUseCaseRequest) {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			throw new Error("Answer not found");
		}

		const question = await this.questionsRepository.findById(answer.questionId.toString());

		if (!question) {
			throw new Error("Question not found");
		}

		if (authorId !== question.authorId.toString()) {
			throw new Error("Only the question author can choose the best answer");
		}

		question.bestAnswerId = new UniqueEntityId(answerId);

		return { question, answer };
	}
}
