import { type Either, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

import { Notification } from "../../enterprise/entities/notification";

import type { NotificationsRepository } from "../repositories/notifications-repository";

interface SendNotificationUseCaseRequest {
	recipientId: string;
	title: string;
	content: string;
}

type SendNotificationUseCaseResponse = Either<null, { notification: Notification }>;

export class SendNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		recipientId,
		content,
		title,
	}: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
		const notification = Notification.create({
			recipientId: new UniqueEntityId(recipientId),
			content: content,
			title: title,
		});

		await this.notificationsRepository.create(notification);

		return right({ notification });
	}
}
