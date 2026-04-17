import { useState } from "react";

interface GameOverViewProps {
  isWin: boolean;
  correctWord?: string;
  guessesCount: number;
  onRestart: () => void;
  duration?: number | null;
  wordLength: number;
  uniqueLetters: boolean;
}

export default function GameOverView({
  isWin,
  correctWord,
  guessesCount,
  onRestart,
  duration,
  wordLength,
  uniqueLetters,
}: GameOverViewProps) {
  const [userName, setUserName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const formatTime = (seconds?: number | null) => {
    if (seconds === undefined || seconds === null) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

const handleSubmit = async (e?: React.MouseEvent) => {
  if (e) e.preventDefault();
  if (!userName.trim()) {
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5080/api/highscores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userName,
        guesses: guessesCount,
        duration: duration,
        wordLength: wordLength,
        uniqueLetters: uniqueLetters,
      }),
    });
if (response.ok) {
  setSubmitted(true);
}

  } catch (error) {
    console.error("Nätverksfel vid sparning:", error);
  }
};

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white shadow-2xl rounded-2xl border-4 border-black max-w-sm w-full mx-auto mt-6 text-center animate-in fade-in zoom-in duration-300">
      <h2
        className={`text-4xl font-black mb-4 ${isWin ? "text-green-600" : "text-red-600"}`}
      >
        {isWin ? "FANTASTIC!" : "GAME OVER"}
      </h2>

      {isWin && !submitted ? (
        <div className="w-full mb-6 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <p className="text-xs font-bold uppercase mb-2 tracking-widest text-gray-500">
            New Highscore!
          </p>
          <input
            type="text"
            placeholder="ENTER NAME"
            className="w-full p-2 border-2 border-black rounded mb-2 text-center font-black uppercase focus:bg-yellow-50 outline-none"
            value={userName}
            onChange={(e) => setUserName(e.target.value.toUpperCase())}
            maxLength={15}
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition-colors text-sm"
          >
            SAVE MY SCORE
          </button>
        </div>
      ) : isWin && submitted ? (
        <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg font-bold animate-bounce">
          SCORE SAVED! 🏆
        </div>
      ) : null}

      <div className="text-gray-600 mb-8 font-medium">
        {isWin ? (
          <>
            <p>
              You guessed the word in{" "}
              <span className="text-black font-bold">{guessesCount}</span>{" "}
              tries.
            </p>

            {duration !== undefined && (
              <p className="mt-2">
                Time elapsed:{" "}
                <span className="text-black font-bold">
                  {formatTime(duration)}
                </span>
              </p>
            )}
          </>
        ) : (
          <div>
            <p>Better luck next time!</p>
            <p className="mt-2 uppercase text-xs tracking-widest text-gray-400">
              The word was:
            </p>
            <span className="block text-3xl font-black text-black tracking-[0.2em] mt-1 uppercase">
              {correctWord}
            </span>
            {duration !== undefined && (
              <p className="mt-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
                Duration: {formatTime(duration)}
              </p>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onRestart}
        className="w-full bg-black text-white py-4 rounded-xl font-black text-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95"
      >
        PLAY AGAIN
      </button>
    </div>
  );
}
