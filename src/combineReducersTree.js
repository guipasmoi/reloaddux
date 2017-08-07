/* eslint no-param-reassign: "off" */
import merge from "lodash/merge";
import isPlainObject from "lodash/isPlainObject";
import isLeaf from "./utils/isLeaf";
import reverseTree from "./utils/reverseTree";

export const initAction = { type: "@@redux/INIT" };

export default function combineReducersTree(tree) {
  const reversedTree = reverseTree(tree);

  let hasBeenInitialized = false;

  function recursiveProcess(state, action, task) {
    if (isLeaf(task)) {
      if (action.type === initAction.type) {
        // eslint-disable-next-line no-nested-ternary
        const newState = state === undefined
          ? task.default ? task.default : task.reducer(state, action)
          : state;
        return { value: newState, hasChanged: newState !== state };
      }
      if (
        task.actions === undefined || task.actions.indexOf(action.type) >= 0
      ) {
        const newState = task.reducer(state, action);
        return { value: newState, hasChanged: newState !== state };
      }
      return { value: undefined, hasChanged: undefined !== state };
    } else if (!isPlainObject(task)) {
      // reversedTree (task) must contain only plain object and reducer
      throw new Error("unexpected");
    }
    const resultValue = Object.entries(task).reduce(
      (accu, [key, subtask]) => {
        const temp = recursiveProcess(
          isPlainObject(state) ? state[key] : undefined,
          action,
          subtask
        );
        accu.value[key] = temp.value;
        accu.hasChanged = accu.hasChanged || temp.hasChanged;
        return accu;
      },
      { value: { ...state }, hasChanged: false }
    );
    return {
      ...resultValue,
      hasChanged: resultValue.hasChanged || resultValue.value !== state
    };
  }

  // todo optmization no avoid merge on each action
  return (state, action) => {
    let temp = { value: state, hasChanged: false };
    if (!hasBeenInitialized || initAction.type === action.type) {
      temp = recursiveProcess(state, action, tree);
      hasBeenInitialized = true;
    } else {
      temp = recursiveProcess(
        temp.value,
        action,
        merge({}, reversedTree[action.type], reversedTree["*"])
      );
    }
    return temp.hasChanged ? temp.value : state;
  };
}
