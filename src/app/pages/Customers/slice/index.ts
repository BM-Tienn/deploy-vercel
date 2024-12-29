import { createSlice } from 'utils/@reduxjs/toolkit';
import { CustomerState } from './types';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { customersSaga } from './saga';
import { createRoutine } from 'redux-saga-routines';

export const initialState: CustomerState = { loading: false, list: [] };
export const CUSTOMER_GET_LIST = createRoutine('customers/get List');

const slice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    createCustomer: (state, actions) => {
      const crr = [...state.list];
      crr.unshift(actions.payload.data);

      state.list = crr;
    },
    deleteCustomer: (state, actions) => {
      const crr = [...state.list].filter(
        customer => !actions.payload.includes(customer.id),
      );

      state.list = crr;
    },
  },
  extraReducers: {
    [CUSTOMER_GET_LIST.TRIGGER]: state => {
      state.loading = true;
    },
    [CUSTOMER_GET_LIST.SUCCESS]: (state, actions) => {
      state.loading = false;

      state.pagination = actions.payload.data.paginationData;
      state.list = actions.payload.data.data;
    },
    [CUSTOMER_GET_LIST.FAILURE]: state => {
      state.loading = false;
    },
  },
});
export const customersActions = slice.actions;
export const useCustomersSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: customersSaga });
  return { actions: slice.actions };
};
