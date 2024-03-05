import { act, fireEvent, render, screen } from "@testing-library/react";
import Tetris from "../tetris"; // Update the path accordingly
import { Provider } from "react-redux";
// @ts-ignore
import configureStore from "redux-mock-store";
import { SocketActionTypes } from "../../middlewares/socket";

const mockStore = configureStore([]);

describe("Tetris Component", () => {
  it("renders waiting message when grid is empty", () => {
    const store = mockStore({
      rootReducer: {
        me: "player1",
        owner: "player2",
        isPlaying: false,
      },
    });

    render(
      <Provider store={store}>
        <Tetris me="player1" owner="player2" isPlaying={false} />
      </Provider>,
    );

    expect(screen.getByText(/Waiting for the owner to start the game.../i)).toBeDefined();
  });

  it("renders start message when grid is empty and user is the owner", () => {
    const store = mockStore({
      rootReducer: {
        me: "player1",
        owner: "player1",
        isPlaying: false,
      },
    });

    render(
      <Provider store={store}>
        <Tetris me="player1" owner="player1" isPlaying={false} />
      </Provider>,
    );

    expect(screen.getByText(/Press Start to launch the game/i)).toBeDefined();
  });

  it("renders board when grid is not empty", async () => {
    const store = mockStore({
      rootReducer: {
        me: "player1",
        owner: "player1",
        isPlaying: true,
      },
    });

    const mockGrid = [
      ["00000000", "FF0000FF", "00FF00FF"],
      ["00000000", "00FF00FF", "FF0000FF"],
    ];

    //@ts-ignore
    let tetris = null;
    act(() => {
      tetris = render(
        <Provider store={store}>
          <Tetris me="player1" owner="player1" isPlaying={true} />
        </Provider>,
      );
    });

    // Mock the 'previewBoard' event
    fireEvent(
      window,
      new MessageEvent("previewBoard", {
        data: JSON.stringify({
          event: SocketActionTypes.ON,
          data: { board: mockGrid },
        }),
      }),
    );

    tetris!.board = mockGrid;

    // Use 'container' to check the rendered structure
    expect(tetris!.container).toMatchSnapshot();
  });
});