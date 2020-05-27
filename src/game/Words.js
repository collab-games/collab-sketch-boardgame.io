import {default as dictionaryWords} from "../words.json";
import random from "lodash/random";
import clone from "lodash/clone";

export const uniqueWordsFor = (numOfRounds, numOfPlayers) => {
  let allWords = process.env.WORDS ? JSON.parse(process.env.WORDS) : dictionaryWords;
  let count = (numOfRounds * numOfPlayers) > allWords.length ? allWords.length : numOfRounds * numOfPlayers;
  let uniqueNumbers = [];
  let uniqueWords = [];
  while(count > 0) {
    let index = random( allWords.length - 1);
    if(!(index in uniqueNumbers)) {
      uniqueWords.push(allWords[index]);
      uniqueNumbers.push(index);
      count--;
    }
  }
  return uniqueWords;
};

export const firstWord = words => words.split(' ').length === 2 ? words.split(' ')[0] : '';
export const secondWord = words => words.split(' ').length === 2 ? words.split(' ')[1] : '';

export const pickRandomWord = words => {
  const all = clone(words);
  const index = random(all.length - 1);
  return { selected: all[index], rest: all };
};

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

export const pickRandomWords = (gameWords) => {
  let pickedWords = [];
  let all = clone(gameWords);
  for ( let i = 0; i < 3; i++) {
    let { selected, rest } = pickRandomWord(all);
    pickedWords.push(selected)
    all = rest;
  }
  return { selected: pickedWords, rest: all };
};