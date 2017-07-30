import isLeaf from "./isLeaf";
import merge from "lodash/merge";
import set from "lodash/set";

export default function reverseTree(subTree, scope = "") {
  const reversedTree = "";
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
