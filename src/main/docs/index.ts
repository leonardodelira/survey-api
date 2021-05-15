import {loginPath} from './paths/login-path';
import {accountSchema} from './schemas/account-schema';
import { LoginSchema } from './schemas/login-schema';

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
    login: LoginSchema
  }
}