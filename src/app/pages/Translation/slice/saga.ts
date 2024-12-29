import QueryString from 'qs';
import { call, put, takeLatest } from 'redux-saga/effects';
import { TRANSLATION_GET_LIST } from '.';
import { translationListing } from 'services/translation';

function* getList(action) {
  const { params } = action.payload;
  const param = QueryString.stringify(params);
  try {
    const { data: res } = yield call(translationListing, param);
    yield put(TRANSLATION_GET_LIST.success({ ...res }));
  } catch (err) {
    yield put(TRANSLATION_GET_LIST.failure());
  }
}

export function* translationSaga() {
  yield takeLatest(TRANSLATION_GET_LIST.TRIGGER, getList);
}
