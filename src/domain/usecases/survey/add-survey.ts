import { ISurveyAnswerModel } from '@/domain/models/survey';

export interface IAddSurveyModel {
  question: string;
  answers: ISurveyAnswerModel[];
  date: Date;
}

export interface IAddSurvey {
  add(data: IAddSurvey.Params): Promise<void>;
}

export namespace IAddSurvey {
  export type Params = IAddSurveyModel;
}
