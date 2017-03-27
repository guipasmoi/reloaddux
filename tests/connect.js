/* eslint-disable*/
import { put } from "redux-saga";

import React from "react";
import { connect } from "../src/index";

const counter1 = (state = 11) => state + 1;

const reducersTree = {
  AwesomeStateForCounter1: {
    actions: ["ACTION1"],
    reducer: counter1
  }
};

function action1(param) {
  return { type: "ACTION1", param };
}

function* saga() {
  yield put(action1("some data"));
}

const business = {
  reducerTrees: [reducersTree],
  sagas: [saga],
  mapStateToProps: undefined,
  mapDispatchToProps: { action1 }
};

describe("connect", () => {
  it("it doesn't throw exception", () => {
    //   const store = new Store();
    //
    //   const H1Connected = connect(<h1 />);
    //   <Provider store={store}>
    //     <H1WithBusiness />
    //   </Provider>;
  });
});
