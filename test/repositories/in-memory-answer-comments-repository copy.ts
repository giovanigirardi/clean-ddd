import type { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
	public items: AnswerComment[] = [];

	async findById(id: string): Promise<AnswerComment | null> {
		const answerComment = this.items.find((answerComment) => answerComment.id.toString() === id) ?? null;

		return answerComment;
	}

	async create(answerComment: AnswerComment) {
		this.items.push(answerComment);

		return;
	}

	async delete(answerComment: AnswerComment): Promise<void> {
		const index = this.items.findIndex((item) => item.id === answerComment.id);

		if (index !== -1) {
			this.items.splice(index, 1);
		}

		return;
	}
}
