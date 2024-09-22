import type { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import type { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
	public items: QuestionComment[] = [];

	async findById(id: string): Promise<QuestionComment | null> {
		const questionComment = this.items.find((questionComment) => questionComment.id.toString() === id) ?? null;

		return questionComment;
	}

	async create(questionComment: QuestionComment) {
		this.items.push(questionComment);

		return;
	}

	async delete(questionComment: QuestionComment): Promise<void> {
		const index = this.items.findIndex((item) => item.id === questionComment.id);

		if (index !== -1) {
			this.items.splice(index, 1);
		}

		return;
	}
}
