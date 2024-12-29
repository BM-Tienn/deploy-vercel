import { createSlice } from 'utils/@reduxjs/toolkit';
import { RoleState } from './types';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { rolesSaga } from './saga';
import { createRoutine } from 'redux-saga-routines';

export const initialState: RoleState = { loading: false, list: [] };
export const ROLE_GET_LIST = createRoutine('roles/get List');

const slice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    createRole: (state, actions) => {
      const crr = [...state.list];
      crr.unshift(actions.payload.data);

      state.list = crr;
    },
    deleteRoles: (state, actions) => {
      const crr = [...state.list].filter(
        indexing => !actions.payload.includes(indexing.id),
      );

      state.list = crr;
    },
  },
  extraReducers: {
    [ROLE_GET_LIST.TRIGGER]: state => {
      state.loading = true;
    },
    [ROLE_GET_LIST.SUCCESS]: (state, actions) => {
      state.loading = false;

      state.pagination = actions.payload.data.paginationData;
      state.list = actions.payload.data.data;
    },
    [ROLE_GET_LIST.FAILURE]: state => {
      state.loading = false;
    },
  },
});
export const rolesActions = slice.actions;
export const useRolesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: rolesSaga });
  return { actions: slice.actions };
};
