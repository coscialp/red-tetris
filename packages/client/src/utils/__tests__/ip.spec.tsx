/**
 * @jest-environment node
 */
import { BACK_URL } from "../ip";

describe("ip", () => {
  it("should return the ip", () => {
    expect(BACK_URL).toBeDefined();
  });
});