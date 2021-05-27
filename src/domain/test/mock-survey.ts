import { ISurveyModel } from '@/domain/models/survey';

export const mockFakeSurvey = (): ISurveyModel => {
  const survey = {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
      },
      {
        answer: 'any_answer',
        image: 'any_image',
      },
    ],
    date: new Date(),
  };

  return survey;
};

export const mockFakeSurveys = (): ISurveyModel[] => {
  const surveys = [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          answer: 'any_answer',
        },
        {
          answer: 'any_answer',
          image: 'any_image',
        },
      ],
      date: new Date(),
    },
  ];

  return surveys;
};
