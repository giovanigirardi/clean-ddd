import { makeAnswer } from "test/factories/make-answer";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository copy";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

import { ListAnswerCommentsUseCase } from "./list-answer-comments";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: ListAnswerCommentsUseCase;

describe("List Answer Comments Use Case", () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		sut = new ListAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
	});

	it("should be able to list answer comments", async () => {
		const newAnswer = makeAnswer({});
		const newComment1 = makeAnswerComment({ answerId: newAnswer.id });
		const newComment2 = makeAnswerComment({ answerId: newAnswer.id });
		const newComment3 = makeAnswerComment({ answerId: newAnswer.id });

		inMemoryAnswersRepository.create(newAnswer);
		inMemoryAnswerCommentsRepository.create(newComment1);
		inMemoryAnswerCommentsRepository.create(newComment2);
		inMemoryAnswerCommentsRepository.create(newComment3);

		const result = await sut.execute({ answerId: newAnswer.id.toString(), page: 1 });

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.answerComments).toHaveLength(3);
	});

	it("should be able to list paginated answer comments", async () => {
		const newAnswer = makeAnswer({});
		for (let i = 0; i < 22; i++) {
			inMemoryAnswerCommentsRepository.create(makeAnswerComment({ answerId: newAnswer.id }));
		}

		const result = await sut.execute({ answerId: newAnswer.id.toString(), page: 2 });

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.answerComments).toHaveLength(2);
	});
});
