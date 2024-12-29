import QueryString from 'qs';
import { call, put, takeLatest } from 'redux-saga/effects';
import { SEO_MONITOR_GET_LIST, SEO_REDIRECT_GET_LIST } from '.';
import { seoMonitorListGet, seoRedirectListGet } from 'services/seoHttpApi';

function* handleApiCall(action, routine, api) {
  const { params } = action.payload;
  const param = QueryString.stringify(params);
  try {
    const { data: res } = yield call(api, param);
    yield put(routine.success({ ...res }));
  } catch (err) {
    yield put(routine.failure());
  }
}

function* getList(action) {
  yield call(handleApiCall, action, SEO_MONITOR_GET_LIST, seoMonitorListGet);
}

function* getListStatus(action) {
  yield call(handleApiCall, action, SEO_REDIRECT_GET_LIST, seoRedirectListGet);
}

export function* seoHttpsSaga() {
  yield takeLatest(SEO_MONITOR_GET_LIST.TRIGGER, getList);
  yield takeLatest(SEO_REDIRECT_GET_LIST.TRIGGER, getListStatus);
}
