import QueryString from 'qs';
import { call, put, takeLatest } from 'redux-saga/effects';
import { INDEXING_GET_LIST } from '.';
import { indexingListGet } from 'services/indexingApi';

function* getList(action) {
  const { params } = action.payload;
  const param = QueryString.stringify(params);
  try {
    const { data: res } = yield call(indexingListGet, param);
    yield put(INDEXING_GET_LIST.success({ ...res }));
  } catch (err) {
    yield put(INDEXING_GET_LIST.failure());
  }
}

export function* indexingsSaga() {
  yield takeLatest(INDEXING_GET_LIST.TRIGGER, getList);
}
