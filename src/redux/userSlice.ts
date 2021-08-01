import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState} from '../app/store';

export interface User {
  userName:string,
  avatarImage:string
}

export const userSlice = createSlice({
  name: 'user',
  initialState:{
    user:{
      uid:"",
      userName:"",
      avatarImage:"",
    }
  },
  reducers: {
    login: (state , action) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.user = {
        uid:"",
        userName:"",
        avatarImage:"",
      }
    },
    updateProfile: (state, action: PayloadAction<User>) => {
      state.user.userName = action.payload.userName;
      state.user.avatarImage = action.payload.avatarImage
    },
  },
});

export const { login, logout, updateProfile } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
