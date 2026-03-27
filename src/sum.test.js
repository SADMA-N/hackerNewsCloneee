import { describe, it, expect } from "vitest";

function sum(a, b) {
  return a + b;
}

describe("sum function", () => {
  it("should add two numbers", () => {
    expect(sum(2, 3)).toBe(5);
  });
});
