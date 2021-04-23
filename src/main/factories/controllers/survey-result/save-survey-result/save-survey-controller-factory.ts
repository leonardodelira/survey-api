import { SaveSurveyResultController } from '../../../../../presentation/controllers/survey-result/save-survey-result/save-survey-result-controller';
import { Controller } from '../../../../../presentation/protocols';
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory';
import { makeDbLoadSurveyById } from '../../../usecases/load-survey-by-id/db-load-survey-by-id-factory';
import { makeDbASaveSurveyResult } from '../../../usecases/survey-result/save-survey-result/db-save-survey-result-factory';

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResultController = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbASaveSurveyResult());
  return makeLogControllerDecorator(saveSurveyResultController);
};
