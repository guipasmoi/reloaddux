import isPlainObject from "lodash/isPlainObject";

export default function isValidNode(node) {
  return isPlainObject(node);
}
