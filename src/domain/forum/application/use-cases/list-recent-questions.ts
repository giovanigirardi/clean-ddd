import type { QuestionsRepository } from "../repositories/questions-repository";

interface ListRecentQuestionsUseCaseRequest {
	page: number;
}

export class ListRecentQuestionsUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({ page }: ListRecentQuestionsUseCaseRequest) {
		const questions = await this.questionsRepository.findManyRecent({ page });

		return { questions };
	}
}
