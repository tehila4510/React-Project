import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../features/User/Redux/api";
import {userSliceReducer} from "../features/User/Redux/userSlice"
import { userAnswerApi } from "../features/UserAnswer/Redux/api";
import { questionApi } from "../features/Question/Redux/api";

export const store= configureStore({
    reducer: {
        userSlice: userSliceReducer,
        [userApi.userPath]: userApi.reducer,

        //להוסיף SLICE
        [userAnswerApi.userPath]: userAnswerApi.reducer,
        [questionApi.reducerPath]: questionApi.reducer

    },
     middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});