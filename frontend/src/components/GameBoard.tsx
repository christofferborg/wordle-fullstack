import { useState, useRef, useEffect } from "react";
import type { LetterResult } from "../types";
import Grid from "./Grid";

interface GameBoardProps {
  gameId: string;
  wordLength: number;
}

function GameBoard({ gameId, wordLength }: GameBoardProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [guesses, setGuesses] = useState<LetterResult[][]>([]);

  // Referens för att styra fokus till inputfältet
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Fokusera automatiskt när komponenten laddas in
  useEffect(() => {
    focusInput();
  }, []);

  // Hantera själva gissningen mot backend
  const handleGuess = async () => {
    if (inputValue.length !== wordLength) return;

    try {
      const response = await fetch("http://127.0.0.1:5080/api/games/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: gameId, guess: inputValue }),
      });

      if (response.ok) {
        const data = await response.json();
        // Spara den nya gissningen i listan
        setGuesses([...guesses, data.results]);
        // Töm inputfältet
        setInputValue("");
        // Ge tillbaka fokus till fältet efter en mikropaus
        setTimeout(focusInput, 0);
      }
    } catch (error) {
      console.error("Error making guess:", error);
    }
  };

  // Lyssna efter Enter-tryck i fältet
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.length === wordLength) {
      handleGuess();
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-4">
      {/* Rutnätet med alla gissningar */}
      <Grid
        guesses={guesses}
        currentGuess={inputValue}
        wordLength={wordLength}
      />

      <div className="mt-8 flex flex-col gap-4 w-full max-w-xs px-4">
        <input
          ref={inputRef}
          onKeyDown={handleKeyDown}
          className="w-full border-2 border-gray-400 p-3 rounded text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:border-black uppercase shadow-sm"
          value={inputValue}
          onChange={(e) =>
            setInputValue(e.target.value.toUpperCase().slice(0, wordLength))
          }
          maxLength={wordLength}
          placeholder=""
        />

        <button
          className={`py-3 rounded font-bold text-lg transition-all ${
            inputValue.length === wordLength
              ? "bg-black text-white hover:bg-gray-800 cursor-pointer shadow-md"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          onClick={handleGuess}
          disabled={inputValue.length !== wordLength}
        >
          GUESS
        </button>
      </div>
    </div>
  );
}

export default GameBoard;
