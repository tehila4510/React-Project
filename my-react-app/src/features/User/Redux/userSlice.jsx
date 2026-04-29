import { createSlice } from '@reduxjs/toolkit';

const getSafeUser = () => {
  try {
    const saved = localStorage.getItem('user');
    if (!saved || saved === "undefined") return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

const getSafeToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token || token === "undefined") return null;
    return token;
  } catch {
    return null;
  }
};

const initialState = {
  currentUser: getSafeUser(),
  token: getSafeToken(),
  isLoggedIn: !!getSafeToken()
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
  const user = action.payload.user || action.payload.User;
  const token = action.payload.token || action.payload.Token;

  state.currentUser = user ?? null;
  state.token = token ?? null;
  state.isLoggedIn = !!token && !!user;

  if (token) localStorage.setItem('token', token);
  if (user) localStorage.setItem('user', JSON.stringify(user));
},

    updateCurrentUser: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.currentUser));
    },

    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    
  },
});

export const { setUser, updateCurrentUser, logout } = userSlice.actions;
export default userSlice.reducer;