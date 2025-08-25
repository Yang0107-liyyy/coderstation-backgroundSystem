import TypeController from '@/services/type';

export default {
  namespace: 'type',
  state: {
    typeList: [],
  },
  reducers: {
    initTypeList: (state, { payload }) => {
      const newState = { ...state };
      newState.typeList = payload;
      return newState;
    },
    addType: (state, { payload }) => {
      const newState = { ...state };
      const arr = [...newState.typeList];
      arr.push(payload);
      newState.typeList = arr;
      return newState;
    },
    deleteType: (state, { payload }) => {
      const newState = { ...state };
      const index = newState.typeList.indexOf(payload);
      const arr = [...newState.typeList];
      arr.splice(index, 1);
      newState.typeList = arr;
      return newState;
    },
  },
  effects: {
    *_initTypeList(_, { put, call }) {
      const { data } = yield call(TypeController.getType);
      yield put({
        type: 'initTypeList',
        payload: data,
      });
    },
    *_addType({ payload }, { put, call }) {
      const { data } = yield call(TypeController.addType, payload);
      yield put({
        type: 'addType',
        payload: data,
      });
    },
    *_deleteType({ payload }, { put, call }) {
      yield call(TypeController.deleteType, payload._id);
      yield put({
        type: 'deleteType',
        payload,
      });
    },
  },
};
