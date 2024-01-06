import { configureStore } from '@reduxjs/toolkit';
import testSlice from '../test/test.slice';
import usersSlice from '../users/users.slice';

export const store = configureStore({
  reducer: {
    counter: testSlice,
    users: usersSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
