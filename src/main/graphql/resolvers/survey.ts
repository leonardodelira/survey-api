import { adaptResolver } from '@/main/adapters/apollo-server-resolver-adapter';
import { makeLoadSurveyController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory';

export default {
  Query: {
    surveys: async () => await adaptResolver(makeLoadSurveyController()),
  },
};
