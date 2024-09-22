import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { ListRecentQuestionsUseCase } from "./list-recent-questions";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: ListRecentQuestionsUseCase;

describe("List Recent Questions Use Case", () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		sut = new ListRecentQuestionsUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to list recent questions", async () => {
		const newQuestion1 = makeQuestion({
			createdAt: new Date(2022, 0, 20),
		});
		const newQuestion2 = makeQuestion({
			createdAt: new Date(2022, 0, 18),
		});
		const newQuestion3 = makeQuestion({
			createdAt: new Date(2022, 0, 23),
		});

		inMemoryQuestionsRepository.create(newQuestion1);
		inMemoryQuestionsRepository.create(newQuestion2);
		inMemoryQuestionsRepository.create(newQuestion3);

		const { questions } = await sut.execute({ page: 1 });

		expect(questions).toHaveLength(3);
		expect(questions).toEqual([newQuestion3, newQuestion1, newQuestion2]);
	});

	it("should be able to list paginated recent questions", async () => {
		for (let i = 0; i < 22; i++) {
			inMemoryQuestionsRepository.create(makeQuestion());
		}

		const { questions } = await sut.execute({ page: 2 });

		expect(questions).toHaveLength(2);
	});
});
