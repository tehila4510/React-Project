import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7185/api/User",
     prepareHeaders: (headers, { getState }) => {
      const token = getState().user.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users"],


  endpoints: (builder) => ({

    // ---------- REGISTER ----------
    registerUser: builder.mutation({
  query: (newUser) => {
    console.log("FormData entries:");
    for (let pair of newUser.entries()) {
      console.log(pair[0], pair[1]);
    }

    return {
      url: "/register",
      method: "POST",
      body: newUser,
    };
  },
}),

    // ---------- LOGIN ----------
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    
    // ---------- UPDATE ----------
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // ---------- DELETE ----------
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),

  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;