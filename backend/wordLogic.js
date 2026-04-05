const compareWords = (guess, target) => {
  if (guess.length !== target.length) {
    throw new Error("Input must have same length as the target word");
  }
  const upperGuess = guess.toUpperCase();
  const upperTarget = target.toUpperCase();
  const targetLetters = upperTarget.split("");
  const output = [];
  for (let i = 0; i < upperGuess.length; i++) {
    const letterResult = {
      letter: upperGuess[i],
      result: "incorrect",
    };
    if (upperGuess[i] === upperTarget[i]) {
      targetLetters[i] = 0;
      letterResult.result = "correct";
    }

    output.push(letterResult);
  }

  for (let i = 0; i < upperGuess.length; i++) {
    const index = targetLetters.indexOf(upperGuess[i]);
    if (output[i].result === "correct") {
      continue;
    } else if (index > -1) {
      output[i].result = "misplaced";
      targetLetters[index] = 0;
    }
  }
  return output;
};

module.exports = compareWords;
