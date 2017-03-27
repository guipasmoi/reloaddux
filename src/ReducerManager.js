import merge from "lodash/merge";
import without from "lodash/without";
import uniq from "lodash/uniq";
import combineReducersTree from "./combineReducersTree";

export default class ReducerManager {
  scopeReducerMap = {};
  reducer = (state, action) => this.trueReducer(state, action);
  reducersTreeArray = [];
  trueReducer = state => state;

  addReducersTrees(...trees) {
    this.reducersTreeArray = uniq(this.reducersTreeArray.concat(trees));
    this.trueReducer = combineReducersTree(
      merge({}, ...this.reducersTreeArray)
    );
  }

  removeReducersTrees(...trees) {
    this.reducersTreeArray = without(this.reducersTreeArray, ...trees);
    this.trueReducer = combineReducersTree(
      merge({}, ...this.reducersTreeArray)
    );
  }
}
