import { Link } from "react-router-dom"; // 1. VIKTIGT: Importera Link

export default function Navbar() {
  return (
    <nav className="w-full bg-black text-white p-4 flex justify-center gap-8 font-black uppercase tracking-widest text-sm shadow-md">
      <Link
        to="/"
        className="hover:text-green-400 transition-colors cursor-pointer"
      >
        Play
      </Link>

      <Link
        to="/highscore"
        className="hover:text-green-400 transition-colors cursor-pointer"
      >
        Highscore
      </Link>

      <Link
        to="/about"
        className="hover:text-green-400 transition-colors cursor-pointer"
      >
        About
      </Link>
    </nav>
  );
}
