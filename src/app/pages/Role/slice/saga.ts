import QueryString from 'qs';
import { call, put, takeLatest } from 'redux-saga/effects';
import { ROLE_GET_LIST } from '.';
import { roleListGet } from 'services/roleApi';

function* getList(action) {
  const { params } = action.payload;
  const param = QueryString.stringify(params);
  try {
    const { data: res } = yield call(roleListGet, param);
    yield put(ROLE_GET_LIST.success({ ...res }));
  } catch (err) {
    yield put(ROLE_GET_LIST.failure());
  }
}

export function* rolesSaga() {
  yield takeLatest(ROLE_GET_LIST.TRIGGER, getList);
}
