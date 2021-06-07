export interface ISurveyModel {
  id: string;
  question: string;
  answers: ISurveyAnswerModel[];
  date: Date;
  didAnswer?: boolean;
}

export interface ISurveyAnswerModel {
  image?: string;
  answer: string;
}
