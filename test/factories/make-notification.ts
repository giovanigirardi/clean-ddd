import { faker } from "@faker-js/faker";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Notification, type NotificationProps } from "@/domain/notification/enterprise/entities/notification";

export function makeNotification(override: Partial<NotificationProps> = {}, id?: UniqueEntityId) {
	const notification = Notification.create(
		{
			recipientId: new UniqueEntityId(),
			content: faker.lorem.sentence(4),
			title: faker.lorem.sentence(10),
			...override,
		},
		id,
	);

	return notification;
}
