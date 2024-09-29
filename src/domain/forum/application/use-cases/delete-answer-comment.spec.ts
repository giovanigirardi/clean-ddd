import { UniqueEntityId } from "@/core/entities/unique-entity-id";

import { makeAnswer } from "test/factories/make-answer";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete Answer Comment Use Case", () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
		sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
	});

	it("should be able to delete an answer's comment", async () => {
		const answer = makeAnswer();
		const answerComment = makeAnswerComment({ answerId: answer.id, authorId: new UniqueEntityId("author-1") });

		await inMemoryAnswersRepository.create(answer);
		await inMemoryAnswerCommentsRepository.create(answerComment);

		await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: answerComment.authorId.toString(),
		});

		const deletedAnswerComment = await inMemoryAnswerCommentsRepository.findById(answer.id.toString());

		expect(deletedAnswerComment).toBeNull();
		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
	});

	it("should be not be able to delete the comment of another author on an answer", async () => {
		const answer = makeAnswer();
		const answerComment = makeAnswerComment({ answerId: answer.id, authorId: new UniqueEntityId("author-1") });

		await inMemoryAnswersRepository.create(answer);
		await inMemoryAnswerCommentsRepository.create(answerComment);

		const result = await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: "author-2",
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1);
	});
});
