import { useState, useRef, useEffect } from "react";
import type { LetterResult } from "../types";
import Grid from "./Grid";
import GameOverView from "./GameOverView";

interface GameBoardProps {
  gameId: string;
  wordLength: number;
  uniqueLetters: boolean;
  onRestart: () => void;
}

function GameBoard({ gameId, wordLength, uniqueLetters, onRestart }: GameBoardProps) {
  const [inputValue, setInputValue] = useState("");
  const [guesses, setGuesses] = useState<LetterResult[][]>([]);
  const [gameState, setGameState] = useState({ isOver: false, isWin: false });
  const [duration, setDuration] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => inputRef.current?.focus();

  useEffect(() => {
    focusInput();
  }, []);
  const [correctWord, setCorrectWord] = useState<string>("");

  const handleGuess = async () => {
    if (inputValue.length !== wordLength || gameState.isOver) return;

    try {
      const response = await fetch("http://127.0.0.1:5080/api/games/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: gameId, guess: inputValue }),
      });

      if (response.ok) {
        const data = await response.json();

        const newGuesses = [...guesses, data.results];
        setGuesses(newGuesses);
        setInputValue("");

        if (data.isFinished) {
          const hasWon = data.results.every((r: any) => r.result === "correct");

          setCorrectWord(data.correctWord);
          setDuration(data.duration);
          setGameState({ isOver: true, isWin: hasWon });
        } else {
          setTimeout(focusInput, 0);
        }
      }
    } catch (error) {
      console.error("Guess error:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.length === wordLength) {
      handleGuess();
    }
  };

  if (gameState.isOver) {
    return (
      <div className="flex flex-col items-center w-full">
        <Grid guesses={guesses} currentGuess="" wordLength={wordLength} />
        <GameOverView
          isWin={gameState.isWin}
          guessesCount={guesses.length}
          onRestart={onRestart}
          correctWord={correctWord}
          duration={duration ?? null}
          uniqueLetters={uniqueLetters}
          wordLength={wordLength}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center py-4">
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
        <button
          onClick={onRestart}
          className="cursor-pointer mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-red-600 transition-colors"
        >
          Give up and start new game?
        </button>
      </div>
    </div>
  );
}

export default GameBoard;
