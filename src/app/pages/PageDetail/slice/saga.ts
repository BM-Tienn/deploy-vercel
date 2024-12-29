import { put, takeLatest } from 'redux-saga/effects';
import { PAGE_DETAIL_GET_LIST, setInitialData } from './';

function* fetchPageDetail(action: { payload: any[] }) {
  try {
    yield put(setInitialData(action.payload));
  } catch (error) {
    console.error('Failed to handle page details:', error);
  }
}

export function* pageDetailSaga() {
  yield takeLatest(PAGE_DETAIL_GET_LIST, fetchPageDetail);
}
