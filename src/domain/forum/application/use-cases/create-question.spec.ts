import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { CreateQuestionUseCase } from "./create-question";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: CreateQuestionUseCase;

describe("Create Question Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);
		sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to create a question", async () => {
		const result = await sut.execute({
			authorId: "1",
			title: "Question title",
			content: "Question content",
			attachmentIds: ["1", "2"],
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.question.id).toBeTruthy();
		expect(result.value?.question.title).toEqual("Question title");
		expect(result.value?.question.content).toEqual("Question content");
		expect(result.value?.question.attachments.getItems()).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
		]);
		expect(inMemoryQuestionsRepository.items.length).toEqual(1);
	});

	it("should be able to create a question without attachments", async () => {
		const result = await sut.execute({
			authorId: "1",
			title: "Question title",
			content: "Question content",
			attachmentIds: [],
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.question.id).toBeTruthy();
		expect(result.value?.question.title).toEqual("Question title");
		expect(result.value?.question.content).toEqual("Question content");
		expect(result.value?.question.attachments.getItems().length).toEqual(0);
		expect(inMemoryQuestionsRepository.items.length).toEqual(1);
	});
});
