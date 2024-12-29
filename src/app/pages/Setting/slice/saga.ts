import QueryString from 'qs';
import { call, put, takeLatest } from 'redux-saga/effects';

import { SETTING_GET_LIST } from '.';
import { getListObject } from 'services/settingApi';
function* getList(action) {
  const { params } = action.payload;
  const param = QueryString.stringify(params);
  try {
    const { data: res } = yield call(getListObject, param);
    yield put(SETTING_GET_LIST.success({ ...res }));
  } catch (err) {
    yield put(SETTING_GET_LIST.failure());
  }
}

export function* settingSaga() {
  yield takeLatest(SETTING_GET_LIST.TRIGGER, getList);
}
