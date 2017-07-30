/* eslint no-param-reassign: "off" */
import merge from "lodash/merge";
import set from "lodash/set";
import isLeaf from "./utils/isLeaf";
import isValidNode from "./utils/isValidNode";
import isPlainObject from "lodash/isPlainObject";

export const initAction = { type: "@@redux/INIT" };

export default function combineReducersTree(
  tree,
  initAction = { type: "@@redux/INIT" }
) {
  const reversedTree = {
    // action1: { scope1: reducer, scope2: reducer },
    "*": {}
  };

  let hasBeenInitialized = false;

  // TODO redo reverse tree
  function reverseTree(subTree, scope = "") {
    if (isLeaf(subTree)) {
      if (subTree.actions) {
        subTree.actions.forEach(action => {
          if (reversedTree[action] === undefined) {
            reversedTree[action] = {};
          }
          set(reversedTree[action], scope, subTree);
        });
      } else {
        set(reversedTree["*"], scope, subTree);
      }
    } else if (isValidNode(subTree)) {
      Object.entries(subTree).forEach(([key, node]) => {
        reverseTree(node, scope.length === 0 ? key : `${scope}.${key}`);
      });
    }
  }

  reverseTree(tree);

  /* if (isLeaf(tree)) {
    reversedTree["*"] = tree;
  }
*/

  function recursiveProcess(state, action, task) {
    if (isLeaf(task)) {
      if (action.type === initAction.type) {
        const newState = state === undefined ? task.default : state;
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
