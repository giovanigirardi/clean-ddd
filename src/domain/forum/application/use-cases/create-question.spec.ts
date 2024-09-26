import { CreateQuestionUseCase } from "./create-question";

import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe("Create Question Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to create a question", async () => {
		const result = await sut.execute({
			authorId: "1",
			title: "Question title",
			content: "Question content",
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.question.id).toBeTruthy();
		expect(result.value?.question.title).toEqual("Question title");
		expect(result.value?.question.content).toEqual("Question content");
		expect(inMemoryQuestionsRepository.items.length).toEqual(1);
	});
});
