/**
 * Created by guipa on 26/05/2017.
 */
export const batchType = "@@reloaddux/batch";

export function isBatchAction(action) {
  return action && typeof action === "object" && action[batchType] === true;
}

export function createBatch(type, ...actions) {
  return {
    type,
    [batchType]: true,
    actions
  };
}

export function wrapReducer(reducer) {
  const wrappedReducer = (state, action) => {
    if (isBatchAction(action)) {
      return action.actions.reduce(wrappedReducer, state);
    }
    return reducer(state, action);
  };
  return wrappedReducer;
}

export function wrapCallBackNotification(cb) {
  return function wrappedCb(action) {
    if (isBatchAction(action)) {
      action.actions.forEach(wrapCallBackNotification(cb));
    }
    cb(action);
  };
}
