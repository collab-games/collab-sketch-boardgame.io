import {DEFAULT_NUM_OF_PLAYERS, DEFAULT_NUM_OF_ROUNDS, GAME_NAME, GameState} from '../constants'
import isEmpty from 'lodash/isEmpty';
import {ActivePlayers} from "boardgame.io/dist/esm/core";
import {
  choosePlayer,
  chooseWord,
  endGame,
  endSelection,
  endTurn,
  guessArt,
  joinGame,
  startGame,
  updateSnapshotForCanvasOne,
  updateSnapshotForCanvasTwo
} from "./Moves";
import {choosingPlayerIdFrom, firstCanvasPlayerIdFrom, secondCanvasPlayerIdFrom,} from "./Players";
import {firstWord, secondWord, uniqueWordsFor} from "./Words";
import {getRound, onRoundBegin} from "./Round";

const stripSecret = (G, playerId) => {
  const { words, ...rest} = G;
  if (isEmpty(words)) {
    return rest;
  } else if(playerId === choosingPlayerIdFrom(G.players)) {
    return { ...rest, chooseWords: words.selection}
  } else if (playerId === firstCanvasPlayerIdFrom(G.players)) {
    return { ...rest, word: firstWord(words.current) }
  } else if (playerId === secondCanvasPlayerIdFrom(G.players)) {
    return { ...rest, word: secondWord(words.current) }
  } else {
    return rest;
  }
};

const CollabSketch = {
  name: GAME_NAME,
  disableUndo: true,

  setup: (ctx) => ({
    players: {},
    state: GameState.WAITING,
    settings: {
      turnPeriod: 90,
      selectionPeriod: 20,
      rounds: DEFAULT_NUM_OF_ROUNDS,
    },
    turn: {
      startTime: null,
      selectionStartTime: null,
    },
    words: {
      all: uniqueWordsFor(DEFAULT_NUM_OF_ROUNDS, DEFAULT_NUM_OF_PLAYERS),
      selection: [],
      current: '',
    },
    canvasOne: { snapshot: null, svg: "", chars: 0 },
    canvasTwo: { snapshot: null, svg: "", chars: 0 },
    chatMessages: {},
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
          return onRoundBegin(G, ctx);
        },
        onEnd: (G, ctx) => {
          console.log("Turn Ended");
        },
        stages: {
          choose: {
            moves: { chooseWord, choosePlayer, endSelection, endGame },
          },
          waiting: {
            moves: { endSelection, guessArt, endGame },
          },
          drawCanvasOne: {
            moves: { updateSnapshotForCanvasOne, endTurn, endGame },
          },
          drawCanvasTwo: {
            moves: { updateSnapshotForCanvasTwo, endTurn, endGame },
          },
          guess: {
            moves: { guessArt, endTurn, endGame },
          },
          inactive: {
            moves: { joinGame }
          }
        },
      },
      endIf: (G, ctx) => {
        if (getRound(ctx) === G.settings.rounds) {
          G.state = GameState.ENDED
        }
      },
    },
  },

  endIf: (G) => {
    if ( G.state === GameState.ENDED) {
      return { winner: 'someone'};
    }
  }
};

export default CollabSketch;