import { Controller } from '@/presentation/protocols';

export const adaptResolver = async (controller: Controller, args: any): Promise<any> => {
  const httpRespose = await controller.handle(args);
  return httpRespose.body;
};
