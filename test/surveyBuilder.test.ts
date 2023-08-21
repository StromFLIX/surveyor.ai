import assert from 'assert';
import { SurveyBuilder, QuestionTypes, SurveyRegions, use } from '../src'

describe('SurveyBuilder', function() {
  it('should create a survey', async function() {
    this.timeout(20000); // added timeout of 5000ms
    const surveyAmount = 10;
    const survey = new SurveyBuilder()
      .context("Recently the covid pandamic has been spreading across the world.")
      .question("Who would you vote for in the next election?")
      .region(SurveyRegions.GERMANY)
      .type(use[QuestionTypes.SELECT])
      .demographics({ sex: ["male", "female"] })
      .options(["Afd", "CDU", "SPD", "FDP", "Grüne", "Linke", "Piraten", "Sonstige"])
      .amount(surveyAmount)
      .build();

    let answers = [];
    for await (const answer of survey()) {
      answers.push(answer);
    }

    assert.equal(answers.length, surveyAmount);
  });
});