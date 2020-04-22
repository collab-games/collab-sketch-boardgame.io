import {GameState} from '../constants'
import isEmpty from 'lodash/isEmpty';
import random from 'lodash/random';
import clone from 'lodash/clone';
import { ActivePlayers } from "boardgame.io/dist/esm/core";
import { endTurn, guessArt, startGame, updateSnapshotForCanvasOne, updateSnapshotForCanvasTwo, joinGame } from "./Moves";
import { default as dictionaryWords } from '../words.json';
import { firstCanvasPlayerIdFrom, secondCanvasPlayerIdFrom, nextActivePlayersFrom, updatePlayers } from "./Player";

const uniqueWordsFor = (numOfRounds, numOfPlayers) => {
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

const initTurn = (G) => {
  let allWords = clone(G.words.all);
  const index = random(allWords.length - 1);
  const currentWords = allWords.splice(index,1)[0];
  const wordLengths = currentWords.split(' ').length === 2 ? currentWords.split(' ').map(word => word.length) : [0,0];

  return {
    words: {
      all: allWords,
      current: currentWords,
    },
    turn: {
      startTime: Date.now()
    },
    canvasOne: { snapshot: {}, svg: "", chars: wordLengths[0] },
    canvasTwo: { snapshot: {}, svg: "", chars: wordLengths[1] },
  };
};

const stripSecret = (G, playerId) => {
  const { words, ...rest} = G;
  if (isEmpty(words)) {
    return rest;
  } else if (playerId === firstCanvasPlayerIdFrom(G.players)) {
    return { ...rest, word: words.current.split(' ')[0]};
  } else if (playerId === secondCanvasPlayerIdFrom(G.players)) {
    return { ...rest, word: words.current.split(' ')[1]};
  } else {
    return rest;
  }
};

const DEFAULT_NUM_OF_PLAYERS = 10;
const DEFAULT_NUM_OF_ROUNDS = 1;

const onTurnBegin = (G, ctx)  => {
  const nextActivePlayers = nextActivePlayersFrom(G.players, ctx.numPlayers);
  ctx.events.setActivePlayers({value: nextActivePlayers});
  return {...G, ...initTurn(G), players: updatePlayers(G.players, nextActivePlayers)};
};

const CollabSketch = {
  name: 'collab-sketch',

  setup: (ctx) => ({
    players: {},
    state: GameState.WAITING,
    settings: {
      turnPeriod: 20,
      rounds: DEFAULT_NUM_OF_ROUNDS,
    },
    words: {
      all: uniqueWordsFor(DEFAULT_NUM_OF_ROUNDS, DEFAULT_NUM_OF_PLAYERS),
      current: '',
    },
    canvasOne: { snapshot: {}, svg: "", chars: 0 },
    canvasTwo: { snapshot: {}, svg: "", chars: 0 },
    chatMessages: [],
  }),

  playerView: (G, ctx, playerId) => stripSecret(G, playerId),

  phases: {
    wait: {
      moves: { startGame, joinGame },
      start: true,
      endIf: G => (G.state === GameState.STARTED),
      next: 'play',
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
    },
    play: {
      turn: {
        onBegin: (G, ctx) => {
          console.log('Turn Started');
          return onTurnBegin(G, ctx);
        },
        onEnd: (G, ctx) => {
          console.log("Turn Ended");
        },
        stages: {
          drawCanvasOne: {
            moves: { updateSnapshotForCanvasOne, endTurn },
          },
          drawCanvasTwo: {
            moves: { updateSnapshotForCanvasTwo, endTurn },
          },
          guess: {
            moves: { guessArt, endTurn },
          },
          inactive: {
            moves: { joinGame },
          }
        },
      },
      endIf: (G, ctx) => {
        if (ctx.turn === (G.settings.rounds * Object.keys(G.players).length) + 1) {
          G.state = GameState.ENDED
        }
      },
    },
  },

  endIf: (G, ctx) => {
    if ( G.state === GameState.ENDED) {
      return { winner: 'someone'};
    }
  }
};

export default CollabSketch;