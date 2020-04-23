import { GameState } from '../constants'
import isEmpty from 'lodash/isEmpty';
import { ActivePlayers } from "boardgame.io/dist/esm/core";
import { endTurn, guessArt, joinGame, startGame, updateSnapshotForCanvasOne, updateSnapshotForCanvasTwo } from "./Moves";
import { firstCanvasPlayerIdFrom, nextActivePlayersFrom, secondCanvasPlayerIdFrom, updatePlayers } from "./Players";
import { uniqueWordsFor, nextWordsFrom, firstWord, secondWord } from "./Words";

const initTurn = (G) => {
  let {allWords, currentWords, firstWordLength, secondWordLength} = nextWordsFrom(G.words.all);

  return {
    words: {
      all: allWords,
      current: currentWords,
    },
    turn: {
      startTime: Date.now()
    },
    canvasOne: { snapshot: {}, svg: "", chars: firstWordLength },
    canvasTwo: { snapshot: {}, svg: "", chars: secondWordLength },
  };
};

const stripSecret = (G, playerId) => {
  const { words, ...rest} = G;
  if (isEmpty(words)) {
    return rest;
  } else if (playerId === firstCanvasPlayerIdFrom(G.players)) {
    return { ...rest, word: firstWord(words.current) }
  } else if (playerId === secondCanvasPlayerIdFrom(G.players)) {
    return { ...rest, word: secondWord(words.current) }
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