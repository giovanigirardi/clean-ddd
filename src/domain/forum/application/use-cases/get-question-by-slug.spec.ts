import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";

import { Question } from "../../enterprise/entities/question";
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
		const newQuestion = Question.create({
			authorId: new UniqueEntityId("1"),
			content: "Question content",
			title: "Question title",
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
		const newQuestion = Question.create({
			authorId: new UniqueEntityId("1"),
			content: "Question content",
			title: "Question title",
			slug: Slug.createFromText("custom-slug"),
		});

		inMemoryQuestionsRepository.create(newQuestion);

		const { question } = await sut.execute({
			slug: "custom-slug",
		});

		expect(question.id).toBeTruthy();
		expect(question.title).toEqual("Question title");
		expect(question.content).toEqual("Question content");
	});
});
