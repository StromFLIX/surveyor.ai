import { Configuration, OpenAIApi } from "openai";
import { z, ZodType } from "zod";
import Ajv from "ajv"
const ajv = new Ajv()

export const chat = async <T extends ZodType>(
    systemPrompt: string,
    userPrompt: string,
    schema: string,
): Promise<z.infer<T>> => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openAI = new OpenAIApi(configuration);
    const validate = ajv.compile(JSON.parse(schema))

    const chatCompletion = await openAI.createChatCompletion({
        temperature: 0.8,
        model: "gpt-4-0613",
        messages: [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": userPrompt },
        ],
    });

    // if the response is empty, throw an error
    if (!chatCompletion.data.choices[0].message) {
        throw new Error("No message returned");
    }

    let obj;
    const response = chatCompletion.data.choices[0].message.content;

    // parse the response
    try {
        obj = JSON.parse(response!);
    } catch (e) {
        console.error("The response could not be parsed as json", { response });
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

    const valid = validate(obj);
    if (!valid)
        throw new Error("The generated json does not match the schema.");
    return obj;
};