import { UniqueEntityId } from "./unique-entity-id";

export abstract class Entity<T> {
	private _id: UniqueEntityId;
	protected props: T = {} as T;

	get id(): UniqueEntityId {
		return this._id;
	}

	protected constructor(props: T, id?: UniqueEntityId) {
		this.props = props;
		this._id = id ?? new UniqueEntityId();
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public equals(entity: Entity<any>) {
		if (entity === this) {
			return true;
		}

		if (entity._id === this._id) {
			return true;
		}

		return false;
	}
}
