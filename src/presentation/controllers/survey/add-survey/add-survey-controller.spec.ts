import { IAddSurvey } from '@/domain/usecases/survey/add-survey';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helpers';
import { IValidation } from '@/presentation/protocols';
import { AddSurveyController } from './add-survey-controller';
import { throwError } from '@/domain/test';
import { mockValidation, mockAddSurvey } from '@/presentation/test';
import MockDate from 'mockdate';

const makeFakeRequest = (): AddSurveyController.Request => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
});

interface SutTypes {
  sut: AddSurveyController;
  validationStub: IValidation;
  addSurveyStub: IAddSurvey;
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const addSurveyStub = mockAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);

  return {
    sut,
    validationStub,
    addSurveyStub,
  };
};

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const request = makeFakeRequest();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    await sut.handle(request);
    expect(validateSpy).toHaveBeenCalledWith(request);
  });

  it('Should return 400 if validate fails', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  it('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut();
    const request = makeFakeRequest();
    const addSpy = jest.spyOn(addSurveyStub, 'add');
    await sut.handle(request);
    expect(addSpy).toHaveBeenCalledWith({ ...request, date: new Date() });
  });

  it('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut();
    const request = makeFakeRequest();
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('Should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(noContent());
  });
});
