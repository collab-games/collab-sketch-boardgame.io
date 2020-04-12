import { GameState } from '../constants'
import max from 'lodash/max';
import indexOf from 'lodash/indexOf';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';
import filter from 'lodash/filter';

const isAdmin = (playerID) => playerID === '0';

const updateSnapshotForCanvasOne = (G, ctx, snapshot, svg) => {
  G.canvases[0] = { snapshot, svg};
};

const updateSnapshotForCanvasTwo = (G, ctx, snapshot, svg) => {
  G.canvases[1] = { snapshot, svg};
};

const startGame = (G, ctx) => {
  if(isAdmin(ctx.currentPlayer)) {
    G.state = GameState.STARTED;
  }
};

const guessArt = (G, ctx, id, value) => {
  G.words[id] = value;
};

const nextArtistsFromPrevArtists = (array, totalPlayers) => {
  if(isEmpty(array.length)) {
    return [0, 1];
  } else {
    return [ (max(array) + 1) % totalPlayers, (max(array) + 2) % totalPlayers];
  }
};
const getArtists = (activePlayers) => Object.keys(filter(activePlayers, (val, _) => val === 'draw'));

const assignStages = (ctx) => {
  const totalPlayers = ctx.numPlayers;
  const previousArtists = getArtists(ctx.activePlayers);
  let nextArtists = nextArtistsFromPrevArtists(previousArtists, totalPlayers);
  let otherPlayers = range(totalPlayers).filter(playerId => indexOf(nextArtists, playerId) === -1)
  let activePlayers = {};
  activePlayers[nextArtists[0]] = { stage: 'drawCanvasOne'};
  activePlayers[nextArtists[1]] = { stage: 'drawCanvasTwo'};
  otherPlayers.forEach(playerId => {
    activePlayers[playerId] = { stage: 'guess'}
  });
  return activePlayers;
};

const stripArtWord = (G, playerId) => {
  const { artWord, ...rest } = G;
  return rest;
};

const CollabSketch = {
  name: 'collab-sketch',

  setup: (ctx) => ({
    canvases: Array(ctx.numPlayers).fill({ snapshot: {}, svg: ""}),
    words: Array(2).fill(""),
    state: GameState.WAITING,
    artWord: 'Shield'
  }),

  playerView: (G, ctx, playerID) => {
    return stripArtWord(G, playerID);
  },

  phases: {
    wait: {
      moves: { startGame },
      start: true,
      endIf: G => (G.state === GameState.STARTED),
      next: 'play',
    },
    play: {
      onBegin: (G, ctx) => {
        ctx.events.setActivePlayers({
          value: assignStages(ctx),
        })
      },
      turn: {
        stages: {
          drawCanvasOne: {
            moves: { updateSnapshotForCanvasOne },
          },
          drawCanvasTwo: {
            moves: { updateSnapshotForCanvasTwo },
          },
          guess: {
            moves: { guessArt },
          },
        },
      },
    },
  },

};

export default CollabSketch;