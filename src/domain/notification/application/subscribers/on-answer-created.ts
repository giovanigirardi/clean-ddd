import { DomainEvents } from "@/core/events/domain-events";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";

import type { SendNotificationUseCase } from "../use-cases/send-notification";

import type { EventHandler } from "@/core/events/event-handler";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";

export class OnAnswerCreated implements EventHandler {
	constructor(
		private questionsRepository: QuestionsRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		DomainEvents.register(this.sendNewAnswerNotification.bind(this), AnswerCreatedEvent.name);
	}

	private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent): Promise<void> {
		const question = await this.questionsRepository.findById(answer.questionId.toString());

		if (question) {
			await this.sendNotification.execute({
				recipientId: question.authorId.toString(),
				title: `Nova resposta em "${question.title.substring(0, 40)}..."`,
				content: answer.excerpt,
			});
		}
	}
}
