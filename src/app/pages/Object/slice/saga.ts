import QueryString from 'qs';
import { call, put, takeLatest } from 'redux-saga/effects';

import { OBJECT_GET_LIST } from '.';
import { getListObject } from 'services/objectApi';
function* getList(action) {
  const { params } = action.payload;
  const param = QueryString.stringify(params);
  try {
    const { data: res } = yield call(getListObject, param);
    yield put(OBJECT_GET_LIST.success({ ...res }));
  } catch (err) {
    yield put(OBJECT_GET_LIST.failure());
  }
}

export function* objectSaga() {
  yield takeLatest(OBJECT_GET_LIST.TRIGGER, getList);
}
