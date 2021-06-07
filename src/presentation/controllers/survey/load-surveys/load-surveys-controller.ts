import { ILoadSurveys } from '@/domain/usecases/survey/load-surveys';
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export default class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: ILoadSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(httpRequest.accountId);
      if (surveys.length === 0) {
        return noContent();
      }
      return ok(surveys);
    } catch (error) {
      return serverError(error);
    }
  }
}
