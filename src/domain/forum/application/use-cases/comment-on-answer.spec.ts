import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository copy";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

import type { AnswerComment } from "../../enterprise/entities/answer-comment";
import { CommentOnAnswerUseCase } from "./comment-on-answer";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: CommentOnAnswerUseCase;

describe("Comment on Answer Use Case", () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		sut = new CommentOnAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerCommentsRepository);
	});

	it("should be able to comment on answer", async () => {
		const answer = makeAnswer();

		await inMemoryAnswersRepository.create(answer);

		const result = await sut.execute({
			answerId: answer.id.toString(),
			authorId: "1",
			content: "Answer comment content",
		});

		expect(result.isRight()).toBeTruthy();
		expect((result.value as { answerComment: AnswerComment }).answerComment.content).toBe("Answer comment content");
		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1);
	});
});
