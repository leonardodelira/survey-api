export class UnathorizedError extends Error {
  constructor(stack?: string) {
    super('Unathorized');
    this.name = 'UnathorizedError';
    this.stack = stack
  }
}
