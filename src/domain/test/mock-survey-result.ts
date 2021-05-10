import { ISurveyResultModel } from '@/domain/models/survey-result';
import { ISaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result';

export const mockFakeSurveyResultData = (): ISaveSurveyResultModel => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

export const mockFakeSurveyResult = (): ISurveyResultModel => Object.assign({}, mockFakeSurveyResultData(), {
  id: 'any_id',
})