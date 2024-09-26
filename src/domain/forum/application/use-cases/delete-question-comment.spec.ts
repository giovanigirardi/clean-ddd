import { UniqueEntityId } from "@/core/entities/unique-entity-id";

import { makeQuestion } from "test/factories/make-question";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";

import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comment Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
	});

	it("should be able to delete a question's comment", async () => {
		const question = makeQuestion();
		const questionComment = makeQuestionComment({ questionId: question.id, authorId: new UniqueEntityId("author-1") });

		await inMemoryQuestionsRepository.create(question);
		await inMemoryQuestionCommentsRepository.create(questionComment);

		await sut.execute({
			questionCommentId: questionComment.id.toString(),
			authorId: questionComment.authorId.toString(),
		});

		const deletedQuestionComment = await inMemoryQuestionCommentsRepository.findById(question.id.toString());

		expect(deletedQuestionComment).toBeNull();
		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
	});

	it("should be not be able to delete the comment of another author on a question", async () => {
		const question = makeQuestion();
		const questionComment = makeQuestionComment({ questionId: question.id, authorId: new UniqueEntityId("author-1") });

		await inMemoryQuestionsRepository.create(question);
		await inMemoryQuestionCommentsRepository.create(questionComment);

		const result = await sut.execute({
			questionCommentId: questionComment.id.toString(),
			authorId: "author-2",
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1);
	});
});
