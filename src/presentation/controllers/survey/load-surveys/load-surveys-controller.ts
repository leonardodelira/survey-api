import { ILoadSurveys } from '../../../../domain/usecases/load-surveys';
import { Controller, HttpRequest, HttpResponse } from '../../../protocols';

export default class LoadSurveysController implements Controller {
  constructor(
    private readonly loadSurveys: ILoadSurveys
  ) {

  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load();
    return null;
  }
}