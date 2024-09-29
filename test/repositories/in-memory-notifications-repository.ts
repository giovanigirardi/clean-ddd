import type { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import type { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationsRepository implements NotificationsRepository {
	public items: Notification[] = [];

	async findById(id: string): Promise<Notification | null> {
		const notification = this.items.find((question) => question.id.toString() === id) ?? null;

		return notification;
	}

	async create(notification: Notification) {
		this.items.push(notification);

		return;
	}

	async save(notification: Notification): Promise<void> {
		const index = this.items.findIndex((item) => item.id === notification.id);

		if (index !== -1) {
			this.items[index] = notification;
		}

		return;
	}
}
