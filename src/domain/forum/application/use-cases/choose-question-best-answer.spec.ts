import { makeAnswer } from "test/factories/make-answer";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";

import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Choose Question Best Answer Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
		sut = new ChooseQuestionBestAnswerUseCase(inMemoryAnswersRepository, inMemoryQuestionsRepository);
	});

	it("should be able to choose the question's best answer", async () => {
		const newQuestion = makeQuestion();
		const newAnswer = makeAnswer({
			questionId: newQuestion.id,
		});

		inMemoryQuestionsRepository.create(newQuestion);
		inMemoryAnswersRepository.create(newAnswer);

		const result = await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: newQuestion.authorId.toString(),
		});

		const editedQuestion = await inMemoryQuestionsRepository.findById(newQuestion.id.toString());

		expect(result.isRight()).toBeTruthy();
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

		const result = await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: "another-author-id",
		});

		const editedQuestion = await inMemoryQuestionsRepository.findById(newQuestion.id.toString());

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(editedQuestion).toBeTruthy();
		expect(editedQuestion?.bestAnswerId).toBeUndefined();
	});
});
