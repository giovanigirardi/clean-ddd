import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

import { makeNotification } from "test/factories/make-notification";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";

import { ReadNotificationUseCase } from "./read-notification";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe("Read Notification Use Case", () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
	});

	it("should be able to read a notification", async () => {
		const newNotification = makeNotification();

		inMemoryNotificationsRepository.create(newNotification);

		await sut.execute({
			notificationId: newNotification.id.toString(),
			recipientId: newNotification.recipientId.toString(),
		});

		const editedNotification = await inMemoryNotificationsRepository.findById(newNotification.id.toString());

		expect(editedNotification).toBeTruthy();
		expect(editedNotification?.readAt).toBeInstanceOf(Date);
	});

	it("should not be able to read another user's notification", async () => {
		const newNotification = makeNotification({
			recipientId: new UniqueEntityId("recipient-1"),
		});

		inMemoryNotificationsRepository.create(newNotification);

		const notification = await inMemoryNotificationsRepository.findById(newNotification.id.toString());

		expect(notification).toBeTruthy();

		const result = await sut.execute({
			notificationId: newNotification.id.toString(),
			recipientId: new UniqueEntityId("recipient-2").toString(),
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
