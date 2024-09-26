import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { DeleteQuestionUseCase } from "./delete-question";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: DeleteQuestionUseCase;

describe("Delete Question Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to delete a question", async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueEntityId("author-1"),
		});

		inMemoryQuestionsRepository.create(newQuestion);

		const question = await inMemoryQuestionsRepository.findById(newQuestion.id.toString());

		expect(question).toBeTruthy();

		await sut.execute({
			questionId: newQuestion.id.toString(),
			authorId: newQuestion.authorId.toString(),
		});

		const deletedQuestion = await inMemoryQuestionsRepository.findById(newQuestion.id.toString());

		expect(deletedQuestion).toBeNull();
		expect(inMemoryQuestionsRepository.items).toHaveLength(0);
	});

	it("should not be able to delete another user's question", async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueEntityId("author-1"),
		});

		inMemoryQuestionsRepository.create(newQuestion);

		const question = await inMemoryQuestionsRepository.findById(newQuestion.id.toString());

		expect(question).toBeTruthy();

		const result = await sut.execute({
			questionId: newQuestion.id.toString(),
			authorId: new UniqueEntityId("author-2").toString(),
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(inMemoryQuestionsRepository.items).toHaveLength(1);
	});
});
