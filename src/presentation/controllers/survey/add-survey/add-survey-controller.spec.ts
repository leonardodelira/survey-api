import { IAddSurvey, IAddSurveyModel } from '../../../../domain/usecases/add-survey';
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helpers';
import { HttpRequest, IValidation } from '../../../protocols'
import { AddSurveyController } from './add-survey-controller';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

interface SutTypes {
  sut: AddSurveyController,
  validationStub: IValidation,
  addSurveyStub: IAddSurvey,
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error {
      return null
    }
  }

  return new ValidationStub();
}

const makeAddSurvey = (): IAddSurvey => {
  class AddSurveyStub implements IAddSurvey {
    async add(data: IAddSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  return new AddSurveyStub();
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const addSurveyStub = makeAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);

  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('AddSurvey Controller', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const httpRequest = makeFakeRequest();
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if validate fails', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  it('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut();
    const httpRequest = makeFakeRequest();
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut();
    const httpRequest = makeFakeRequest();
    jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(noContent())
  })
})