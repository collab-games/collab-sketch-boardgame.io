import {GameState} from '../constants'
import isEmpty from 'lodash/isEmpty';
import random from 'lodash/random';
import clone from 'lodash/clone';
import range from 'lodash/range';
import { ActivePlayers } from "boardgame.io/dist/esm/core";
import { endTurn, guessArt, startGame, updateSnapshotForCanvasOne, updateSnapshotForCanvasTwo, joinGame } from "./Moves";
import { default as dictionaryWords } from '../words.json';

const uniqueWordsFor = (numOfRounds, numOfPlayers) => {
  let count = numOfRounds * numOfPlayers;
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

const nextArtistsFromPrevArtists = (artists, totalPlayers) => {
  if(isEmpty(artists)) {
    return [0, 1];
  } else {
    return [ (artists[1] + 1) % totalPlayers, (artists[1] + 2) % totalPlayers];
  }
};

const difference = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));

const getArtists = (players) => {
  const artists = Object.entries(players).filter(([_, player]) => ( player.action === 'drawingCanvasOne' || player.action === 'drawingCanvasTwo'));
  if (artists.length === 2) {
    if (artists[0][1]['action'] === 'drawingCanvasOne') {
      return [ parseInt(artists[0][0]), parseInt(artists[1][0])]
    } else {
      return [ parseInt(artists[1][0]), parseInt(artists[0][0])]
    }
  } else {
    return [];
  }
}

const nextActivePlayersFor = (G, ctx) => {
  const totalPlayers = ctx.numPlayers;
  const registeredPlayers = Object.keys(G.players).map( key => parseInt(key));
  const previousArtists = getArtists(G.players);
  let nextArtists = nextArtistsFromPrevArtists(previousArtists, registeredPlayers.length);
  let guessPlayers = difference(registeredPlayers, nextArtists);
  let inactivePlayers = difference(range(totalPlayers), registeredPlayers);
  let activePlayers = {};
  activePlayers[nextArtists[0]] = { stage: 'drawCanvasOne'};
  activePlayers[nextArtists[1]] = { stage: 'drawCanvasTwo'};
  guessPlayers.forEach(playerId => {
    activePlayers[playerId] = { stage: 'guess'}
  });
  inactivePlayers.forEach(playerId => {
    activePlayers[playerId] = { stage: 'inactive'}
  });
  return activePlayers;
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

const isCanvasOnePlayer = (activePlayers, playerId) => activePlayers[playerId] === 'drawCanvasOne';
const isCanvasTwoPlayer = (activePlayers, playerId) => activePlayers[playerId] === 'drawCanvasTwo';

const stripSecret = (G, playerId, activePlayers) => {
  const { words, ...rest } = G;
  if (isEmpty(words)) {
    return rest;
  } else if (isEmpty(activePlayers)) {
    return rest;
  }
  if (isCanvasOnePlayer(activePlayers, playerId)) {
    return { ...rest, word: words.current.split(' ')[0]};
  } else if (isCanvasTwoPlayer(activePlayers, playerId)) {
    return { ...rest, word: words.current.split(' ')[1]};
  } else {
    return rest;
  }
};

const updatePlayers = (players, nextPlayers) => {
  let updatedPlayers = {};
  Object.entries(players).forEach(([k, player]) => updatedPlayers[k] = { ...player, action: ''});

  Object.entries(nextPlayers).forEach(([k, player]) => {
    if ( player.stage === 'drawCanvasOne') {
      updatedPlayers[k] = { ...updatedPlayers[k], action: 'drawingCanvasOne'}
    } else if ( player.stage === 'drawCanvasTwo') {
      updatedPlayers[k] = { ...updatedPlayers[k], action: 'drawingCanvasTwo'}
    }
  });
  return updatedPlayers;
}

const DEFAULT_NUM_OF_PLAYERS = 10;
const DEFAULT_NUM_OF_ROUNDS = 1;

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
    chatMessages: Array(),
  }),

  playerView: (G, ctx, playerId) => stripSecret(G, playerId, ctx.activePlayers),

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
          const nextPlayers = nextActivePlayersFor(G, ctx);
          ctx.events.setActivePlayers({ value: nextPlayers });
          return { ...G, ...initTurn(G), players: updatePlayers(G.players, nextPlayers) };
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