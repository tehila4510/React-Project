import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const skillApi = createApi({
  reducerPath: 'skillApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7185/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ['Skill'],

  endpoints: (builder) => ({

    // GET /api/Skill
    getAllSkills: builder.query({
      query: () => '/Skill',
      providesTags: ['Skill'],
    }),

    // GET /api/Skill/{id}
    getSkillById: builder.query({
      query: (id) => `/Skill/${id}`,
      providesTags: (result, error, id) => [{ type: 'Skill', id }],
    }),

  }),
});

export const {
  useGetAllSkillsQuery,
  useGetSkillByIdQuery,
} = skillApi;