import { QuestionTypes } from "../enums/QuestionTypes.js";
import { SurveyBuilderOptions } from "./SurveyBuilder.js";
import { SurveyRatingBuilder } from "./SurveyRatingBuilder.js";
import { SurveySelectBuilder } from "./SurveySelectBuilder.js";

type TypeMap = {
    [QuestionTypes.SELECT]: new (options?: SurveyBuilderOptions) => SurveySelectBuilder,
    [QuestionTypes.RATING]: new (options?: SurveyBuilderOptions) => SurveyRatingBuilder,
}

export const use: TypeMap = {
    [QuestionTypes.SELECT]: SurveySelectBuilder,
    [QuestionTypes.RATING]: SurveyRatingBuilder,
}