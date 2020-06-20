import {GAME_NAME, GameState, DEFAULT_NUM_OF_PLAYERS, DEFAULT_NUM_OF_ROUNDS} from '../constants'
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import { ActivePlayers } from "boardgame.io/dist/esm/core";
import {
  endTurn,
  guessArt,
  joinGame,
  startGame,
  updateSnapshotForCanvasOne,
  updateSnapshotForCanvasTwo,
  choosePlayer,
  chooseWord, endSelection, endGame
} from "./Moves";
import {
  choosingPlayerIdFrom,
  firstCanvasPlayerIdFrom,
  nextActivePlayersForSelectionFrom,
  secondCanvasPlayerIdFrom,
  updatePlayers,
} from "./Players";
import {uniqueWordsFor, firstWord, secondWord, pickRandomWords} from "./Words";

const initChooseStage = (words) => {
  const { selected, rest } = pickRandomWords(words);

  return {
    words: {
      all: rest,
      selection: selected,
      current: ''
    },
    turn: {
      startTime: null,
      selectionStartTime: Date.now(),
    }
  };
};

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

const onTurnBegin = (G, ctx)  => {
  const nextActivePlayers = nextActivePlayersForSelectionFrom(G.players, ctx.numPlayers);
  ctx.events.setActivePlayers({value: nextActivePlayers});
  return {
    ...G,
    ...initChooseStage(G.words.all),
    players: updatePlayers(G.players, nextActivePlayers),
    canvasOne: { snapshot: {}, svg: "", chars: 0 },
    canvasTwo: { snapshot: {}, svg: "", chars: 0 },
  };
};

const CollabSketch = {
  name: GAME_NAME,
  disableUndo: true,

  setup: (ctx) => ({
    players: {},
    state: GameState.WAITING,
    settings: {
      turnPeriod: 60,
      selectionPeriod: 10,
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
        if (ctx.turn === (G.settings.rounds * size(G.players) + 1)) {
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