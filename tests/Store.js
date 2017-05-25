import React, { Component } from "react";
import { put, take } from "redux-saga/effects";
import { connect, Store } from "../src/index";

const counter1 = state => state + 1;
const counter2 = state => state + 2;

const ACTION1 = "ACTION1";
const ACTION2 = "ACTION2";
const ACTION3 = "ACTION3";

const reducersTree1 = {
  AwesomeStateForCounter1: {
    actions: [ACTION1],
    reducer: counter1,
    default: 11
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

function* saga1() {
  yield take(ACTION3);
}

function* saga2() {
  yield take(ACTION3);
  yield put(action1("some data awesome"));
}

const business1 = {
  reducersTree: reducersTree1,
  sagasMap: {
    saga1: saga1()
  }
};

const business2 = {
  reducersTree: reducersTree2,
  sagasMap: {
    saga2: saga2()
  }
};

describe("Store", () => {
  it("it can create a store", () => {
    const store = new Store();
    expect(store).toMatchSnapshot();
  });

  it("it can create store and dispatch action", () => {
    // 1
    const store = new Store();
    store.dispatch({ type: ACTION1 });
    expect(store.getState()).toMatchSnapshot("1 action but no business");

    // 2
    // store.registerBusiness(business1);
    store.registerBusiness(business1);
    expect(store.getState()).toMatchSnapshot("2 register first business");

    // 3
    store.dispatch({ type: ACTION1 });
    expect(store.getState()).toMatchSnapshot("3 dispatch action");

    // 4
    store.registerBusiness(business2);
    expect(store.getState()).toMatchSnapshot("4 register second business");

    // 5
    store.dispatch({ type: ACTION1 });
    expect(store.getState()).toMatchSnapshot("5 dispatch action");

    // 6
    store.dispatch({ type: ACTION2 });
    expect(store.getState()).toMatchSnapshot("6 dispatch action 2");

    // 7
    store.dispatch({ type: ACTION3 });
    expect(store.getState()).toMatchSnapshot("7 dispatch action 2");
  });
});
