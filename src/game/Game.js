import { GameState } from '../constants'
import isEmpty from 'lodash/isEmpty';
import { ActivePlayers } from "boardgame.io/dist/esm/core";
import {
  endTurn,
  guessArt,
  joinGame,
  startGame,
  updateSnapshotForCanvasOne,
  updateSnapshotForCanvasTwo,
  choosePlayer,
  chooseWord
} from "./Moves";
import {
  artistIdFrom,
  firstCanvasPlayerIdFrom,
  secondCanvasPlayerIdFrom,
  updateChoosePlayer,
} from "./Players";
import {uniqueWordsFor, firstWord, secondWord, pickRandomWords} from "./Words";

const initChooseStage = (words) => {
  const { selected, rest } = pickRandomWords(words);

  return {
    words: {
      all: rest,
      selection: selected,
      current: ''
    }
  };
};

const stripSecret = (G, playerId) => {
  const { words, ...rest} = G;
  if (isEmpty(words)) {
    return rest;
  } else if(playerId === artistIdFrom(G.players)) {
    return { ...rest, chooseWords: words.selection}
  } else if (playerId === firstCanvasPlayerIdFrom(G.players)) {
    return { ...rest, word: firstWord(words.current) }
  } else if (playerId === secondCanvasPlayerIdFrom(G.players)) {
    return { ...rest, word: secondWord(words.current) }
  } else {
    return rest;
  }
};

const DEFAULT_NUM_OF_PLAYERS = 10;
const DEFAULT_NUM_OF_ROUNDS = 10;

const onTurnBegin = (G, ctx)  => {
  ctx.events.setActivePlayers({value: { '0': 'choose'}});
  return {...G, ...initChooseStage(G.words.all), players: updateChoosePlayer(G.players, 0)};
};

const CollabSketch = {
  name: 'collab-sketch',

  setup: (ctx) => ({
    players: {},
    state: GameState.WAITING,
    settings: {
      turnPeriod: 60,
      rounds: DEFAULT_NUM_OF_ROUNDS,
    },
    turn: {
      startTime: null,
    },
    words: {
      all: uniqueWordsFor(DEFAULT_NUM_OF_ROUNDS, DEFAULT_NUM_OF_PLAYERS),
      selection: [],
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
          choose: {
            moves: { chooseWord, choosePlayer },
          },
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

  endIf: (G) => {
    if ( G.state === GameState.ENDED) {
      return { winner: 'someone'};
    }
  }
};

export default CollabSketch;