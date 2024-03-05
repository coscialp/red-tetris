import { unmountComponentAtNode } from "react-dom";
// @ts-ignore
import configureStore from "redux-mock-store";
import { render } from "@testing-library/react";
import NextPiece from "../nextPiece/nextPiece.tsx";
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
    render(
      <Provider store={mockStore({})}>
        <NextPiece />
      </Provider>,
    );
  });
});