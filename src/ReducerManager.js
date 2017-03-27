import merge from "lodash/merge";
import without from "lodash/without";
import uniq from "lodash/uniq";
import combineReducersTree from "./combineReducersTree";

export default class ReducerManager {
  scopeReducerMap = {};
  reducer = (state, action) => this.trueReducer(state, action);
  reducersTreeArray = [];
  trueReducer = (state, action) => state;

  addReducersTree(...trees) {
    this.reducersTreeArray = uniq(this.reducersTreeArray.concat(trees));
    this.trueReducer = combineReducersTree(
      merge({}, ...this.reducersTreeArray)
    );
  }

  removeReducersTree(...trees) {
    this.reducersTreeArray = without(this.reducersTreeArray, ...trees);
    this.trueReducer = combineReducersTree(
      merge({}, ...this.reducersTreeArray)
    );
  }
}
