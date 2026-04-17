import { useState } from "react";

interface StartViewProps {
  onStart: (length: number, duplicates: boolean) => void;
}

export default function StartView({ onStart }: StartViewProps) {
  const [length, setLength] = useState(5);
  const [duplicates, setDuplicates] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white shadow-xl rounded-2xl border border-gray-100 max-w-sm w-full mx-auto mt-10">
      <h1 className="text-center text-4xl font-black mb-8 tracking-tighter text-gray-900">
        Christoffer's WORDLE
      </h1>

      <div className="w-full space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Word length
          </label>
          <select
            className="w-full p-3 border-2 border-gray-200 rounded-lg font-bold text-lg focus:outline-none focus:border-black transition-colors bg-white cursor-pointer"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          >
            <option value="4">4 letters</option>
            <option value="5">5 letters</option>
            <option value="6">6 letters</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
          <label
            className="font-medium text-gray-700 cursor-pointer select-none"
            htmlFor="dup-check"
          >
            Allow duplicate letters
          </label>
          <input
            id="dup-check"
            type="checkbox"
            className="w-6 h-6 accent-black cursor-pointer"
            checked={duplicates}
            onChange={(e) => setDuplicates(e.target.checked)}
          />
        </div>

        <button
          onClick={() => onStart(length, duplicates)}
          className="w-full bg-black text-white py-4 rounded-xl font-black text-xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg"
        >
          START NEW GAME
        </button>
      </div>

      <p className="mt-6 text-xs text-gray-400 font-medium uppercase tracking-widest">
        English Edition
      </p>
    </div>
  );
}

