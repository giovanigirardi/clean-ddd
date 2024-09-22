import type { Answer } from "../forum/enterprise/entities/answer";

export interface AnswerRepository {
	create(answer: Answer): Promise<void>;
}
