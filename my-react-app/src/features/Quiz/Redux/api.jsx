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

    // POST /api/Quiz/start-session/{userId}
    startSession: builder.mutation({
      query: (userId) => ({
        url: `/Quiz/start-session/${userId}`,
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

    // GET /api/Quiz/next-question/{userId}/{sessionId}/{skillId?}
    getNextQuestion: builder.query({
      query: ({ userId, sessionId, skillId }) =>
        skillId
          ? `/Quiz/next-question/${userId}/${sessionId}/${skillId}`
          : `/Quiz/next-question/${userId}/${sessionId}`,
    }),

    // POST /api/Quiz/submit-answer?userId={userId}
    
    submitAnswer: builder.mutation({
      query: ({ userId, answerDto }) => ({
        url: `/Quiz/submit-answer?userId=${userId}`,
        method: 'POST',
        body: answerDto,
      }),
    }),

  }),
});

export const {
  useStartSessionMutation,
  useEndSessionMutation,
  useLazyGetNextQuestionQuery,
  useSubmitAnswerMutation,
} = quizApi;
