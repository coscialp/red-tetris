import Input from "../Input";
import { act, fireEvent, render } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";

describe("Input", () => {
  let container: any = null;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it("should render", () => {
    const input = render(<Input placeholder="Input" setter={() => {
    }} />);
    expect(input).toBeDefined();
  });
  it("should match the snapshot", () => {
    const input = render(<Input placeholder="Input" setter={() => {
    }} />);
    expect(input).toMatchSnapshot();
  });
  it("should handle change", () => {
    const setter = jest.fn();
    act(() => {
      render(<Input placeholder="Input" setter={setter} />);
    });
    const input = document.querySelector(".input-basic");

    act(() => {
      input?.dispatchEvent(new InputEvent("change"));
      fireEvent.change(input!, { target: { value: "test" } });
    });
    expect(setter).toHaveBeenCalledTimes(1);
  });
});