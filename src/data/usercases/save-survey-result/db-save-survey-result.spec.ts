import { ISurveyResultModel } from '../../../domain/models/survey-result';
import { ISaveSurveyResultModel } from '../../../domain/usecases/save-survey-result';
import { ISaveSurveyResultRepository } from '../../protocols/db/survey/save-survey-result-repository';
import { DbSaveSurveyResult } from './db-save-survey-result';
import MockDate from 'mockdate'

const makeFakeSurveyResultData = (): ISaveSurveyResultModel => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

const makeFakeSurveyResult = (): ISurveyResultModel => Object.assign({}, makeFakeSurveyResultData(), {
  id: 'any_id',
})

const makeSaveSurveyResultRepository = (): ISaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements ISaveSurveyResultRepository {
    async save(survey: ISaveSurveyResultModel): Promise<ISurveyResultModel> {
      return await new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }

  return new SaveSurveyResultRepositoryStub();
}

interface SutTypes {
  sut: DbSaveSurveyResult,
  saveSurveyResultRepositoryStub: ISaveSurveyResultRepository,
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);

  return {
    sut,
    saveSurveyResultRepositoryStub,
  }
}

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
    const surveyResultData = makeFakeSurveyResultData();
    await sut.save(surveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
  });

  test('Should throws if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const promisse = sut.save(makeFakeSurveyResultData());
    await expect(promisse).rejects.toThrow();
  });

  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.save(makeFakeSurveyResultData());
    expect(surveyResult).toEqual(makeFakeSurveyResult())
  });
})