import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = [];

	async findById(id: string) {
		const question = this.items.find((question) => question.id.toString() === id) ?? null;

		return question;
	}

	async findBySlug(slug: string) {
		const question = this.items.find((question) => question.slug.value === slug) ?? null;

		return question;
	}

	async create(question: Question) {
		this.items.push(question);

		return;
	}

	async delete(question: Question) {
		const index = this.items.findIndex((item) => item.id === question.id);

		if (index !== -1) {
			this.items.splice(index, 1);
		}

		return;
	}
}
