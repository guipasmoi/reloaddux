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
  return (state, action) => {
    if (isBatchAction(action)) {
      return action.actions.reduce(reducer, state);
    }
    return reducer(state, action);
  };
}
