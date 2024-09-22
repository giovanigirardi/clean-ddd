import { AnswerQuestionUseCase } from "./answer-question";

import type { Answer } from "../../../forum/enterprise/entities/answer";
import type { AnswersRepository } from "../repositories/answers-repository";

const fakeAnswersRepository: AnswersRepository = {
	create: async (answer: Answer) => {
		return;
	},
};

test("create an answer", async () => {
	const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository);

	const { answer } = await answerQuestion.execute({
		instructorId: "1",
		questionId: "1",
		content: "Answer content",
	});

	expect(answer.content).toEqual("Answer content");
});
