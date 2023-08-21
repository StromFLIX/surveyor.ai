import { QuestionTypes } from "../enums/QuestionTypes";
import { SurveyBuilder } from "./SurveyBuilder";

export class SurveyRatingBuilder extends SurveyBuilder {
    private _type = QuestionTypes.RATING
}