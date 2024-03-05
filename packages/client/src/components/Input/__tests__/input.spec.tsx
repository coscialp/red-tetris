import Input from "../Input";
import { render } from "@testing-library/react";

describe("Input", () => {
  it("should render", () => {
    const input = render(<Input placeholder="Input" setter={() => {}}/>);
    expect(input).toBeDefined();
  });
});