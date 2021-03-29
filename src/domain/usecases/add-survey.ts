export interface IAddSurveyModel {
  question: string;
  answers: SurveyAnswer[];
  date: Date;
}

interface SurveyAnswer {
  image?: string;
  answer: string;
}

export interface IAddSurvey {
  add(data: IAddSurveyModel): Promise<void>;
}
