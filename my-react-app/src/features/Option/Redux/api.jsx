import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const questionOptionApi = createApi({
  reducerPath: 'questionOptionApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7185/api'
  }),

  tagTypes: ['QuestionOption'],

  endpoints: (builder) => ({

    // GET /api/QuestionOption 
    getAllQuestionOptions: builder.query({
      query: () => '/QuestionOption',
      providesTags: ['QuestionOption'],

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          alert(err);
        }
      }
    }),

    // GET /api/QuestionOption/{id} 
    getQuestionOptionById: builder.query({
      query: (id) => `/QuestionOption/${id}`,
      providesTags: (result, error, id) => [{ type: 'QuestionOption', id }],

      async onQueryStarted(id, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          alert(err);
        }
      }
    }),

    // POST /api/QuestionOption 
    addQuestionOption: builder.mutation({
      query: (option) => {
        const formData = new FormData();
        for (const key in option) {
          formData.append(key, option[key]);
        }
        return {
          url: '/QuestionOption',
          method: 'POST',
          body: formData
        };
      },

      invalidatesTags: ['QuestionOption'],

      async onQueryStarted(newOption, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          questionOptionApi.util.updateQueryData(
            'getAllQuestionOptions',
            undefined,
            (draft) => {
              draft.push(newOption);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),

    // PUT /api/QuestionOption/{id} 
    updateQuestionOption: builder.mutation({
      query: ({ id, option }) => ({
        url: `/QuestionOption/${id}`,
        method: 'PUT',
        body: option,
        headers: {
          'Content-Type': 'application/json'
        }
      }),

      invalidatesTags: (result, error, arg) => [{ type: 'QuestionOption', id: arg.id }],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          questionOptionApi.util.updateQueryData(
            'getAllQuestionOptions',
            undefined,
            (draft) => {
              const index = draft.findIndex(o => o.optionId === arg.id);
              if (index !== -1) {
                draft[index] = { ...draft[index], ...arg.option };
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),

    // DELETE /api/QuestionOption/{id} 
    deleteQuestionOption: builder.mutation({
      query: (id) => ({
        url: `/QuestionOption/${id}`,
        method: 'DELETE'
      }),

      invalidatesTags: ['QuestionOption'],

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          questionOptionApi.util.updateQueryData(
            'getAllQuestionOptions',
            undefined,
            (draft) => draft.filter(o => o.optionId !== id)
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),

  })
});

export const {
  useGetAllQuestionOptionsQuery,
  useGetQuestionOptionByIdQuery,
  useAddQuestionOptionMutation,
  useUpdateQuestionOptionMutation,
  useDeleteQuestionOptionMutation
} = questionOptionApi;