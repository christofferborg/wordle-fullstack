interface LetterResult {
  letter: string;
  result: 'correct' | 'misplaced' | 'incorrect';
}

const compareWords = (guess: string, target: string): LetterResult[] => {
  if (guess.length !== target.length) {
    throw new Error("Input must have same length as the target word");
  }
  const upperGuess = guess.toUpperCase();
  const upperTarget = target.toUpperCase();
  const targetLetters: (string | number)[] = upperTarget.split("");

  const output: LetterResult[] = [];
  for (let i = 0; i < upperGuess.length; i++) {
    const letterResult: LetterResult = {
      letter: upperGuess[i] as string,
      result: "incorrect",
    };
    if (upperGuess[i] === upperTarget[i]) {
      targetLetters[i] = 0;
      letterResult.result = "correct";
    }

    output.push(letterResult);
  }

  for (let i = 0; i < upperGuess.length; i++) {
    const currentLetter = upperGuess[i] as string;
    const index = targetLetters.indexOf(currentLetter);
    if (output[i].result === "correct") {
      continue;
    } else if (index > -1) {
      output[i].result = "misplaced";
      targetLetters[index] = 0;
    }
  }
  return output;
};

export default compareWords;
