import { UniqueEntityId } from "@/core/entities/unique-entity-id";

import { Question } from "../../enterprise/entities/question";

import type { QuestionsRepository } from "../repositories/questions-repository";

interface CreateQuestionUseCaseRequest {
	authorId: string;
	title: string;
	content: string;
}

export class CreateQuestionUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({ authorId, content, title }: CreateQuestionUseCaseRequest) {
		const question = Question.create({
			authorId: new UniqueEntityId(authorId),
			content: content,
			title: title,
		});

		await this.questionsRepository.create(question);

		return { question };
	}
}
