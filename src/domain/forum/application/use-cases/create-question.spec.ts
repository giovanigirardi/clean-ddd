import { CreateQuestionUseCase } from "./create-question";

import type { Question } from "../../enterprise/entities/question";
import type { QuestionsRepository } from "../repositories/questions-repository";

const fakeQuestionsRepository: QuestionsRepository = {
	create: async (question: Question) => {
		return;
	},
};

test("create a question", async () => {
	const createQuestion = new CreateQuestionUseCase(fakeQuestionsRepository);

	const { question } = await createQuestion.execute({
		authorId: "1",
		title: "Question title",
		content: "Question content",
	});

	expect(question.id).toBeTruthy();
	expect(question.title).toEqual("Question title");
	expect(question.content).toEqual("Question content");
});
