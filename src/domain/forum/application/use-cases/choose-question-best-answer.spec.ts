import { makeAnswer } from "test/factories/make-answer";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Choose Question Best Answer Use Case", () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		sut = new ChooseQuestionBestAnswerUseCase(inMemoryAnswersRepository, inMemoryQuestionsRepository);
	});

	it("should be able to choose the question's best answer", async () => {
		const newQuestion = makeQuestion();
		const newAnswer = makeAnswer({
			questionId: newQuestion.id,
		});

		inMemoryQuestionsRepository.create(newQuestion);
		inMemoryAnswersRepository.create(newAnswer);

		await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: newQuestion.authorId.toString(),
		});

		const editedQuestion = await inMemoryQuestionsRepository.findById(newQuestion.id.toString());

		expect(editedQuestion).toBeTruthy();
		expect(editedQuestion?.bestAnswerId?.toString()).toBe(newAnswer.id.toString());
	});

	it("should not be able to choose the best answer for another user's question", async () => {
		const newQuestion = makeQuestion();
		const newAnswer = makeAnswer({
			questionId: newQuestion.id,
		});

		inMemoryQuestionsRepository.create(newQuestion);
		inMemoryAnswersRepository.create(newAnswer);

		expect(() => {
			return sut.execute({
				answerId: newAnswer.id.toString(),
				authorId: "another-author-id",
			});
		}).rejects.toBeInstanceOf(Error);

		const editedQuestion = await inMemoryQuestionsRepository.findById(newQuestion.id.toString());

		expect(editedQuestion).toBeTruthy();
		expect(editedQuestion?.bestAnswerId).toBeUndefined();
	});
});
