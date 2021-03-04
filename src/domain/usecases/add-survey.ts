export interface IAddSurveyModel {
  question: string;
  answers: SurveyAnswer[];
}

interface SurveyAnswer {
  image: string;
  answer: string;
}

export interface IAddSurvey {
  add(data: IAddSurveyModel): Promise<void>;
}
