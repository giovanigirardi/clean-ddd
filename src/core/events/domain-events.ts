import type { AggregateRoot } from "../entities/aggregate-root";
import type { UniqueEntityId } from "../entities/unique-entity-id";
import type { DomainEvent } from "./domain-event";

// biome-ignore lint/suspicious/noExplicitAny: class only for domain events
type DomainEventCallback = (event: any) => void;

// biome-ignore lint/complexity/noStaticOnlyClass: class only for domain events
export class DomainEvents {
	private static handlersMap: Record<string, DomainEventCallback[]> = {};
	// biome-ignore lint/suspicious/noExplicitAny: class only for domain events
	private static markedAggregates: AggregateRoot<any>[] = [];

	// biome-ignore lint/suspicious/noExplicitAny: class only for domain events
	public static markAggregateForDispatch(aggregate: AggregateRoot<any>) {
		// biome-ignore lint/complexity/noThisInStatic: class only for domain events
		const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

		if (!aggregateFound) {
			// biome-ignore lint/complexity/noThisInStatic: class only for domain events
			this.markedAggregates.push(aggregate);
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: class only for domain events
	private static dispatchAggregateEvents(aggregate: AggregateRoot<any>) {
		// biome-ignore lint/complexity/noThisInStatic: class only for domain events
		// biome-ignore lint/complexity/noForEach: class only for domain events
		aggregate.domainEvents.forEach((event: DomainEvent) => this.dispatch(event));
	}

	// biome-ignore lint/suspicious/noExplicitAny: class only for domain events
	private static removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<any>) {
		// biome-ignore lint/complexity/noThisInStatic: class only for domain events
		const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));

		// biome-ignore lint/complexity/noThisInStatic: class only for domain events
		this.markedAggregates.splice(index, 1);
	}

	// biome-ignore lint/suspicious/noExplicitAny: class only for domain events
	private static findMarkedAggregateByID(id: UniqueEntityId): AggregateRoot<any> | undefined {
		// biome-ignore lint/complexity/noThisInStatic: class only for domain events
		return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
	}

	public static dispatchEventsForAggregate(id: UniqueEntityId) {
		// biome-ignore lint/complexity/noThisInStatic: class only for domain events
		const aggregate = this.findMarkedAggregateByID(id);

		if (aggregate) {
			// biome-ignore lint/complexity/noThisInStatic: class only for domain events
			this.dispatchAggregateEvents(aggregate);
			aggregate.clearEvents();
			// biome-ignore lint/complexity/noThisInStatic: class only for domain events
			this.removeAggregateFromMarkedDispatchList(aggregate);
		}
	}

	public static register(callback: DomainEventCallback, eventClassName: string) {
		// biome-ignore lint/complexity/noThisInStatic: class only for domain events
		const wasEventRegisteredBefore = eventClassName in this.handlersMap;

		if (!wasEventRegisteredBefore) {
			// biome-ignore lint/complexity/noThisInStatic: class only for domain events
			this.handlersMap[eventClassName] = [];
		}

		// biome-ignore lint/complexity/noThisInStatic: class only for domain events
		this.handlersMap[eventClassName].push(callback);
	}

	public static clearHandlers() {
		// biome-ignore lint/complexity/noThisInStatic: class only for domain events
		this.handlersMap = {};
	}

	public static clearMarkedAggregates() {
		// biome-ignore lint/complexity/noThisInStatic: class only for domain events
		this.markedAggregates = [];
	}

	private static dispatch(event: DomainEvent) {
		const eventClassName: string = event.constructor.name;

		// biome-ignore lint/complexity/noThisInStatic: class only for domain events
		const isEventRegistered = eventClassName in this.handlersMap;

		if (isEventRegistered) {
			// biome-ignore lint/complexity/noThisInStatic: class only for domain events
			const handlers = this.handlersMap[eventClassName];

			for (const handler of handlers) {
				handler(event);
			}
		}
	}
}
