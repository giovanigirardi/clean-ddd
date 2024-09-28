import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";

import { CommentOnQuestionUseCase } from "./comment-on-question";

import type { QuestionComment } from "../../enterprise/entities/question-comment";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on Question Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);
		sut = new CommentOnQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionCommentsRepository);
	});

	it("should be able to comment on question", async () => {
		const question = makeQuestion();

		await inMemoryQuestionsRepository.create(question);

		const result = await sut.execute({
			questionId: question.id.toString(),
			authorId: "1",
			content: "Question comment content",
		});

		expect(result.isRight()).toBeTruthy();
		expect((result.value as { questionComment: QuestionComment }).questionComment.content).toBe(
			"Question comment content",
		);
		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1);
	});
});
