// redux
import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware, { runSaga } from "redux-saga";
import ReducerManager from "./ReducerManager";
import { initAction } from "./combineReducersTree";
import { wrapReducer, wrapCallBackNotification } from "./batch";

// import { composeWithDevTools } from 'remote-redux-devtools';

export const defaultOptions = {
  rootReducer: (state = {}) => state,
  startingSaga: []
};

export default class Store {
  constructor(
    {
      preloadedState = {},
      sagaMonitor
    } = defaultOptions
  ) {
    const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
    const middleware = [sagaMiddleware];

    const reducerManager = new ReducerManager();
    this.sagaTotasksMap = new Map();
    // const composeEnhancers = composeWithDevTools(
    //   {
    //     name: 'configuration agent',
    //     hostname: 'localhost',
    //     maxAge: 20,
    //     realtime: true,
    //     port: 8000,
    //   });

    // eslint-disable-next-line no-unused-vars
    const store = createStore(
      wrapReducer(reducerManager.reducer),
      preloadedState,
      compose(
        applyMiddleware(...middleware)
        // other store enhancers if any
      )
    );

    const listeners = new Map();
    const notifyAll = action =>
      listeners.forEach(cb => wrapCallBackNotification(cb)(action));
    const IO = {
      subscribe: cb => {
        const token = {};
        listeners.set(token, action => {
          return cb(action);
        });
        return () => listeners.delete(token);
      },
      dispatch: action => {
        store.dispatch(action);
        notifyAll(action);
      },
      getState: (...args) => {
        return this.getState(...args);
      }
    };

    /*  TODO
     if (isDebuggingInChrome) {
     window.store = store;
     }
     */
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
    for (const [key, saga] of Object.entries(business.sagasMap)) {
      this.sagaTotasksMap.set(key, runSaga(saga, this.IO));
    }
    this.dispatch(initAction);
  }

  unregisterBusiness(business) {
    this.reducerManager.removeReducersTree(...business.reducersTree);
    business.sagas.forEach(saga => this.sagaTotasksMap.delete(this.run(saga)));
  }
}

/*
 import { is, check, uid as nextSagaId, wrapSagaDispatch } from './utils'
 import proc from './proc'

 export function runSaga(
 iterator,
 {
 subscribe,
 dispatch,
 getState,
 sagaMonitor,
 logger,
 onError
 }
 ) {

 check(iterator, is.iterator, "runSaga must be called on an iterator")

 const effectId = nextSagaId()
 if(sagaMonitor) {
 sagaMonitor.effectTriggered({effectId, root: true, parentEffectId: 0, effect: {root: true, saga: iterator, args:[]}})
 }
 const task = proc(
 iterator,
 subscribe,
 wrapSagaDispatch(dispatch),
 getState,
 {sagaMonitor, logger, onError},
 effectId,
 iterator.name
 )

 if(sagaMonitor) {
 sagaMonitor.effectResolved(effectId, task)
 }

 return task
 }
 */
