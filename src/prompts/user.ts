const defaultTask =
    `Output a json object or array fitting this schema, based on the PROMPT section below.
Code only, NO COMMENTARY, no introduction sentence, no codefence block.
You are generating json - make sure to escape any double quotes.
If you are not sure or cannot generate something for any possible reason, return:
{"error" : <the reason of the error>}`;

type GenerateOptions = {
    task?: string;
};

/**
 * Returns a javascript object or array generated with random content fitting the schema, based on the prompt
 * @param schema  zod schema
 * @param prompt  prompt to which the answer will be generated on the proper schema
 * @returns
 */
export const generate = (
    schema: string,
    prompt: string,
    options?: GenerateOptions,
    // z.infer<T> is a utility type that generates typescript type from the zod schema
): string => {
    return `
    JSON SCHEMA:"""
    ${schema}
    """
    
    TASK:"""
    ${options?.task || defaultTask}
    """
    
    PROMPT:""""
    ${prompt}
    """`;
};
