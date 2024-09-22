import type { AnswersRepository } from "../repositories/answers-repository";

interface DeleteAnswerUseCaseRequest {
	answerId: string;
	authorId: string;
}

export class DeleteAnswerUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({ answerId, authorId }: DeleteAnswerUseCaseRequest) {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			throw new Error("Answer not found");
		}

		if (authorId !== answer.authorId.toString()) {
			throw new Error("Only the author can delete the answer");
		}

		await this.answersRepository.delete(answer);

		return {};
	}
}
