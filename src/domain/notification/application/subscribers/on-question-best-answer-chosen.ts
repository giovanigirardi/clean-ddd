import { DomainEvents } from "@/core/events/domain-events";

import type { SendNotificationUseCase } from "../use-cases/send-notification";

import type { EventHandler } from "@/core/events/event-handler";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";

export class OnQuestionBestAnswerChosenCreated implements EventHandler {
	constructor(
		private answersRepository: AnswersRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		DomainEvents.register(this.sendQuestionBestAnswerNotification.bind(this), QuestionBestAnswerChosenEvent.name);
	}

	private async sendQuestionBestAnswerNotification({
		question,
		bestAnswerId,
	}: QuestionBestAnswerChosenEvent): Promise<void> {
		const answer = await this.answersRepository.findById(bestAnswerId.toString());

		if (answer) {
			await this.sendNotification.execute({
				recipientId: answer.authorId.toString(),
				title: `Sua resposta foi marcada como a melhor em "${question.title.substring(0, 40)}..."`,
				content: answer.excerpt,
			});
		}
	}
}
