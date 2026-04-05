const fs = require("fs");

const rawData = fs.readFileSync("./data/words.json", "utf-8");
const dataObj = JSON.parse(rawData);
const allWords = Object.keys(dataObj);
const filteredWords = allWords.filter((word) => {
  const isCorrectLength = word.length >= 4 && word.length <= 8;
  const isOnlyLetters = /^[A-Za-z]+$/.test(word);
  return isCorrectLength && isOnlyLetters;
});

module.exports = filteredWords;
