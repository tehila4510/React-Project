import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../../User/Redux/userSlice';
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://localhost:7185/api',
 prepareHeaders: (headers, { getState }) => {
  const state = getState();

  console.log("REDUX TOKEN:", state.user?.token);
  console.log("LOCAL TOKEN:", localStorage.getItem("token"));

  const token = state.user?.token;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const skillApi = createApi({
  reducerPath: 'skillApi',
  baseQuery: baseQueryWithAuth,

  tagTypes: ['Skill'],

  endpoints: (builder) => ({
    getAllSkills: builder.query({
      query: () => '/Skill',
      providesTags: ['Skill'],
    }),

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