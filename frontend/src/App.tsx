import { useState } from "react";
import "./App.css";
import StartView from "./components/StartView";
import GameBoard from "./components/GameBoard";

function App() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [wordLength, setWordLength] = useState(5);

  const handleStartGame = async (
    selectedLength: number,
    allowDuplicates: boolean,
  ) => {
    setWordLength(selectedLength);
    try {
      const response = await fetch("http://127.0.0.1:5080/api/games/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          length: selectedLength,
          unique: allowDuplicates,
        }),
      });

      const data = await response.json();
      setGameId(data.id);
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  return (
    <div className="app-container min-h-screen bg-gray-50 flex flex-col items-center py-10">
      {!gameId ? (
        <StartView onStart={handleStartGame} />
      ) : (
        <div className="game-screen w-full max-w-md flex flex-col items-center">
          <h1 className="text-3xl font-black mb-8 tracking-tighter">Christoffer's WORDLE</h1>
          <GameBoard gameId={gameId} wordLength={wordLength} />
        </div>
      )}
    </div>
  );
}

export default App;
