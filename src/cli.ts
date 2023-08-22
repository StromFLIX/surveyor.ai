#! /usr/bin/env node
import { Command } from "commander";
import figlet from "figlet";
import { QuestionTypes, SurveyBuilder, SurveyRegions, use } from "./index.js";
import { promises as fs } from 'fs';
import { stringify } from 'csv';
import { Persona } from "./persona/persona";
import _ from "lodash";
import dotenv from "dotenv";
import cliProgress from 'cli-progress';
dotenv.config();

const program = new Command();

console.log(figlet.textSync("Surveyor.ai CLI"));

// Shared option for all sub-commands
program
    .version("1.0.0")
    .description("Creating surveys with gpt like a boss")
    .option("-q, --question <value>", "Ask a question")
    .option("-c, --context  [value]", "Give context to your question")
    .option("-r, --region [value]", "Region to use e.g. 'germany'")
    .option("-p, --path [value]", "Path to save the output to", "./output.csv")
    .option("-a, --amount [value]", "Amount of answers to generate");

program
    .command('select')
    .argument('<surveyOptions>', 'Options for the select question in form of a comma separated list')
    .action(async (surveyOptions) => {
        const options = program.opts();
        surveyOptions = surveyOptions.split(",").map((option: string) => option.trim());
        const amount = options.amount ? parseInt(options.amount) : 1
        const survey = new SurveyBuilder()
            .context(options.context)
            .question(options.question)
            .region(options.region as SurveyRegions)
            .type(use[QuestionTypes.SELECT])
            .options(surveyOptions)
            .amount(amount)
            .build();
        
        console.log("------------ Starting survey ------------");
        const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        let counter = 0
        progress.start(amount, counter);
        const answers : { answer : string, persona: Persona }[] = [];
        for await (const answer of survey()) {
            answers.push(answer);
            counter++;
            progress.update(counter);
        }
        progress.stop();
        console.log("------------ Write to file ------------");

        const flattenedAnswers = answers.map((answer) => _.omit(_.merge(answer, answer.persona), "persona"));

        const output : string = await new Promise((resolve, reject) => {
            stringify(flattenedAnswers,{
                header: true
              }, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });

        await fs.writeFile(options.path, output);
    });

program.parse(process.argv);



/*

    

*/