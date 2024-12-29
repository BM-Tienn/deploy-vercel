import { createSlice } from '@reduxjs/toolkit';
import { MediaLibraryDetailState } from './types';
import { createRoutine } from 'redux-saga-routines';
import { MetaItem } from '../components/MetaData';
import { useInjectReducer } from 'redux-injectors';

export const initialState: MediaLibraryDetailState = {
  metaData: [],
};

export const MEDIA_LIBRARY_DETAIL_GET_LIST = createRoutine(
  'mediaLibraryDetails/getList',
);

const mediaLibraryDetailSlice = createSlice({
  name: 'mediaLibraryDetails',
  initialState,
  reducers: {
    setMetaData(state, action: { payload: MetaItem[] }) {
      state.metaData = action.payload;
    },
  },
  extraReducers: {},
});

export const { setMetaData } = mediaLibraryDetailSlice.actions;
export const useMediaLibraryDetailSlice = () => {
  useInjectReducer({
    key: mediaLibraryDetailSlice.name,
    reducer: mediaLibraryDetailSlice.reducer,
  });
  return { actions: mediaLibraryDetailSlice.actions };
};
