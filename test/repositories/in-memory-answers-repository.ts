import { DomainEvents } from "@/core/events/domain-events";
import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {
	public items: Answer[] = [];

	constructor(private answerAttachmentsRepository: AnswerAttachmentsRepository) {}

	async findById(id: string) {
		const answer = this.items.find((answer) => answer.id.toString() === id) ?? null;

		return answer;
	}

	async findManyByQuestionId(questionId: string, params: PaginationParams) {
		const answers = this.items
			.filter((answer) => answer.questionId.toString() === questionId)
			.slice((params.page - 1) * 20, params.page * 20);

		return answers;
	}

	async create(answer: Answer) {
		this.items.push(answer);

		DomainEvents.dispatchEventsForAggregate(answer.id);
	}

	async save(answer: Answer) {
		const index = this.items.findIndex((item) => item.id === answer.id);

		if (index !== -1) {
			this.items[index] = answer;
		}

		DomainEvents.dispatchEventsForAggregate(answer.id);

		return;
	}

	async delete(answer: Answer) {
		const index = this.items.findIndex((item) => item.id === answer.id);

		if (index !== -1) {
			this.items.splice(index, 1);
		}

		await this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());

		return;
	}
}
