import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import StartView from "./components/StartView";
import GameBoard from "./components/GameBoard";
import Leaderboard from "./components/Leaderboard";
import Navbar from "./components/Navbar";
import About from "./components/About";
import ScoreFilter from "./components/ScoreFilter";

function App() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [wordLength, setWordLength] = useState(5);
  const [isUnique, setIsUnique] = useState(false);

  const handleStartGame = async (
    selectedLength: number,
    allowDuplicates: boolean,
  ) => {
    const isGameUnique = !allowDuplicates;

    setWordLength(selectedLength);
    setIsUnique(isGameUnique);

    try {
      const response = await fetch("http://127.0.0.1:5080/api/games/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          length: selectedLength,
          unique: isGameUnique,
        }),
      });

      const data = await response.json();
      setGameId(data.id);
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  return (
    <Router>
      <div className="app-container min-h-screen bg-gray-100 flex flex-col items-center">
        <Navbar />

        <div className="py-10 flex flex-col items-center w-full px-4">
          <Routes>
            <Route
              path="/"
              element={
                !gameId ? (
                  <>
                    <StartView onStart={handleStartGame} />
                    <Leaderboard limit={5} />
                  </>
                ) : (
                  <div className="game-screen w-full max-w-md flex flex-col items-center">
                    <h1 className="text-4xl font-black mb-8 tracking-tighter">
                      Christoffer's WORDLE
                    </h1>
                    <GameBoard
                      gameId={gameId}
                      wordLength={wordLength}
                      uniqueLetters={isUnique}
                      onRestart={() => setGameId(null)}
                    />
                  </div>
                )
              }
            />

            <Route
              path="/highscore/:length?/:unique?"
              element={
                <div className="flex flex-col items-center w-full">
                  <ScoreFilter />
                  <Leaderboard />
                </div>
              }
            />

            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
