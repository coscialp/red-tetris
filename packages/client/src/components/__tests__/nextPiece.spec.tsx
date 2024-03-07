import { unmountComponentAtNode } from "react-dom";
// @ts-ignore
import configureStore from "redux-mock-store";
import { render } from "@testing-library/react";
import NextPiece from "../nextPiece/nextPiece";
import { Provider } from "react-redux";

// Mocking react-redux and redux store
const mockStore = configureStore([]);

describe("NextPiece", () => {
  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container!);
    container!.remove();
    container = null;
  });

  it("should render", () => {
    const nextPiece = render(
      <Provider store={mockStore({})}>
        <NextPiece nextPiece={[]} />
      </Provider>,
    );
    expect(nextPiece).toBeDefined();
  });
  it("should render next piece", () => {
    const nextPiece = render(
      <Provider store={mockStore({})}>
        <NextPiece nextPiece={[
          ["00000000", "00000000", "00000000", "00000000"],
          ["00000000", "#ffff50", "00000000", "00000000"],
          ["00000000", "00000000", "#ffff50", "00000000"],
          ["00000000", "00000000", "00000000", "00000000"],
        ]} />
      </Provider>,
    );
    expect(nextPiece).toMatchSnapshot();
  });
});