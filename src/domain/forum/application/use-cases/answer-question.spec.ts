import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { AnswerQuestionUseCase } from "./answer-question";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: AnswerQuestionUseCase;

describe("Answer Question Use Case", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
		sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
	});

	it("should be able to answer a question", async () => {
		const result = await sut.execute({
			instructorId: "1",
			questionId: "1",
			content: "Question content",
			attachmentIds: ["1", "2"],
		});

		expect(result.isRight).toBeTruthy();
		expect(result.value?.answer.id).toBeTruthy();
		expect(result.value?.answer.content).toEqual("Question content");
		expect(result.value?.answer.attachments.getItems()).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
		]);
		expect(inMemoryAnswersRepository.items.length).toEqual(1);
	});
});
