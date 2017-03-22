// import React from 'react';
import { Store } from "../src/index";

describe("Store", () => {
  it("it can create a store", () => {
    const store = new Store();
    expect(store).toMatchSnapshot();
  });
});
