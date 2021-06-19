import { UserInputError, AuthenticationError, ForbiddenError, ApolloError } from 'apollo-server-express';
import { Controller } from '@/presentation/protocols';

export const adaptResolver = async (controller: Controller, args?: any, context?: any): Promise<any> => {
  const request = {
    ...(args || {}),
    accountId: context?.req?.accountId,
  };
  const httpRespose = await controller.handle(request);
  switch (httpRespose.statusCode) {
    case 200:
    case 204:
      return httpRespose.body;
    case 400:
      throw new UserInputError(httpRespose.body.message);
    case 401:
      throw new AuthenticationError(httpRespose.body.message);
    case 403:
      throw new ForbiddenError(httpRespose.body.message);
    default:
      throw new ApolloError(httpRespose.body.message);
  }
};
