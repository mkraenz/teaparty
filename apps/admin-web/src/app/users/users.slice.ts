import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../globals/store';

export type User = {
  id: string;
  username: string;
  createdAt: string;
  subscribedSince?: string;
  subscribed: boolean;
};

// export type CacheMetadata<T> = {
//   data: T;
//   expiresAt: number;
// };

// const cachableUsersAdapter = createEntityAdapter({
//   selectId: (user: CacheMetadata<User>) => user.data.id,
//   sortComparer: (a, b) =>
//     new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime(),
// });

const usersAdapter = createEntityAdapter<User>({
  // Keep the "all IDs" array sorted by newest-first
  sortComparer: (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

export const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState(),
  reducers: {
    userAdded: usersAdapter.addOne,
    manyUsersUpserted: usersAdapter.upsertMany,
    userDeleted: usersAdapter.removeOne,
  },
});

export const usersSelectors = usersAdapter.getSelectors<RootState>(
  (state) => state.users
);

export const { manyUsersUpserted, userAdded, userDeleted } = usersSlice.actions;

export default usersSlice.reducer;
