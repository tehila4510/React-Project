import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const sessionApi = createApi({
  reducerPath: 'sessionApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7185/api'
  }),

  tagTypes: ['Session'],

  endpoints: (builder) => ({

    // GET /api/Session - קבלת כל הסשנים
    getAllSessions: builder.query({
      query: () => '/Session',
      providesTags: ['Session'],

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          alert(err);
        }
      }
    }),

    // GET /api/Session/{id} - קבלת סשן לפי ID
    getSessionById: builder.query({
      query: (id) => `/Session/${id}`,
      providesTags: (result, error, id) => [{ type: 'Session', id }],

      async onQueryStarted(id, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          alert(err);
        }
      }
    }),

    // POST /api/Session - יצירת סשן חדש (FormData)
    addSession: builder.mutation({
      query: (session) => {
        const formData = new FormData();
        for (const key in session) {
          formData.append(key, session[key]);
        }
        return {
          url: '/Session',
          method: 'POST',
          body: formData
        };
      },

      invalidatesTags: ['Session'],

      async onQueryStarted(newSession, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          sessionApi.util.updateQueryData(
            'getAllSessions',
            undefined,
            (draft) => {
              draft.push(newSession);
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

    // PUT /api/Session/{id} - עדכון סשן
    updateSession: builder.mutation({
      query: ({ id, session }) => ({
        url: `/Session/${id}`,
        method: 'PUT',
        body: session,
        headers: {
          'Content-Type': 'application/json'
        }
      }),

      invalidatesTags: (result, error, arg) => [{ type: 'Session', id: arg.id }],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          sessionApi.util.updateQueryData(
            'getAllSessions',
            undefined,
            (draft) => {
              const index = draft.findIndex(s => s.sessionId === arg.id);
              if (index !== -1) {
                draft[index] = { ...draft[index], ...arg.session };
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

    // DELETE /api/Session/{id} - מחיקת סשן
    deleteSession: builder.mutation({
      query: (id) => ({
        url: `/Session/${id}`,
        method: 'DELETE'
      }),

      invalidatesTags: ['Session'],

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          sessionApi.util.updateQueryData(
            'getAllSessions',
            undefined,
            (draft) => draft.filter(s => s.sessionId !== id)
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

// Hooks לשימוש בקומפוננטות
export const {
  useGetAllSessionsQuery,
  useGetSessionByIdQuery,
  useAddSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation
} = sessionApi;