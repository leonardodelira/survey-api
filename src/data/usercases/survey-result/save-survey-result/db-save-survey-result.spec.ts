import { ISaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import { DbSaveSurveyResult } from './db-save-survey-result';
import { mockFakeSurveyResult, mockFakeSurveyResultData, throwError } from '@/domain/test';
import { mockSaveSurveyResultRepository } from '@/data/test';
import MockDate from 'mockdate'

interface SutTypes {
  sut: DbSaveSurveyResult,
  saveSurveyResultRepositoryStub: ISaveSurveyResultRepository,
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
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
    const surveyResultData = mockFakeSurveyResultData();
    await sut.save(surveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
  });

  test('Should throws if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError);

    const promisse = sut.save(mockFakeSurveyResultData());
    await expect(promisse).rejects.toThrow();
  });

  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.save(mockFakeSurveyResultData());
    expect(surveyResult).toEqual(mockFakeSurveyResult())
  });
})