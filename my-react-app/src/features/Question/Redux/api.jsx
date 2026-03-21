import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const questionApi = createApi({
  reducerPath: 'questionApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7185/api'
  }),

  tagTypes: ['Question'],

  endpoints: (builder) => ({

    // GET /api/Question - קבלת כל השאלות
    getAllQuestions: builder.query({
      query: () => '/Question',
      providesTags: ['Question'],

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          // התחיל
          await queryFulfilled;
          // הצליח
        } catch (err) {
          alert(err)
        }
      }
    }),

    // GET /api/Question/{id} - קבלת שאלה לפי ID
    getQuestionById: builder.query({
      query: (id) => `/Question/${id}`,
      providesTags: (result, error, id) => [{ type: 'Question', id }],

      async onQueryStarted(id, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
            alert(err)

        }
      }
    }),

    // POST /api/Question - הוספת שאלה חדשה (FormData)
    addQuestion: builder.mutation({
      query: (question) => {
        const formData = new FormData();
        for (const key in question) {
          formData.append(key, question[key]);
        }
        return {
          url: '/Question',
          method: 'POST',
          body: formData
        };
      },

      invalidatesTags: ['Question'],

      async onQueryStarted(newQuestion, { dispatch, queryFulfilled }) {
        // Optimistic update – מוסיף את השאלה לרשימה מיד
        const patchResult = dispatch(
          questionApi.util.updateQueryData(
            'getAllQuestions',
            undefined,
            (draft) => {
              draft.push(newQuestion);
            }
          )
        );

        try {
          await queryFulfilled; // מחכה לתשובת השרת
        } catch {
          patchResult.undo(); // מחזיר את השינוי במקרה של שגיאה
        }
      }
    }),

    // PUT /api/Question/{id} - עדכון שאלה
    updateQuestion: builder.mutation({
      query: ({ id, question }) => ({
        url: `/Question/${id}`,
        method: 'PUT',
        body: question,
        headers: {
          'Content-Type': 'application/json'
        }
      }),

      invalidatesTags: (result, error, arg) => [{ type: 'Question', id: arg.id }],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Optimistic update – מעדכן את השאלה ברשימה מיד
        const patchResult = dispatch(
          questionApi.util.updateQueryData(
            'getAllQuestions',
            undefined,
            (draft) => {
              const index = draft.findIndex(q => q.id === arg.id);
              if (index !== -1) {
                draft[index] = { ...draft[index], ...arg.question };
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

    // DELETE /api/Question/{id} - מחיקת שאלה
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/Question/${id}`,
        method: 'DELETE'
      }),

      invalidatesTags: ['Question'],

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update – מוחק את השאלה מיד
        const patchResult = dispatch(
          questionApi.util.updateQueryData(
            'getAllQuestions',
            undefined,
            (draft) => {
              return draft.filter(q => q.id !== id);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    })

  })
});

// Hooks ל שימוש בקומפוננטות
export const {
  useGetAllQuestionsQuery,
  useGetQuestionByIdQuery,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation
} = questionApi;