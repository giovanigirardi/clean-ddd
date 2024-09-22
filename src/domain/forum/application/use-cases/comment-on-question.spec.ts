import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on Question Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		sut = new CommentOnQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionCommentsRepository);
	});

	it("should be able to comment on question", async () => {
		const question = makeQuestion();

		await inMemoryQuestionsRepository.create(question);

		const { questionComment } = await sut.execute({
			questionId: question.id.toString(),
			authorId: "1",
			content: "Question comment content",
		});

		expect(questionComment.content).toBe("Question comment content");
		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1);
	});
});
