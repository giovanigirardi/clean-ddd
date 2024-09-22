import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

import { DeleteAnswerUseCase } from "./delete-answer";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer Use Case", () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
	});

	it("should be able to delete an answer", async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityId("author-1"),
		});

		inMemoryAnswersRepository.create(newAnswer);

		const answer = await inMemoryAnswersRepository.findById(newAnswer.id.toString());

		expect(answer).toBeTruthy();

		await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: newAnswer.authorId.toString(),
		});

		const deletedAnswer = await inMemoryAnswersRepository.findById(newAnswer.id.toString());

		expect(deletedAnswer).toBeNull();
		expect(inMemoryAnswersRepository.items).toHaveLength(0);
	});

	it("should not be able to delete another user's answer", async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityId("author-1"),
		});

		inMemoryAnswersRepository.create(newAnswer);

		const answer = await inMemoryAnswersRepository.findById(newAnswer.id.toString());

		expect(answer).toBeTruthy();

		expect(() => {
			return sut.execute({
				answerId: newAnswer.id.toString(),
				authorId: new UniqueEntityId("author-2").toString(),
			});
		}).rejects.toBeInstanceOf(Error);

		expect(inMemoryAnswersRepository.items).toHaveLength(1);
	});
});
