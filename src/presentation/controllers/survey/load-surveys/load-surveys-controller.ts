import { ILoadSurveys } from '../../../../domain/usecases/survey/load-surveys';
import { noContent, ok, serverError } from '../../../helpers/http/http-helpers';
import { Controller, HttpRequest, HttpResponse } from '../../../protocols';

export default class LoadSurveysController implements Controller {
  constructor(
    private readonly loadSurveys: ILoadSurveys
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();
      if (surveys.length === 0) {
        return noContent();
      }
      return ok(surveys);
    } catch (error) {
      return serverError(error)
    }
  }
}