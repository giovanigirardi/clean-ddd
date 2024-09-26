import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { EditQuestionUseCase } from "./edit-question";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to edit a question", async () => {
		const newQuestion = makeQuestion();

		inMemoryQuestionsRepository.create(newQuestion);

		await sut.execute({
			questionId: newQuestion.id.toString(),
			authorId: newQuestion.authorId.toString(),
			content: "New content",
			title: "New title",
		});

		const editedQuestion = await inMemoryQuestionsRepository.findById(newQuestion.id.toString());

		expect(editedQuestion).toBeTruthy();
		expect(editedQuestion?.content).toBe("New content");
		expect(editedQuestion?.title).toBe("New title");
	});

	it("should not be able to edit another user's question", async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueEntityId("author-1"),
		});

		inMemoryQuestionsRepository.create(newQuestion);

		const question = await inMemoryQuestionsRepository.findById(newQuestion.id.toString());

		expect(question).toBeTruthy();

		const result = await sut.execute({
			questionId: newQuestion.id.toString(),
			authorId: new UniqueEntityId("author-2").toString(),
			content: "New content",
			title: "New title",
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
