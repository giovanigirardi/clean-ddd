import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeQuestion } from "test/factories/make-question";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { DeleteQuestionUseCase } from "./delete-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: DeleteQuestionUseCase;

describe("Delete Question Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);
		sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to delete a question", async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueEntityId("author-1"),
		});

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({ questionId: newQuestion.id, attachmentId: new UniqueEntityId("attachment-1") }),
			makeQuestionAttachment({ questionId: newQuestion.id, attachmentId: new UniqueEntityId("attachment-2") }),
		);

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
		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0);
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
