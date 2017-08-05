// redux
import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware, { runSaga } from "redux-saga";
import ReducerManager from "./ReducerManager";
import { initAction } from "./combineReducersTree";
import { wrapReducer, wrapCallBackNotification } from "./batch";

export default class Store {
  constructor(
    {
      preloadedState,
      sagaMonitor,
      middlewares = [],
      composeEnhancer = compose
    } = {}
  ) {
    const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
    const allMiddlewares = [sagaMiddleware, ...middlewares];

    const reducerManager = new ReducerManager();
    this.sagaTotasksMap = new Map();

    // eslint-disable-next-line no-unused-vars
    const store = createStore(
      wrapReducer(reducerManager.reducer),
      preloadedState,
      composeEnhancer(
        applyMiddleware(...allMiddlewares)
        // other store enhancers if any
      )
    );

    const listeners = new Map();
    const notifyAll = action =>
      listeners.forEach(cb => wrapCallBackNotification(cb)(action));
    const IO = {
      subscribe: cb => {
        const token = {};
        listeners.set(token, action => cb(action));
        return () => listeners.delete(token);
      },
      dispatch: action => {
        store.dispatch(action);
        notifyAll(action);
      },
      getState: (...args) => store.getState(...args)
    };

    // the current instance become the store we just created (we added run saga fct)
    Object.assign(this, store, {
      run: sagaMiddleware.run,
      reducerManager,
      IO,
      dispatch: IO.dispatch
    });
  }

  registerBusiness(business) {
    this.reducerManager.addReducersTrees(business.reducersTree);
    Object.entries(business.sagasMap).forEach(([key, saga]) => {
      this.sagaTotasksMap.set(key, runSaga(saga(), this.IO));
    });
    this.dispatch(initAction);
  }

  unregisterBusiness(business) {
    this.reducerManager.removeReducersTree(...business.reducersTree);
    business.sagasMap.forEach(saga =>
      this.sagaTotasksMap.delete(this.run(saga)));
  }
}
