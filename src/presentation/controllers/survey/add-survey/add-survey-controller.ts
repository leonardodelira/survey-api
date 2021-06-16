import { IAddSurvey } from '@/domain/usecases/survey/add-survey';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helpers';
import { HttpResponse, Controller, IValidation } from '@/presentation/protocols';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: IValidation,
    private readonly addSurvey: IAddSurvey
  ) { }

  async handle(request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);

      if (error) {
        return badRequest(error);
      }

      const { question, answers } = request;
      await this.addSurvey.add({
        question,
        answers,
        date: new Date()
      });

      return noContent();
    } catch (err) {
      return serverError(err)
    }
  }
}

export namespace AddSurveyController {
  type Answer = {
    image?: string,
    answer: string,
  }

  export type Request = {
    question: string, 
    answers: Answer[]
  }
}