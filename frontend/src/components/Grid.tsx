interface GridProps {
  guesses: { letter: string; result: string }[][];
  currentGuess: string;
  wordLength: number;
}

const Grid = ({ guesses, currentGuess, wordLength }: GridProps) => {
  const totalRows = 6;
  const emptyRowsCount = Math.max(0, totalRows - guesses.length - 1);

  // Mappar dina resultat-strängar till rätt Tailwind-färger
  const getBgColor = (result: string) => {
    switch (result) {
      case "correct":
        return "bg-green-600 border-green-600 text-white";
      case "misplaced":
        return "bg-yellow-500 border-yellow-500 text-white";
      case "incorrect":
        return "bg-gray-500 border-gray-500 text-white";
      default:
        return "border-gray-300 text-black";
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-8">
      {/* 1. Gamla gissningar */}
      {guesses.map((row, i) => (
        <div key={i} className="flex gap-2 justify-center">
          {row.map((cell, j) => (
            <div
              key={j}
              className={`w-14 h-14 flex items-center justify-center border-2 text-2xl font-bold uppercase transition-colors duration-500 ${getBgColor(cell.result)}`}
            >
              {cell.letter}
            </div>
          ))}
        </div>
      ))}

      {/* 2. Aktiv rad (där du skriver nu) */}
      {guesses.length < totalRows && (
        <div className="flex gap-2 justify-center">
          {Array.from({ length: wordLength }).map((_, i) => (
            <div
              key={i}
              className={`w-14 h-14 flex items-center justify-center border-2 text-2xl font-bold uppercase ${currentGuess[i] ? "border-gray-800" : "border-gray-300"}`}
            >
              {currentGuess[i] || ""}
            </div>
          ))}
        </div>
      )}

      {/* 3. Framtida tomma rader */}
      {Array.from({ length: emptyRowsCount }).map((_, i) => (
        <div key={i} className="flex gap-2 justify-center">
          {Array.from({ length: wordLength }).map((_, j) => (
            <div key={j} className="w-14 h-14 border-2 border-gray-200"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
