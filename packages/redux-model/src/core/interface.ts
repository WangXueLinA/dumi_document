import { Dispatch, Middleware, ReducersMapObject } from 'redux';

declare module 'redux' {
  export interface Dispatch {
    (type: string, params?: any): Promise<any>;
  }
}

interface Reducers<S> {
  [key: string]: (state: S, data: any) => S;
}
interface Actions<S, K> {
  [key: string]: (store: ActionStoreAPi<S, K>, data: any) => Promise<any>;
}
interface ActionStoreAPi<S, K> {
  dispatch: Dispatch;
  state: K;
  getState(): S;
  commit(type: string, payload: Partial<K>): void;
}
export interface Model<S = any, K extends keyof S = any> {
  namespace: K;
  state: S[K];
  reducers?: Reducers<S[K]>;
  actions?: Actions<S, S[K]>;
}

export interface RootModel<S = any> {
  state: S;
  reducers: ReducersMapObject<S>;
  actions: {
    [K in keyof S]: Actions<S, K>;
  };
}
export interface Options<S> {
  reducers?: ReducersMapObject<S>;
  middlewares?: Array<Middleware<any, S>>;
  loadingModel?: boolean;
  initState?: S;
}

export interface Loading<M extends RootModel> {
  loading: {
    [K in keyof M]: {
      [T in keyof Model<M, K>['actions']]: number;
    };
  } & { globalLoading: 0 };
}
export type State<M extends RootModel = RootModel> = M['state'] & Loading<M>;

export const defineModel = <S, K extends keyof S>(data: Model<S, K>) => data;

export interface RootStore {
  test: Test;
}

export interface Test {
  count: number;
}
