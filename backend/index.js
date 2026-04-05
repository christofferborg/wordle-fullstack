const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const filteredWords = require("./wordService.js");
const wordPicker = require("./wordPicker.js");

const app = express();
const PORT = 5080;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/wordleDB")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Servern körs på http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err.message);
  });

const Word = mongoose.model("Word", { text: String });

app.post("/api/words", async (req, res) => {
  const newWord = new Word({ text: req.body.text });
  await newWord.save();
  res.json(newWord);
});

app.get("/api/words/random", (req, res) => {
  const length = parseInt(req.query.length);
  const unique = req.query.unique === "true";
  const randomWord = wordPicker(filteredWords, length, unique);
  if (randomWord) {
    return res.json({ word: randomWord });
  } else res.status(404).json({ error: "No matching words." });
});

const testWord = wordPicker(filteredWords, 9, true);
console.log(testWord)
