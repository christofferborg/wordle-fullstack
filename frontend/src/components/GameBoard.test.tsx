import { render, screen, fireEvent } from "@testing-library/react";
import Field from "./GameBoard";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  http.post("http://localhost:5080/api/games/start", () => {
    return HttpResponse.json({ id: "game-123" });
  }),

  http.post("http://localhost:5080/api/words/guess", () => {
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

describe("Field", () => {
  it("should start a new game ", async () => {
    render(<Field />);
    const combobox = screen.getByRole("combobox");
    const checkbox = screen.getByRole("checkbox");
    const start = screen.getByRole("button", { name: /Start/i });
    fireEvent.click(start);
    expect(await screen.findByText("Guess the word"));
  });

  /*     it("should display an input field for guesses", () => {
    render(<Field />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("should display a button for submiting guesses", () => {
    render(<Field />);
    const button = screen.getByRole("button", { name: /Guess/i });
    expect(button).toBeInTheDocument();
  }); */

  /* it("should display your guess on the screen", async () => {
    render(<Field />);
    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /Guess/i });
    fireEvent.change(input, { target: { value: "TREES" } });
    fireEvent.click(button);
    expect(await screen.findByText("TREES")).toBeInTheDocument();
  }); */
});
