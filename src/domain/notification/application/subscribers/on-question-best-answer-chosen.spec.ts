import type { MockInstance } from "vitest";

import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

import { makeQuestion } from "test/factories/make-question";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { OnQuestionBestAnswerChosenCreated } from "./on-question-best-answer-chosen";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let notificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance;

describe("On Question Best Answer Chosen", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
		notificationsRepository = new InMemoryNotificationsRepository();
		sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository);

		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

		new OnQuestionBestAnswerChosenCreated(inMemoryAnswersRepository, sendNotificationUseCase);
	});

	it("should send a notification when a new question has a new best answer", async () => {
		const question = makeQuestion();
		const answer = makeAnswer({ questionId: question.id });

		await inMemoryQuestionsRepository.create(question);
		await inMemoryAnswersRepository.create(answer);

		question.bestAnswerId = answer.id;

		await inMemoryQuestionsRepository.save(question);

		expect(sendNotificationExecuteSpy).toHaveBeenCalledWith({
			recipientId: answer.authorId.toString(),
			title: expect.any(String),
			content: answer.excerpt,
		});
	});
});
