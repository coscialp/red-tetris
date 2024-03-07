import { unmountComponentAtNode } from "react-dom";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../stores";
import Spectras from "../spectras/Spectras";

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
        <Spectras name="name" spectras={[]}/>
      </Provider>,
    );
    expect(input).toBeDefined();
  });
  it("should render spectra", () => {
    const input = render(
      <Provider store={store}>
        <Spectras name="name" spectras={[
{
            name: "name",
            map: [
              ["00000000", "00000000", "00000000", "00000000"],
              ["00000000", "#ffff50", "00000000", "00000000"],
              ["00000000", "00000000", "#ffff50", "00000000"],
              ["00000000", "00000000", "00000000", "00000000"],
            ],
          },
          {
            name: "name1",
            map: [
              ["00000000", "00000000", "00000000", "00000000"],
              ["00000000", "#ffff50", "00000000", "00000000"],
              ["00000000", "00000000", "#ffff50", "00000000"],
              ["00000000", "00000000", "00000000", "00000000"],
            ],
          },
        ]}/>
      </Provider>,
    );
    expect(input).toMatchSnapshot();
  });
});