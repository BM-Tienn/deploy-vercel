import QueryString from 'qs';
import { call, put, takeLatest } from 'redux-saga/effects';
import { USER_GET_LIST } from '.';
import { userListGet } from 'services/userApi';

function* getList(action) {
  const { params } = action.payload;
  const param = QueryString.stringify(params);
  try {
    const { data: res } = yield call(userListGet, param);
    yield put(USER_GET_LIST.success({ ...res }));
  } catch (err) {
    yield put(USER_GET_LIST.failure());
  }
}

export function* usersSaga() {
  yield takeLatest(USER_GET_LIST.TRIGGER, getList);
}
