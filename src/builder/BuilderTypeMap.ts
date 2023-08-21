import { QuestionTypes } from "../enums/QuestionTypes";
import { SurveyBuilderOptions } from "./SurveyBuilder";
import { SurveyRatingBuilder } from "./SurveyRatingBuilder";
import { SurveySelectBuilder } from "./SurveySelectBuilder";

type TypeMap = {
    [QuestionTypes.SELECT]: new (options?: SurveyBuilderOptions) => SurveySelectBuilder,
    [QuestionTypes.RATING]: new (options?: SurveyBuilderOptions) => SurveyRatingBuilder,
}

export const use: TypeMap = {
    [QuestionTypes.SELECT]: SurveySelectBuilder,
    [QuestionTypes.RATING]: SurveyRatingBuilder,
}