import { render, screen, fireEvent } from "@testing-library/react";
import GameBoard from "./GameBoard";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  http.post("http://localhost:5080/api/games/start", () => {
    return HttpResponse.json({ id: "game-123" });
  }),

  http.post("http://localhost:5080/api/games/guess", () => {
    return HttpResponse.json({
      results: [
        { letter: "T", result: "correct" },
        { letter: "R", result: "correct" },
        { letter: "E", result: "correct" },
        { letter: "E", result: "correct" },
        { letter: "S", result: "correct" },
      ],
    });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const handleRestartMock = () => {};

describe("Gameboard", () => {
  const defaultProps = {
    gameId: "test-id",
    wordLength: 5,
    uniqueLetters: false,
    onRestart: vi.fn(),
  };
  it("should restart a new game ", async () => {
    render(<GameBoard {...defaultProps} />);
    const restartBtn = screen.getByRole("button", { name: /Give up/i });
    fireEvent.click(restartBtn);
    expect(defaultProps.onRestart).toHaveBeenCalled();
  });

  it("should display an input field for guesses", () => {
    render(<GameBoard {...defaultProps} />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("should display a button for submiting guesses", () => {
    render(<GameBoard {...defaultProps} />);
    const button = screen.getByRole("button", { name: /Guess/i });
    expect(button).toBeInTheDocument();
  });

  it("should display your guess on the screen", async () => {
    render(<GameBoard {...defaultProps} />);
    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /Guess/i });
    fireEvent.change(input, { target: { value: "TREES" } });
    fireEvent.click(button);
    expect(await screen.getByTestId("test")).toHaveTextContent("TREES");
  });
});
