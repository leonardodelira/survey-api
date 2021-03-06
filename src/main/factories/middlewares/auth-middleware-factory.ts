import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware';
import { makeDbLoadAccountByToken } from '@/main/factories/usecases/account/load-account-by-token/load-account-by-token-factory';

export const makeAuthMiddleware = (role?: string): AuthMiddleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role);
};
