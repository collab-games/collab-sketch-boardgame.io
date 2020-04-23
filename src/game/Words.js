import {default as dictionaryWords} from "../words.json";
import random from "lodash/random";
import clone from "lodash/clone";

export const uniqueWordsFor = (numOfRounds, numOfPlayers) => {
  let count = (numOfRounds * numOfPlayers) > dictionaryWords.length ? dictionaryWords.length : numOfRounds * numOfPlayers;
  let uniqueNumbers = [];
  let uniqueWords = [];
  while(count > 0) {
    let index = random( dictionaryWords.length - 1);
    if(!(index in uniqueNumbers)) {
      uniqueWords.push(dictionaryWords[index]);
      uniqueNumbers.push(index);
      count--;
    }
  }
  return uniqueWords;
};

export const firstWord = words => words.split(' ').length === 2 ? words.split(' ')[0] : '';
export const secondWord = words => words.split(' ').length === 2 ? words.split(' ')[1] : '';

export const nextWordsFrom = (gameWords) => {
  const allWords = clone(gameWords);
  const index = random(allWords.length - 1);
  const currentWords = allWords.splice(index, 1)[0];
  return {
    allWords,
    currentWords,
    firstWordLength: firstWord(currentWords).length,
    secondWordLength: secondWord(currentWords).length,
  };
}