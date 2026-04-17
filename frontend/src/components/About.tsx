// src/components/About.tsx
export default function About() {
  return (
    <div className="max-w-2xl bg-white border-4 border-black p-8 rounded-2xl shadow-xl mt-10">
      <h1 className="text-3xl font-black mb-4 uppercase">About the Project</h1>
      <p className="mb-4 font-medium text-gray-700">
        This is a Fullstack Wordle clone built as a school project. The game
        uses a Node.js backend for game logic to prevent cheating.
      </p>
      <ul className="list-disc ml-5 space-y-2 font-bold">
        <li>React & TypeScript in Frontend</li>
        <li>Node.js & Express in Backend</li>
        <li>MongoDB for Highscore storage</li>
      </ul>
    </div>
  );
}
