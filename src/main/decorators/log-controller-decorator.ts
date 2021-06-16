import { Controller, HttpResponse } from '@/presentation/protocols';
import { ILogErrorRepository } from '@/data/protocols/db/log/log-error-repository';

export class LogControllerDecorator implements Controller {
  constructor(private readonly controller: Controller, private readonly logErroRepository: ILogErrorRepository) {}

  async handle(request: any): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(request);

    if (httpResponse.statusCode === 500) {
      await this.logErroRepository.logError(httpResponse.body.stack);
    }

    return httpResponse;
  }
}
