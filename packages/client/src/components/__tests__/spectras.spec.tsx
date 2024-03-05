import { unmountComponentAtNode } from "react-dom";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../stores";
import Spectras from "../spectras/Spectras.tsx";

describe("Spectras", () => {
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
    const input = render(
      <Provider store={store}>
        <Spectras name="name"/>
      </Provider>,
    );
    expect(input).toBeDefined();
  });
  it("should render next piece", () => {
    const input = render(
      <Provider store={store}>
        <Spectras name="name"/>
      </Provider>,
    );
    expect(input).toMatchSnapshot();
  });
});