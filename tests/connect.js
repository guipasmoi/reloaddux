/* eslint-disable*/
import React, { Component } from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import { Provider } from "react-redux";
import { put } from "redux-saga/effects";
import { connect, Store } from "../src/index";
import { jsdom } from "jsdom";

global.document = jsdom("<!doctype html><html><body></body></html>");
global.window = document.defaultView;
global.navigator = global.window.navigator;

const counter1 = (state = 11) => state + 1;

const reducersTree = {
  AwesomeStateForCounter1: {
    actions: ["ACTION1"],
    reducer: counter1
  }
};

class App extends Component {
  render() {
    const { children, setLocation } = this.props;

    /* eslint-disable react/jsx-no-bind */
    return (
      <div>
        <a href="#">A</a>
        <a href="#">B</a>
      </div>
    );
  }

  /* eslint-enable react/jsx-no-bind */
}

function action1(param) {
  return { type: "ACTION1", param };
}

function* saga() {
  yield put(action1("some data"));
}

const business = {
  reducersTrees: [reducersTree],
  sagas: [saga],
  mapStateToProps: state => state,
  mapDispatchToProps: { action1 }
};

describe("connect", () => {
  it("provider should provide a store to connected component", () => {
    const store = new Store();
    //const business = { mapStateToProps: state => state };

    const AppWithBusiness = connect(business)(App);
    //const AppWithBusiness = connector(App);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <AppWithBusiness pass="through" />
      </Provider>
    );
    const appWithBusiness = TestUtils.findRenderedComponentWithType(
      tree,
      AppWithBusiness
    );

    expect(appWithBusiness.context.store).toBe(store);
  });

  it("should subscribe before mounting and unsubscribe unmounting", () => {
    const store = new Store();
    const AppWithBusiness = connect(business)(App);
    const spyRegister = jest.spyOn(store, "registerBusiness");
    const spyUnregister = jest.spyOn(store, "unregisterBusiness");

    //const AppWithBusiness = connector(App);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <AppWithBusiness pass="through" />
      </Provider>
    );
    const appWithBusiness = TestUtils.findRenderedComponentWithType(
      tree,
      AppWithBusiness
    );

    expect(spyRegister).toHaveBeenCalledTimes(1);
    expect(spyUnregister).toHaveBeenCalledTimes(0);
    ReactDOM.unmountComponentAtNode(appWithBusiness);
    expect(spyRegister).toHaveBeenCalledTimes(1);
    expect(spyUnregister).toHaveBeenCalledTimes(1);
  });
});
