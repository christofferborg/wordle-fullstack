import { describe, test, expect } from "@jest/globals";
import compareWords from "../src/wordLogic";

test("should return correct for the word HEJ", () => {
  let expectedOutput = [
    { letter: "H", result: "correct" },
    { letter: "E", result: "correct" },
    { letter: "J", result: "correct" },
  ];
  expect(compareWords("HEJ", "HEJ")).toEqual(expectedOutput);
});

test("should return incorrect for the word HEJ when guessing BIL", () => {
  let expectedOutput = [
    { letter: "B", result: "incorrect" },
    { letter: "I", result: "incorrect" },
    { letter: "L", result: "incorrect" },
  ];
  expect(compareWords("BIL", "HEJ")).toEqual(expectedOutput);
});

test("should always return output in uppercase letters", () => {
  let expectedOutput = [
    { letter: "H", result: "correct" },
    { letter: "E", result: "correct" },
    { letter: "J", result: "correct" },
  ];
  expect(compareWords("hej", "HEJ")).toEqual(expectedOutput);
});

test("should return error if input has a different length", () => {
  expect(() => {
    compareWords("hejsan", "radio");
  }).toThrow("Input must have same length as the target word");
});

test("should return misplaced for correct letter in the wrong place", () => {
  let expectedOutput = [
    { letter: "A", result: "misplaced" },
    { letter: "L", result: "misplaced" },
    { letter: "B", result: "incorrect" },
    { letter: "U", result: "incorrect" },
    { letter: "M", result: "incorrect" },
  ];
  expect(compareWords("ALBUM", "CYKLA")).toEqual(expectedOutput);
});

test("should return misplaced for only the first occurrence of a letter if target has fewer instances", () => {
  let expectedOutput = [
    { letter: "H", result: "incorrect" },
    { letter: "A", result: "misplaced" },
    { letter: "L", result: "incorrect" },
    { letter: "L", result: "correct" },
    { letter: "Å", result: "incorrect" },
  ];
  expect(compareWords("HALLÅ", "CYKLA")).toEqual(expectedOutput);
});

describe("compareWords logic", () => {
  test("should handle a perfect match (all correct)", () => {
    const result = compareWords("CYKLA", "CYKLA");
    result.forEach((res) => {
      expect(res.result).toBe("correct");
    });
  });

  test("should handle misplaced letters", () => {
    const result = compareWords("ALPEN", "PAPPA");
    // Här kan vi testa specifika index för att se att din logik
    // med 0-markeringen (targetLetters[i] = 0) fungerar
    expect(result[0].letter).toBe("A");
    expect(result[0].result).toBe("misplaced");
  });

  test("should throw error if lengths do not match", () => {
    expect(() => compareWords("HEJ", "HEJSAN")).toThrow();
  });
});