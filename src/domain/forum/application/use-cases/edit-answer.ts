import type { AnswersRepository } from "../repositories/answers-repository";

interface EditAnswerUseCaseRequest {
	answerId: string;
	authorId: string;
	content: string;
}

export class EditAnswerUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({ answerId, authorId, content }: EditAnswerUseCaseRequest) {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			throw new Error("Answer not found");
		}

		if (authorId !== answer.authorId.toString()) {
			throw new Error("Only the author can edit the answer");
		}

		answer.content = content;

		await this.answersRepository.save(answer);

		return { answer };
	}
}
