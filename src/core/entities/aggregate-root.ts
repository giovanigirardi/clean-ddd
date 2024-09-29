import { DomainEvents } from "../events/domain-events";
import { Entity } from "./entity";

import type { DomainEvent } from "../events/domain-event";

export abstract class AggregateRoot<T> extends Entity<T> {
	private _domainEvents: DomainEvent[] = [];

	get domainEvents() {
		return this._domainEvents;
	}

	protected addDomainEvent(domainEvent: DomainEvent): void {
		this._domainEvents.push(domainEvent);
		DomainEvents.markAggregateForDispatch(this);
	}

	public clearEvents(): void {
		this._domainEvents = [];
	}
}
