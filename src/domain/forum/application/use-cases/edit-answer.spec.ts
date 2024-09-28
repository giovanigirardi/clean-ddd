import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/make-answer";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { EditAnswerUseCase } from "./edit-answer";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer Use Case", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
		sut = new EditAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerAttachmentsRepository);
	});

	it("should be able to edit a answer", async () => {
		const newAnswer = makeAnswer();

		inMemoryAnswersRepository.create(newAnswer);

		inMemoryAnswerAttachmentsRepository.items.push(
			makeAnswerAttachment({ answerId: newAnswer.id, attachmentId: new UniqueEntityId("attachment-1") }),
			makeAnswerAttachment({ answerId: newAnswer.id, attachmentId: new UniqueEntityId("attachment-2") }),
		);

		await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: newAnswer.authorId.toString(),
			content: "New content",
			attachmentsIds: ["attachment-1", "attachment-3"],
		});

		const editedAnswer = await inMemoryAnswersRepository.findById(newAnswer.id.toString());

		expect(editedAnswer).toBeTruthy();
		expect(editedAnswer?.content).toBe("New content");
		expect(editedAnswer?.attachments.getItems()).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId("attachment-1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityId("attachment-3") }),
		]);
	});

	it("should not be able to edit another user's answer", async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityId("author-1"),
		});

		inMemoryAnswersRepository.create(newAnswer);

		const answer = await inMemoryAnswersRepository.findById(newAnswer.id.toString());

		expect(answer).toBeTruthy();

		const result = await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: new UniqueEntityId("author-2").toString(),
			content: "New content",
			attachmentsIds: [],
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
