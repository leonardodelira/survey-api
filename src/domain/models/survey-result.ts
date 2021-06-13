export interface ISurveyResultModel {
  surveyId: string;
  question: string;
  answers: iSurveyResultAnswerModel[];
  date: Date;
}

interface iSurveyResultAnswerModel {
  image?: string;
  answer: string;
  count: number;
  percent: number;
  isCurrentAccountAnswer: boolean;
}
