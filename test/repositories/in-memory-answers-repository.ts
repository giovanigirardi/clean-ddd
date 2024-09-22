import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {
	public items: Answer[] = [];

	async findById(id: string) {
		const answer = this.items.find((answer) => answer.id.toString() === id) ?? null;

		return answer;
	}

	async create(answer: Answer) {
		this.items.push(answer);
	}

	async delete(answer: Answer) {
		const index = this.items.findIndex((item) => item.id === answer.id);

		if (index !== -1) {
			this.items.splice(index, 1);
		}

		return;
	}
}
