import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = [];

	constructor(private questionAttachmentsRepository: QuestionAttachmentsRepository) {}

	async findById(id: string) {
		const question = this.items.find((question) => question.id.toString() === id) ?? null;

		return question;
	}

	async findBySlug(slug: string) {
		const question = this.items.find((question) => question.slug.value === slug) ?? null;

		return question;
	}

	async findManyRecent({ page }: PaginationParams) {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);

		return questions;
	}

	async create(question: Question) {
		this.items.push(question);

		return;
	}

	async save(question: Question) {
		const index = this.items.findIndex((item) => item.id === question.id);

		if (index !== -1) {
			this.items[index] = question;
		}

		return;
	}

	async delete(question: Question) {
		const index = this.items.findIndex((item) => item.id === question.id);

		if (index !== -1) {
			this.items.splice(index, 1);
		}

		await this.questionAttachmentsRepository.deleteManyByQuestionId(question.id.toString());

		return;
	}
}
