import { QuestionTypes } from "../enums/QuestionTypes.js";
import { answerSelectQuestion } from "../surveys/answerSeletctQuestions.js";
import { ChatServiceOptions } from "../services/AIChatService.js"
import { SurveyBuilder } from "./SurveyBuilder.js";
import { z } from 'zod';

const buildSchema = z.object({
    question: z.string(),
    amount: z.number(),
    options: z.array(z.string()).nonempty(),
    aiChatServiceOptions: ChatServiceOptions
});

export class SurveySelectBuilder extends SurveyBuilder {
    private _options: Array<string> | undefined;
    private _type = QuestionTypes.SELECT

    public options(options: Array<string>): SurveySelectBuilder {
        this._options = options
        return this
    }

    public build() {
        const params = buildSchema.parse({
            question: this._question,
            amount: this._amount,
            options: this._options,
            aiChatServiceOptions: this._aiChatServiceOptions
        });
        return () => answerSelectQuestion(params.question, params.amount, params.options, params.aiChatServiceOptions);
    }
}