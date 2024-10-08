import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import type { Question } from "../../enterprise/entities/question";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to get a question by its slug", async () => {
		const newQuestion = makeQuestion({
			title: "Question title",
			content: "Question content",
		});

		inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			slug: "question-title",
		});

		expect(result.isRight()).toBeTruthy();
		expect((result.value as { question: Question }).question.id).toBeTruthy();
		expect((result.value as { question: Question }).question.title).toEqual("Question title");
		expect((result.value as { question: Question }).question.content).toEqual("Question content");
	});

	it("should be able to get a question with a custom slug by its slug", async () => {
		const newQuestion = makeQuestion({
			slug: Slug.createFromText("custom-slug"),
		});

		inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			slug: "custom-slug",
		});

		expect(result.isRight()).toBeTruthy();
		expect((result.value as { question: Question }).question.id).toBeTruthy();
		expect((result.value as { question: Question }).question.title).toEqual(newQuestion.title);
		expect((result.value as { question: Question }).question.content).toEqual(newQuestion.content);
	});
});
