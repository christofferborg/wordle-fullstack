import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface Score {
  _id: string;
  name: string;
  guesses: number;
  duration: number;
  wordLength: number;
  uniqueLetters: boolean;
}

interface LeaderboardProps {
  limit?: number;
}

export default function Leaderboard({ limit }: LeaderboardProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  const { length, unique } = useParams();

  useEffect(() => {
    setLoading(true);

    const fetchUrl = limit
      ? "http://127.0.0.1:5080/api/highscores"
      : `http://127.0.0.1:5080/api/highscores/${length || "all"}/${unique || "all"}`;

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        setScores(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [length, unique, limit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading)
    return (
      <p className="text-center font-bold mt-10 uppercase tracking-widest animate-pulse">
        Loading scores...
      </p>
    );

  const displayedScores = limit ? scores.slice(0, limit) : scores;

  return (
    <div className="w-full max-w-md bg-white border-4 border-black p-6 rounded-2xl shadow-xl mt-4 transition-all">
      <h2 className="text-2xl font-black mb-4 text-center tracking-tighter italic uppercase">
        {limit ? `Top ${limit} Players` : "Highscores"}
      </h2>

      {displayedScores.length === 0 ? (
        <p className="text-center text-gray-400 uppercase text-sm italic py-4">
          No scores found for this filter
        </p>
      ) : (
        <div className="space-y-2">
          {displayedScores.map((score, index) => (
            <div
              key={score._id}
              className={`flex justify-between items-center p-3 rounded-lg border-2 ${
                index === 0 && !limit
                  ? "bg-yellow-50 border-yellow-400 scale-105 shadow-sm"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`font-black w-5 ${index === 0 ? "text-yellow-600" : "text-gray-400"}`}
                >
                  {index + 1}.
                </span>
                <span className="font-bold uppercase tracking-tight">
                  {score.name}
                </span>

                <div className="flex gap-1">
                  <span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded font-black">
                    {score.wordLength}L
                  </span>
                  {score.uniqueLetters ? (
                    <span
                      className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded font-black shadow-sm"
                      title="Unique Letters"
                    >
                      U
                    </span>
                  ) : (
                    <span
                      className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-black shadow-sm"
                      title="Duplicates Allowed"
                    >
                      D
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="font-black leading-none text-sm">
                  {score.guesses === 1 ? "1 GUESS" : `${score.guesses} GUESSES`}
                </div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                  Time: {formatTime(score.duration)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {limit && scores.length > limit && (
        <Link
          to="/highscore"
          className="block text-center mt-6 text-xs font-black underline uppercase hover:text-gray-600 transition-colors"
        >
          View Full Leaderboard
        </Link>
      )}
    </div>
  );
}
