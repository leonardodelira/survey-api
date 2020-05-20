import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';
import { ILogErrorRepository } from '../../data/protocols/log-error-repository';

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;
  private readonly logErroRepository: ILogErrorRepository;

  constructor(controller: Controller, logErroRepository: ILogErrorRepository) {
    this.controller = controller
    this.logErroRepository = logErroRepository;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);
    
    if(httpResponse.statusCode === 500) {
      await this.logErroRepository.log(httpResponse.body.stack)
    }

    return httpResponse;
  }
}