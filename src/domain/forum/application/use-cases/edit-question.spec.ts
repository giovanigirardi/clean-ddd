import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeQuestion } from "test/factories/make-question";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { EditQuestionUseCase } from "./edit-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);
		sut = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionAttachmentsRepository);
	});

	it("should be able to edit a question", async () => {
		const newQuestion = makeQuestion();

		inMemoryQuestionsRepository.create(newQuestion);

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({ questionId: newQuestion.id, attachmentId: new UniqueEntityId("attachment-1") }),
			makeQuestionAttachment({ questionId: newQuestion.id, attachmentId: new UniqueEntityId("attachment-2") }),
		);

		await sut.execute({
			questionId: newQuestion.id.toString(),
			authorId: newQuestion.authorId.toString(),
			title: "New title",
			content: "New content",
			attachmentsIds: ["attachment-1", "attachment-3"],
		});

		const editedQuestion = await inMemoryQuestionsRepository.findById(newQuestion.id.toString());

		expect(editedQuestion).toBeTruthy();
		expect(editedQuestion?.content).toBe("New content");
		expect(editedQuestion?.attachments.getItems()).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId("attachment-1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityId("attachment-3") }),
		]);
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
			attachmentsIds: [],
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
