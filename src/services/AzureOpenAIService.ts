import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { z } from "zod";
import { ChatServiceOptions } from "./AIChatService.js"

export class AzureOpenAIService {
    private _temperature: number
    private _model: string
    private _client: OpenAIClient
    private _deploymentName: string

    constructor(options: z.infer<typeof ChatServiceOptions>,) {
        this._temperature = options.temperature ?? 0.8
        this._model = options.model ?? "gpt-35-turbo"
        if (!options.deploymentName) {
            throw new Error("Missing deploymentName")
        }
        this._deploymentName = options.deploymentName

        this._client = new OpenAIClient(
            options.endpoint || process.env.AZURE_OPENAI_ENDPOINT || "https://api.openai.com",
            new AzureKeyCredential(options.key || process.env.AZURE_OPENAI_KEY || "")
        )

    }

    async chat(
        systemPrompt: string,
        userPrompt: string) : Promise<string> {

        const { id, created, choices, usage } = await this._client.getChatCompletions(this._deploymentName, [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": userPrompt },
        ], {
            temperature: this._temperature,
            model: this._model
        });

        if (!choices[0].message || !choices[0].message.content) {
            throw new Error("No message returned");
        }

        return choices[0].message.content;
    }
}