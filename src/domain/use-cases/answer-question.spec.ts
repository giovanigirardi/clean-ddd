import { AnswerQuestionUseCase } from "./answer-question";

import type { Answer } from "../entities/answer";
import type { AnswerRepository } from "../repositories/answers-repository";

const fakeAnswersRepository: AnswerRepository = {
	create: async (answer: Answer) => {
		return;
	},
};

test("create an answer", async () => {
	const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository);

	const answer = await answerQuestion.execute({
		instructorId: "1",
		questionId: "1",
		content: "Answer content",
	});

	expect(answer.content).toEqual("Answer content");
});
