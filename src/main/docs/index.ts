import { loginPath, surveyPath } from './paths';
import { badRequest, forbidden, serverError, unauthorized } from './components';
import { accountSchema, apikeyAuthSchema, errorSchema, loginSchema, surveyAnswerSchema, surveySchema, surveysSchema } from './schemas';

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
    name: 'Login',
  }, 
  {
    name: 'Enquete'
  }],
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath,
  },
  schemas: {
    account: accountSchema,
    login: loginSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema,
    error: errorSchema,
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apikeyAuthSchema,
    },
    badRequest,
    unauthorized,
    serverError,
    forbidden
  }
}