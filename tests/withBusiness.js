import React from "react";
import { withBusiness } from "../src/index";

describe("withBusiness", () => {
  it("it doesn't throw exception", () => {
    withBusiness(<h1 />);
  });
});
