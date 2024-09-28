import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

import { makeAnswerAttachment } from "test/factories/make-answer-attachment";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { DeleteAnswerUseCase } from "./delete-answer";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer Use Case", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
		sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
	});

	it("should be able to delete an answer", async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityId("author-1"),
		});

		inMemoryAnswerAttachmentsRepository.items.push(
			makeAnswerAttachment({ answerId: newAnswer.id, attachmentId: new UniqueEntityId("attachment-1") }),
			makeAnswerAttachment({ answerId: newAnswer.id, attachmentId: new UniqueEntityId("attachment-2") }),
		);

		inMemoryAnswersRepository.create(newAnswer);

		const answer = await inMemoryAnswersRepository.findById(newAnswer.id.toString());

		expect(answer).toBeTruthy();

		await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: newAnswer.authorId.toString(),
		});

		const deletedAnswer = await inMemoryAnswersRepository.findById(newAnswer.id.toString());

		expect(deletedAnswer).toBeNull();
		expect(inMemoryAnswersRepository.items).toHaveLength(0);
		expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0);
	});

	it("should not be able to delete another user's answer", async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityId("author-1"),
		});

		inMemoryAnswersRepository.create(newAnswer);

		const answer = await inMemoryAnswersRepository.findById(newAnswer.id.toString());

		expect(answer).toBeTruthy();

		const result = await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: new UniqueEntityId("author-2").toString(),
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(inMemoryAnswersRepository.items).toHaveLength(1);
	});
});
