import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { EditAnswerUseCase } from "./edit-answer";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer Use Case", () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		sut = new EditAnswerUseCase(inMemoryAnswersRepository);
	});

	it("should be able to edit a answer", async () => {
		const newAnswer = makeAnswer();

		inMemoryAnswersRepository.create(newAnswer);

		await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: newAnswer.authorId.toString(),
			content: "New content",
		});

		const editedAnswer = await inMemoryAnswersRepository.findById(newAnswer.id.toString());

		if (!editedAnswer) {
			throw new Error("Answer not found");
		}

		expect(editedAnswer).toBeTruthy();
		expect(editedAnswer.content).toBe("New content");
	});

	it("should not be able to edit another user's answer", async () => {
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
				content: "New content",
			});
		}).rejects.toBeInstanceOf(Error);
	});
});
