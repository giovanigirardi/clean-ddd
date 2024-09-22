import { UniqueEntityId } from "@/core/entities/unique-entity-id";

import { makeAnswer } from "test/factories/make-answer";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository copy";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete Answer Comment Use Case", () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
	});

	it("should be able to delete a answer's comment", async () => {
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

	it("should be not be able to delete the comment of another author on a answer", async () => {
		const answer = makeAnswer();
		const answerComment = makeAnswerComment({ answerId: answer.id, authorId: new UniqueEntityId("author-1") });

		await inMemoryAnswersRepository.create(answer);
		await inMemoryAnswerCommentsRepository.create(answerComment);

		expect(async () => {
			await sut.execute({
				answerCommentId: answerComment.id.toString(),
				authorId: "author-2",
			});
		}).rejects.toBeInstanceOf(Error);
		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1);
	});
});
