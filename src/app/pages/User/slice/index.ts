import { createSlice } from 'utils/@reduxjs/toolkit';
import { UserState } from './types';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { usersSaga } from './saga';
import { createRoutine } from 'redux-saga-routines';

export const initialState: UserState = { loading: false, list: [] };
export const USER_GET_LIST = createRoutine('users/get List');

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    createUser: (state, actions) => {
      const crr = [...state.list];
      crr.unshift(actions.payload.data);

      state.list = crr;
    },
    deleteUsers: (state, actions) => {
      const crr = [...state.list].filter(
        user => !actions.payload.includes(user.id),
      );

      state.list = crr;
    },
  },
  extraReducers: {
    [USER_GET_LIST.TRIGGER]: state => {
      state.loading = true;
    },
    [USER_GET_LIST.SUCCESS]: (state, actions) => {
      state.loading = false;

      state.pagination = actions.payload.data.paginationData;
      state.list = actions.payload.data.data;
    },
    [USER_GET_LIST.FAILURE]: state => {
      state.loading = false;
    },
  },
});
export const usersActions = slice.actions;
export const useUsersSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: usersSaga });
  return { actions: slice.actions };
};
