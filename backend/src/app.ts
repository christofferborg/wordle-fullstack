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
  console.log('Request recieved:', req.body);
  const wordLength: number = req.body.length;
  const unique: boolean = req.body.unique;
  const selectedWord = wordPicker(filteredWords, wordLength, unique);

  if (!selectedWord) {
    return res.status(400).json("Inget ord matchar");
  } else {
    const newGame = new Game({ correctWord: selectedWord });
    const savedGame = await newGame.save();
    res.json({ id: savedGame._id });
  }
});

app.post("/api/games/guess", async (req, res) => {
  console.log("Guess route hit! ID:", req.body.id);
  
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
    const feedback = compareWords(guess, game.correctWord.toUpperCase());
    res.json({ results: feedback });
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ error: "Internal server error or invald ID format" });
  }
});

export default app;
