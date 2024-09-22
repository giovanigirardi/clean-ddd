import type { Question } from "../../enterprise/entities/question";

export interface QuestionsRepository {
	create(answer: Question): Promise<void>;
}
