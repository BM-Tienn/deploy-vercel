import QueryString from 'qs';
import { call, put, takeLatest } from 'redux-saga/effects';
import { PAGES_GET_LIST } from '.';
import { pageListGet } from 'services/pagesApi';

function* getList(action) {
  const { params } = action.payload;
  const param = QueryString.stringify(params);
  try {
    const { data: res } = yield call(pageListGet, param);
    yield put(PAGES_GET_LIST.success({ ...res }));
  } catch (err) {
    yield put(PAGES_GET_LIST.failure());
  }
}

export function* pagesSaga() {
  yield takeLatest(PAGES_GET_LIST.TRIGGER, getList);
}
