import { QuestionTypes } from "../enums/QuestionTypes.js";
import { SurveyBuilder } from "./SurveyBuilder.js";

export class SurveyRatingBuilder extends SurveyBuilder {
    private _type = QuestionTypes.RATING
}