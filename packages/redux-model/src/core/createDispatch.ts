/* eslint-disable no-plusplus */

import { Dispatch, MiddlewareAPI } from 'redux';
import { RootModel } from './interface';
import log from './log';

const createCommit =
  (
    dispatch: Dispatch,
    namespace: string,
    getState: MiddlewareAPI['getState'],
  ) =>
  (type: string, payload?: any) => {
    const preState = getState();
    dispatch({ type: `${namespace}/${type}`, payload });
    log('reducers ', `${namespace}/${type}`, payload, preState, getState());
  };
export default <S>(
    { dispatch, getState }: MiddlewareAPI,
    rootModel: RootModel<S>,
    loadingModel?: boolean,
  ) =>
  (type: string, payload?: any) => {
    const [namespace, methodName] = type.split('/');
    const actions = rootModel.actions[namespace];
    let result;
    const preState = getState();

    if (actions && actions[methodName]) {
      log('actions ', type, payload);
      result = actions[methodName](
        {
          commit: createCommit(dispatch, namespace, getState),
          getState,
          dispatch,
          state: getState()[namespace],
        },
        payload,
      );
      if (result instanceof Promise) {
        if (loadingModel) {
          const loading = JSON.parse(JSON.stringify(getState().loading));
          loading.globalLoading++;
          loading[namespace][methodName]++;
          dispatch('loading/updateLoading', loading);
          result.finally(() => {
            const loading1 = JSON.parse(JSON.stringify(getState().loading));
            loading1.globalLoading--;
            loading1[namespace][methodName]--;
            dispatch('loading/updateLoading', loading1);
          });
        }
      }
    } else {
      result = dispatch({ type, payload });
      log('reducers ', type, payload, preState, getState());
    }
    return result instanceof Promise ? result : Promise.resolve(result);
  };
