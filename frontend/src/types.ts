export interface LetterResult {
  letter: string;
  result: "correct" | "misplaced" | "incorrect";
}

export interface GuessResponse {
  results: LetterResult[];
  error?: string;
}
