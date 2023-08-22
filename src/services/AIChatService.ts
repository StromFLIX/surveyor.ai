import { OpenAIClient, AzureKeyCredential, ChatMessage } from "@azure/openai";
import { z, ZodType } from "zod";
import Ajv from "ajv"
const ajv = new Ajv()
import { OpenAIService } from "./OpenAIService.js";
import { AzureOpenAIService } from "./AzureOpenAIService.js";

export const ChatServiceOptions = z.object({
    temperature: z.number().gt(0).lte(1).optional(),
    model: z.string().optional(),
    endpoint: z.string().optional(),
    key: z.string().optional(),
    deploymentName: z.string().optional(),
    type: z.enum(["AzureOpenAI", "OpenAI"])
});

export const chat = async <T extends ZodType>(
    systemPrompt: string,
    userPrompt: string,
    schema: string,
    options: z.infer<typeof ChatServiceOptions>,
): Promise<z.infer<T>> => {

    let message : string | undefined
    switch (options.type){
        case "AzureOpenAI":
            const azureOpenAIService = new AzureOpenAIService(options)
            message = await azureOpenAIService.chat(systemPrompt, userPrompt)
            break;
        case "OpenAI":
            const openAIService = new OpenAIService(options)
            message = await openAIService.chat(systemPrompt, userPrompt)
            break;
    }

    let obj;

    // parse the response
    try {
        obj = JSON.parse(message);
    } catch (e) {
        console.error("The response could not be parsed as json", { message });
        throw new Error("The response could not be parsed as json");
    }

    // chatGpt, when generating an array, tends to wrap it in an object with a "schema" key
    // might be addressable in the prompt, but this is a quick fix
    if (obj.schema) {
        obj = obj.schema;
    }

    // if the response is an error as advised in the prompt, throw an error
    if (obj.error) {
        console.error("chatGPT cannot perform the task", { error: obj.error });
        throw new Error(obj.error);
    }

    const validate = ajv.compile(JSON.parse(schema))
    const valid = validate(obj);
    if (!valid)
        throw new Error("The generated json does not match the schema.");
    return obj;
};