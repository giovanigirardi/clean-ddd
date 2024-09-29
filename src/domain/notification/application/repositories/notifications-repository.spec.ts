import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";

import { SendNotificationUseCase } from "../use-cases/send-notification";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe("Send Notification Use Case", () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
	});

	it("should be able to send a notification", async () => {
		const result = await sut.execute({
			recipientId: "1",
			title: "Notification title",
			content: "Notification content",
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.notification.id).toBeTruthy();
		expect(result.value?.notification.title).toEqual("Notification title");
		expect(result.value?.notification.content).toEqual("Notification content");
		expect(inMemoryNotificationsRepository.items.length).toEqual(1);
	});
});
