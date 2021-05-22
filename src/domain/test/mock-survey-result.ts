import { ISurveyResultModel } from '@/domain/models/survey-result';
import { ISaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';

export const mockFakeSurveyResultData = (): ISaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date(),
});

export const mockFakeSurveyResult = (): ISurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_qustion',
  answers: [
    {
      answer: 'any_answer',
      count: 1,
      percent: 50,
    },
    {
      answer: 'any_answer',
      image: 'any_image',
      count: 10,
      percent: 75,
    },
  ],
  date: new Date(),
});
