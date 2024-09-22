import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to get a question by its slug", async () => {
		const newQuestion = makeQuestion({
			title: "Question title",
			content: "Question content",
		});

		inMemoryQuestionsRepository.create(newQuestion);

		const { question } = await sut.execute({
			slug: "question-title",
		});

		expect(question.id).toBeTruthy();
		expect(question.title).toEqual("Question title");
		expect(question.content).toEqual("Question content");
	});

	it("should be able to get a question with a custom slug by its slug", async () => {
		const newQuestion = makeQuestion({
			slug: Slug.createFromText("custom-slug"),
		});

		inMemoryQuestionsRepository.create(newQuestion);

		const { question } = await sut.execute({
			slug: "custom-slug",
		});

		expect(question.id).toBeTruthy();
		expect(question.title).toEqual(newQuestion.title);
		expect(question.content).toEqual(newQuestion.content);
	});
});
