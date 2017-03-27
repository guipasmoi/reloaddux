import ReducerManager from "../src/ReducerManager";

const counter1 = (state = 11) => state + 1;
const counter2 = (state = 22) => state + 2;
const counter3 = (state = 33) => state + 3;

const reducersTree = {
  AwesomeStateForCounter1: {
    actions: ["ACTION1"],
    reducer: counter1
  }
};

const reducersTree1 = {
  counters: {
    AwesomeStateForCounter1: {
      actions: ["ACTION1"],
      reducer: counter1
    }
  }
};

const reducersTree2 = {
  counters: {
    AwesomeStateForCounter2: {
      reducer: counter2
    }
  }
};

const reducersTree3 = {
  counters: {
    Awesome: {
      StateFor: {
        Counter3: {
          actions: ["ACTION3"],
          reducer: counter3
        }
      }
    }
  }
};

describe("ReducerManager", () => {
  it("reducer do nothing if nothing is registered ", () => {
    const reducerManager = new ReducerManager();
    let initState;
    let state;
    initState = 1234;
    state = reducerManager.reducer(initState, { type: "toto" });
    expect(state).toBe(initState);
    initState = { a: { b: "a value" } };
    state = reducerManager.reducer(initState, { type: "toto" });
    expect(state).toBe(initState);
    initState = undefined;
    state = reducerManager.reducer(initState, { type: "toto" });
    expect(state).toBe(initState);
  });

  it("it can register a simple tree reducers", () => {
    const reducerManager = new ReducerManager();
    const initState = {};
    let state;
    reducerManager.addReducersTrees(reducersTree);
    state = reducerManager.reducer(initState, { type: "ACTION1" });
    expect(state.AwesomeStateForCounter1).toBe(12);
    state = reducerManager.reducer(state, { type: "ACTION1" });
    expect(state.AwesomeStateForCounter1).toBe(13);
  });

  it("it can register multiple tree reducers", () => {
    const reducerManager = new ReducerManager();
    const initState = undefined;
    let state;
    reducerManager.addReducersTrees(reducersTree1);
    reducerManager.addReducersTrees(reducersTree2);
    reducerManager.addReducersTrees(reducersTree3);
    state = reducerManager.reducer(initState, { type: "ACTION1" });
    expect(state).toMatchSnapshot();
    state = reducerManager.reducer(state, { type: "ACTION X" });
    expect(state).toMatchSnapshot();
    state = reducerManager.reducer(state, { type: "ACTION3" });
    expect(state).toMatchSnapshot();
  });

  it("it can unregister tree reducers", () => {
    const reducerManager = new ReducerManager();
    const initState = {};
    let state;

    reducerManager.addReducersTrees(
      reducersTree1,
      reducersTree2,
      reducersTree3
    );
    state = reducerManager.reducer(initState, { type: "ACTION1" });
    expect(state).toMatchSnapshot();
    reducerManager.removeReducersTrees(reducersTree1);
    state = reducerManager.reducer(state, { type: "ACTION1" });
    expect(state).toMatchSnapshot("should not have change after action 1");
  });
});
