import { loginPath } from './paths';
import { badRequest, serverError, unauthorized } from './components';
import { accountSchema, errorSchema, loginSchema } from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node Api',
    description: 'API do curso do Mango',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    login: loginSchema,
    error: errorSchema,
  },
  components: {
    badRequest: badRequest,
    unauthorized: unauthorized,
    serverError: serverError,
  }
}