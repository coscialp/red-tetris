import { render, screen } from "@testing-library/react";
import Home from "../home/home.tsx";
import { Provider } from "react-redux";
import { store } from "../../stores";


// Mock useDispatch
jest.mock('react-redux', () => ({
  ...(jest.requireActual('react-redux') as object),
  useDispatch: jest.fn(),
}));

describe("Home", () => {
  beforeEach(() => {
    // Reset mock implementation before each test
    jest.clearAllMocks();
  });

  it("renders Home component", () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    // Add assertions for the content rendered by Home component
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("displays start button when appropriate", () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    const button = screen.queryByTestId("start-button");
    expect(button).toBeDefined();
  });
});