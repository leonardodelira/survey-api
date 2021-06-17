import { ILoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { ISurveyModel } from '../../../../domain/models/survey';

export interface ILoadSurveyByIdRepository {
  loadById(id: string): Promise<ILoadSurveyByIdRepository.Result>;
}

export namespace ILoadSurveyByIdRepository {
  export type Result = ILoadSurveyById.Result;
}
