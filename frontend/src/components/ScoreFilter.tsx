import { useNavigate, useParams } from "react-router-dom";

export default function ScoreFilter() {
  const navigate = useNavigate();
  const { length = "all", unique = "all" } = useParams();

  const lengths = ["all", "4", "5", "6"];

  return (
    <div className="flex flex-col gap-4 mb-8 p-4 bg-gray-50 border-2 border-black rounded-xl w-full max-w-md">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-black uppercase w-full mb-1">
          Word Length:
        </span>
        {lengths.map((l) => (
          <button
            key={l}
            onClick={() => navigate(`/highscore/${l}/${unique}`)}
            className={`px-4 py-1 rounded-full text-xs font-bold border-2 border-black transition-all ${
              length === l
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-200"
            }`}
          >
            {l === "all" ? "ANY" : l}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-black uppercase w-full mb-1 text-left">
          Mode:
        </span>
        <button
          onClick={() => navigate(`/highscore/${length}/all`)}
          className={`px-4 py-1 rounded-full text-xs font-bold border-2 border-black ${
            unique === "all" ? "bg-black text-white" : "bg-white"
          }`}
        >
          All
        </button>
        <button
          onClick={() => navigate(`/highscore/${length}/unique`)}
          className={`px-4 py-1 rounded-full text-xs font-bold border-2 border-black ${
            unique === "unique" ? "bg-black text-white" : "bg-white"
          }`}
        >
          Unique Letters Only
        </button>
        <button
          onClick={() => navigate(`/highscore/${length}/nonunique`)}
          className={`px-4 py-1 rounded-full text-xs font-bold border-2 border-black ${
            unique === "nonunique" ? "bg-black text-white" : "bg-white"
          }`}
        >
          With Duplicates
        </button>
      </div>
    </div>
  );
}
