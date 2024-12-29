import { createSlice } from 'utils/@reduxjs/toolkit';
import { GlobalState } from './types';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { globalSaga } from './saga';
export const initialState: GlobalState = {
  loading: false,
  isLogged: false,
  classes: [],
  isAdmin: false,
  permissionData: {
    assets: [],
    documents: [],
    objects: [],
    others: [],
  },
};
const slice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    loginSuccesses: state => {
      state.isLogged = true;
    },
    clearData: state => {
      state.isLogged = false;
    },
    updateClasses: (state, action) => {
      state.classes = action.payload;
    },
    initIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
    updatePermission: (state, action) => {
      state.permissionData = action.payload;
    },
  },
  extraReducers: {},
});
export const { actions: globalActions } = slice;
export const useGlobalSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: globalSaga });
  return { actions: slice.actions };
};
