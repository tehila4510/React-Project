import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const quizApi = createApi({
  reducerPath: 'quizApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7185/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),

  endpoints: (builder) => ({

    // POST /api/Quiz/start-session
    startSession: builder.mutation({
      query: () => ({
        url: `/Quiz/start-session`,
        method: 'POST',
      }),
    }),

    // POST /api/Quiz/end-session/{sessionId}
    endSession: builder.mutation({
      query: (sessionId) => ({
        url: `/Quiz/end-session/${sessionId}`,
        method: 'POST',
      }),
    }),

    // GET /api/Quiz/next-question/{sessionId}/{skillId?}
    getNextQuestion: builder.query({
     query: ({ sessionId, skillId }) =>
  skillId
    ? `/Quiz/next-question/${sessionId}/${skillId}`
    : `/Quiz/next-question/${sessionId}`,
    }),

    // POST /api/Quiz/submit-answer
    
    submitAnswer: builder.mutation({
      query: ({ answerDto }) => ({
        url: `/Quiz/submit-answer`,
        method: 'POST',
        body: answerDto,
      }),
    }),
loseHeart: builder.mutation({
  query: () => ({
    url: '/User/lose-heart',
    method: 'POST',
  }),
}),
  }),
});

export const {
  useStartSessionMutation,
  useEndSessionMutation,
  useLazyGetNextQuestionQuery,
  useSubmitAnswerMutation,
  useLoseHeartMutation,
} = quizApi;
