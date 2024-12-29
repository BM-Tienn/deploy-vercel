import { createSlice } from 'utils/@reduxjs/toolkit';
import { createRoutine } from 'redux-saga-routines';
import { PermissionState } from './types';
import { useInjectReducer } from 'redux-injectors';

export const initialState: PermissionState = {
  assets: [],
  documents: [],
  objects: [],
  others: [],
  othersConfig: [],
  documentsConfig: [],
  assetsConfig: [],
  objectsConfig: [],
};
export const PERMISSION_GET_LIST = createRoutine('permissions/get List');

function convertItemProps(datas) {
  const result = datas?.map(item => {
    let key = item.title || item.name || (item?.key ? item.key : 'Home');
    if (item?.path && key !== 'Home') key = 'Home' + item.path + key;

    return {
      label: key,
      value: item.id,
      key: key,
    };
  });

  return result;
}

const slice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    updateAssets: (state, actions) => {
      state.assets = actions.payload.data;
    },
    updateObjects: (state, actions) => {
      state.objects = actions.payload.data;
    },
    updateDocuments: (state, actions) => {
      state.documents = actions.payload.data;
    },
    updateOthers: (state, actions) => {
      state.others = actions.payload.data;
    },
    initOthersConfig: (state, actions) => {
      const others = actions.payload.data;
      state.othersConfig = others?.map(item => ({
        label: item?.toUpperCase(),
        value: item,
        key: item?.toUpperCase(),
      }));
    },
    initDocumentsConfig: (state, actions) => {
      state.documentsConfig = convertItemProps(actions.payload.data);
    },
    initAssetsConfig: (state, actions) => {
      state.assetsConfig = convertItemProps(actions.payload.data);
    },
    initObjectsConfig: (state, actions) => {
      state.objectsConfig = convertItemProps(actions.payload.data);
    },
  },
  extraReducers: {},
});
export const permissionsActions = slice.actions;
export const usePermissionsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
