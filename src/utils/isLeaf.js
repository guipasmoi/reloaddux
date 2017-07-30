function isActionsArray(actions) {
  return actions === undefined ||
    (Array.isArray(actions) &&
      actions.reduce(
        (accu, action) => accu && typeof action === "string",
        true
      ));
}

export default function isLeaf(node) {
  return node &&
    typeof node === "object" &&
    isActionsArray(node.actions) &&
    typeof node.reducer === "function";
}
