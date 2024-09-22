import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { AnswerQuestionUseCase } from "./answer-question";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Answer Question Use Case", () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
	});

	it("should be able to answer a question", async () => {
		const { answer } = await sut.execute({
			instructorId: "1",
			questionId: "1",
			content: "Question content",
		});

		expect(answer.id).toBeTruthy();
		expect(answer.content).toEqual("Question content");
		expect(inMemoryAnswersRepository.items.length).toEqual(1);
	});
});
