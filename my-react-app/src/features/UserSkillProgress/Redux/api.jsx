import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userSkillProgressApi = createApi({
  reducerPath: 'userSkillProgressApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7185/api'
  }),

  tagTypes: ['UserSkillProgress'],

  endpoints: (builder) => ({

    // GET /api/UserSkillProgress 
    getAllUserSkillProgress: builder.query({
      query: () => '/UserSkillProgress',
      providesTags: ['UserSkillProgress'],

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          alert(err);
        }
      }
    }),

    // GET /api/UserSkillProgress/{id} 
    getUserSkillProgressById: builder.query({
      query: (id) => `/UserSkillProgress/${id}`,
      providesTags: (result, error, id) => [{ type: 'UserSkillProgress', id }],

      async onQueryStarted(id, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          alert(err);
        }
      }
    }),

    // POST /api/UserSkillProgress
    addUserSkillProgress: builder.mutation({
      query: (userSkillProgress) => {
        const formData = new FormData();
        for (const key in userSkillProgress) {
          formData.append(key, userSkillProgress[key]);
        }
        return {
          url: '/UserSkillProgress',
          method: 'POST',
          body: formData
        };
      },

      invalidatesTags: ['UserSkillProgress'],

      async onQueryStarted(newUserSkillProgress, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userSkillProgressApi.util.updateQueryData(
            'getAllUserSkillProgress',
            undefined,
            (draft) => {
              draft.push(newUserSkillProgress);
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

    // PUT /api/UserSkillProgress/{id}
    updateUserSkillProgress: builder.mutation({
      query: ({ id, userSkillProgress }) => ({
        url: `/UserSkillProgress/${id}`,
        method: 'PUT',
        body: userSkillProgress,
        headers: {
          'Content-Type': 'application/json'
        }
      }),

      invalidatesTags: (result, error, arg) => [{ type: 'UserSkillProgress', id: arg.id }],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userSkillProgressApi.util.updateQueryData(
            'getAllUserSkillProgress',
            undefined,
            (draft) => {
              const index = draft.findIndex(u => u.userSkillProgressId === arg.id);
              if (index !== -1) {
                draft[index] = { ...draft[index], ...arg.userSkillProgress };
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

    // DELETE /api/UserSkillProgress/{id}
    deleteUserSkillProgress: builder.mutation({
      query: (id) => ({
        url: `/UserSkillProgress/${id}`,
        method: 'DELETE'
      }),

      invalidatesTags: ['UserSkillProgress'],

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userSkillProgressApi.util.updateQueryData(
            'getAllUserSkillProgress',
            undefined,
            (draft) => draft.filter(u => u.userSkillProgressId !== id)
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
  useGetAllUserSkillProgressQuery,
  useGetUserSkillProgressByIdQuery,
  useAddUserSkillProgressMutation,
  useUpdateUserSkillProgressMutation,
  useDeleteUserSkillProgressMutation
} = userSkillProgressApi;