import fs from "fs";
import path from 'path'

const filePath = path.join(__dirname, '..', 'data', 'words.json');

const rawData = fs.readFileSync(filePath, "utf-8");
const dataObj: Record<string, any> = JSON.parse(rawData);
const allWords = Object.keys(dataObj);
const filteredWords: string[] = allWords.filter((word) => {
  const isCorrectLength = word.length >= 4 && word.length <= 8;
  const isOnlyLetters = /^[A-Za-z]+$/.test(word);
  return isCorrectLength && isOnlyLetters;
});

export default filteredWords;