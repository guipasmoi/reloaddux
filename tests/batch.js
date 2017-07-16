import React, { Component } from "react";
import { put, takeEvery, take } from "redux-saga/effects";
import { connect, Store, createBatch } from "../src/index";

const counter1 = (state, action) => [...state, action];
const counter2 = (state, action) => [...state, action];

const ACTION1 = "ACTION1";
const ACTION2 = "ACTION2";
const ACTION3 = "ACTION3";

const reducersTree1 = {
  AwesomeStateForCounter1: {
    reducer: counter1,
    default: []
  }
};

const reducersTree2 = {
  Awesome: {
    StateForCounter2: {
      actions: [ACTION2],
      reducer: counter2,
      default: 12
    }
  }
};

function action1(param) {
  return { type: ACTION1, param };
}

function* saga1(doSomething) {
  yield takeEvery("*", doSomething);
}

function* saga2() {
  yield take(ACTION3);
  yield put(action1("some data awesome"));
}

const business1 = doSomething => ({
  reducersTree: reducersTree1,
  sagasMap: {
    saga1: saga1(doSomething)
  }
});

const business2 = {
  reducersTree: reducersTree2,
  sagasMap: {
    saga2
  }
};

describe("Store", () => {
  it("it can batch action", () => {
    const store = new Store();

    const takeOnSaga = [];
    store.registerBusiness(
      business1(action => {
        takeOnSaga.push(action.type);
      })
    );
    expect(store.getState()).toMatchSnapshot("2 register first business");

    const actionX2 = createBatch(
      "ACTION1X2",
      { type: ACTION1 },
      { type: ACTION1 }
    );
    // 3 BIS
    store.dispatch(createBatch("ACTION1X2X2", actionX2, actionX2));
    expect(takeOnSaga).toMatchSnapshot();
    expect(store.getState()).toMatchSnapshot();
  });
});
