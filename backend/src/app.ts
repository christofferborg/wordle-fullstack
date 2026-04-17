import express, { Request, Response } from "express";
import mongoose, { Schema, Document } from "mongoose";
import cors from "cors";
import filteredWords from "./wordService";
import wordPicker from "./wordPicker";
import compareWords from "./wordLogic";

interface IGame {
  correctWord: String;
  guesses: string[];
  startTime: Date;
  isFinished: Boolean;
}

const gameSchema = new Schema<IGame>({
  correctWord: { type: String, required: true },
  guesses: { type: [String], default: [] },
  startTime: { type: Date, default: Date.now },
  isFinished: { type: Boolean, default: false },
});

export const Game = mongoose.model<IGame>("Game", gameSchema);

const app = express();

app.use(cors());
app.use(express.json());

interface IWord extends Document {
  text: string;
}

const wordSchema = new Schema<IWord>({
  text: { type: String, required: true },
});

export const Word = mongoose.model<IWord>("Word", wordSchema);

app.post("/api/words", async (req, res) => {
  const newWord = new Word({ text: req.body.text });
  await newWord.save();
  res.json(newWord);
});

app.get("/api/words/random", (req, res) => {
  const lengthStr = req.query.length as string;
  const uniqueStr = req.query.unique as string;

  const length = parseInt(lengthStr);
  const unique = uniqueStr === "true";
  const randomWord = wordPicker(filteredWords, length, unique);
  if (randomWord) {
    return res.json({ word: randomWord });
  } else res.status(404).json({ error: "No matching words." });
});

app.post("/api/games/start", async (req, res) => {
  const wordLength: number = req.body.length;
  const unique: boolean = req.body.unique;
  const selectedWord = wordPicker(filteredWords, wordLength, unique);
console.log("DEBUG: Secret word for this game is:", selectedWord);
  if (!selectedWord) {
    return res.status(400).json("Inget ord matchar");
  } else {
    const newGame = new Game({ correctWord: selectedWord });
    const savedGame = await newGame.save();
    res.json({ id: savedGame._id });
  }
});

app.post("/api/games/guess", async (req, res) => {
  try {
    const id = req.body.id;
    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({ error: "Could not find game" });
    }
    if (game.isFinished) {
      return res.status(400).json({ error: "Game is already finished" });
    }

    const guess = (req.body.guess as string).toUpperCase();
    if (!guess) {
      return res.status(400).json({ error: "Guess is required" });
    }

    game.guesses.push(guess);

    if (guess === game.correctWord.toUpperCase() || game.guesses.length >= 6) {
      game.isFinished = true;
    }

    await game.save();
    let durationSeconds = 0;
    if (game.isFinished) {
      const endTime = new Date();
      durationSeconds = Math.round(
        (endTime.getTime() - game.startTime.getTime()) / 1000,
      );
    }

    const feedback = compareWords(guess, game.correctWord.toUpperCase());

    res.json({
      results: feedback,
      isFinished: game.isFinished,
      correctWord: game.isFinished ? game.correctWord.toUpperCase() : undefined,
      duration: game.isFinished ? durationSeconds : undefined
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

interface IHighscore {
  name: string;
  guesses: number;
  duration: number;
  wordLength: number;
  uniqueLetters: boolean;
  timestamp: Date;
}

const highscoreSchema = new Schema<IHighscore>({
  name: { type: String, required: true },
  guesses: { type: Number, required: true },
  duration: { type: Number, required: true },
  wordLength: { type: Number, required: true },
  uniqueLetters: { type: Boolean, required: true }, 
  timestamp: { type: Date, default: Date.now },
});

export const Highscore = mongoose.model<IHighscore>(
  "Highscore",
  highscoreSchema,
);

app.post("/api/highscores", async (req, res) => {
  try {
    const { name, guesses, duration, wordLength, uniqueLetters } = req.body;
    const newEntry = new Highscore({ name, guesses, duration, wordLength, uniqueLetters });
    await newEntry.save();
    res.json(newEntry);
  } catch (error) {
    res.status(500).json({ error: "Failed to save highscore" });
  }
});

app.get("/api/highscores", async (req, res) => {
  try {
    const topScores = await Highscore.find()
      .sort({ guesses: 1, duration: 1 }) 
      .limit(10);
    
    res.json(topScores);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});


app.get("/api/highscores/:length/:unique", async (req, res) => {
  try {
    const { length, unique } = req.params;
    let query: any = {};
    if (length !== "all") {
      query.wordLength = parseInt(length);
    }
    if (unique === "unique") {
      query.uniqueLetters = true;
    } else if (unique === "nonunique") {
      query.uniqueLetters = false;
    }

    const scores = await Highscore.find(query).sort({ duration: 1 }).limit(20);

    res.json(scores);
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({ error: "Failed to fetch filtered scores" });
  }
});


export default app;
