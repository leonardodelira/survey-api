import { ILoadSurveys } from '../../../../domain/usecases/load-surveys';
import { ok } from '../../../helpers/http/http-helpers';
import { Controller, HttpRequest, HttpResponse } from '../../../protocols';

export default class LoadSurveysController implements Controller {
  constructor(
    private readonly loadSurveys: ILoadSurveys
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load();
    return ok(surveys);
  }
}