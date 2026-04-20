import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../features/User/Redux/api";
import userReducer from "../features/User/Redux/userSlice";
import { userAnswerApi } from "../features/UserAnswer/Redux/api";
import { questionApi } from "../features/Question/Redux/api";
import { skillApi } from "../features/Skill/Redux/api";
import { userSkillProgressApi } from "../features/UserSkillProgress/Redux/api";
import { questionOptionApi } from "../features/Option/Redux/api";
import { sessionApi } from "../features/Session/Redux/api";
import { quizApi } from "../features/Quiz/Redux/api";

export const store= configureStore({
    reducer: {
        
        [userApi.reducerPath]: userApi.reducer,        
        [userAnswerApi.reducerPath]: userAnswerApi.reducer,
        [userSkillProgressApi.reducerPath]: userSkillProgressApi.reducer,
        [questionApi.reducerPath]: questionApi.reducer,
        [questionOptionApi.reducerPath]:questionOptionApi.reducer,
        [sessionApi.reducerPath]:sessionApi.reducer,
        [skillApi.reducerPath]: skillApi.reducer,
        [quizApi.reducerPath]:  quizApi.reducer,
        user: userReducer
    },
      middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(userAnswerApi.middleware)
      .concat(userSkillProgressApi.middleware)
      .concat(questionApi.middleware)
      .concat(questionOptionApi.middleware)
      .concat(sessionApi.middleware)
      .concat(skillApi.middleware)
      .concat(quizApi.middleware)
,
});