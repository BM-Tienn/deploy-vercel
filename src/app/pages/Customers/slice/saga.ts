import QueryString from 'qs';
import { call, put, takeLatest } from 'redux-saga/effects';
import { CUSTOMER_GET_LIST } from '.';
import { userListGet } from 'services/userApi';

function* getList(action) {
  const { params } = action.payload;
  const param = QueryString.stringify(params);
  try {
    const { data: res } = yield call(userListGet, param);
    yield put(CUSTOMER_GET_LIST.success({ ...res }));
  } catch (err) {
    yield put(CUSTOMER_GET_LIST.failure());
  }
}

export function* customersSaga() {
  yield takeLatest(CUSTOMER_GET_LIST.TRIGGER, getList);
}
