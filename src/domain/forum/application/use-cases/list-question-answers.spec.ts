import { makeAnswer } from "test/factories/make-answer";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { ListQuestionAnswersUseCase } from "./list-question-answers";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: ListQuestionAnswersUseCase;

describe("List Recent Questions Use Case", () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		sut = new ListQuestionAnswersUseCase(inMemoryAnswersRepository);
	});

	it("should be able to list question answers", async () => {
		const newQuestion = makeQuestion({});
		const newAnswer1 = makeAnswer({ questionId: newQuestion.id });
		const newAnswer2 = makeAnswer({ questionId: newQuestion.id });
		const newAnswer3 = makeAnswer({ questionId: newQuestion.id });

		inMemoryQuestionsRepository.create(newQuestion);
		inMemoryAnswersRepository.create(newAnswer1);
		inMemoryAnswersRepository.create(newAnswer2);
		inMemoryAnswersRepository.create(newAnswer3);

		const result = await sut.execute({ questionId: newQuestion.id.toString(), page: 1 });

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.answers).toHaveLength(3);
	});

	it("should be able to list paginated question answers", async () => {
		const newQuestion = makeQuestion({});
		for (let i = 0; i < 22; i++) {
			inMemoryAnswersRepository.create(makeAnswer({ questionId: newQuestion.id }));
		}

		const result = await sut.execute({ questionId: newQuestion.id.toString(), page: 2 });

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.answers).toHaveLength(2);
	});
});
