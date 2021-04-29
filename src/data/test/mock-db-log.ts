import { ILogErrorRepository } from '../protocols/db/log/log-error-repository';

export const mockLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async logError(stack: string): Promise<void> {
      return await new Promise((resolve) => resolve());
    }
  }

  return new LogErrorRepositoryStub();
};