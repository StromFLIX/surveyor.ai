import { z } from "zod";
import { ChatServiceOptions } from "./AIChatService.js"
import { Configuration, OpenAIApi } from "openai";

export class OpenAIService {
    private _temperature: number
    private _model: string
    private _client: OpenAIApi

    constructor(options: z.infer<typeof ChatServiceOptions>,) {
        this._temperature = options.temperature ?? 0.8
        this._model = options.model ?? "gpt-35-turbo"

        this._client = new OpenAIApi(new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        }));

    }

    async chat(
        systemPrompt: string,
        userPrompt: string): Promise<string> {


        const chatCompletion = await this._client.createChatCompletion({
            temperature: this._temperature,
            model: this._model,
            messages: [
                { "role": "system", "content": systemPrompt },
                { "role": "user", "content": userPrompt },
            ],
        });

        if (!chatCompletion.data.choices[0].message || !chatCompletion.data.choices[0].message.content) {
            throw new Error("No message returned");
        }

        return chatCompletion.data.choices[0].message.content;
    }
}