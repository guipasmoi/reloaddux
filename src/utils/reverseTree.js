import set from "lodash/set";
import isLeaf from "./isLeaf";
import isValidNode from "./isValidNode";

const defaultReversedTree = {
  "*": {}
};

export default function reverseTree(tree) {
  if (isLeaf(tree)) {
    return {
      "*": tree
    };
  }
  const reversedTree = defaultReversedTree;

  function reverseTreeRec(subTree, scope = "") {
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
        reverseTreeRec(node, scope.length === 0 ? key : `${scope}.${key}`);
      });
    }
    return reversedTree;
  }

  return reverseTreeRec(tree);
}
