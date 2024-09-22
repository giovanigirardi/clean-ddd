import { makeQuestion } from "test/factories/make-question";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";

import { ListQuestionCommentsUseCase } from "./list-question-comments";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: ListQuestionCommentsUseCase;

describe("List Question Comments Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		sut = new ListQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
	});

	it("should be able to list question comments", async () => {
		const newQuestion = makeQuestion({});
		const newComment1 = makeQuestionComment({ questionId: newQuestion.id });
		const newComment2 = makeQuestionComment({ questionId: newQuestion.id });
		const newComment3 = makeQuestionComment({ questionId: newQuestion.id });

		inMemoryQuestionsRepository.create(newQuestion);
		inMemoryQuestionCommentsRepository.create(newComment1);
		inMemoryQuestionCommentsRepository.create(newComment2);
		inMemoryQuestionCommentsRepository.create(newComment3);

		const { questionComments } = await sut.execute({ questionId: newQuestion.id.toString(), page: 1 });

		expect(questionComments).toHaveLength(3);
	});

	it("should be able to list paginated question comments", async () => {
		const newQuestion = makeQuestion({});
		for (let i = 0; i < 22; i++) {
			inMemoryQuestionCommentsRepository.create(makeQuestionComment({ questionId: newQuestion.id }));
		}

		const { questionComments } = await sut.execute({ questionId: newQuestion.id.toString(), page: 2 });

		expect(questionComments).toHaveLength(2);
	});
});
