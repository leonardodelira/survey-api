import { ILoadSurveys } from '@/domain/usecases/survey/load-surveys';
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helpers';
import { Controller, HttpResponse } from '@/presentation/protocols';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: ILoadSurveys) {}

  async handle(request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(request.accountId);
      if (surveys.length === 0) {
        return noContent();
      }
      return ok(surveys);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {
    accountId: string;
  };
}
