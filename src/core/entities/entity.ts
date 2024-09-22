import { UniqueEntityId } from "./unique-entity-id";

export class Entity<T> {
	private _id: UniqueEntityId;
	protected props: T = {} as T;

	get id(): UniqueEntityId {
		return this._id;
	}

	protected constructor(props: T, id?: UniqueEntityId) {
		this.props = props;
		this._id = id ?? new UniqueEntityId();
	}
}
