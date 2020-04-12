import { GameState } from '../constants'
import max from 'lodash/max';
import indexOf from 'lodash/indexOf';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';
import filter from 'lodash/filter';
import {PlayerView} from "boardgame.io/dist/esm/core";

const isAdmin = (playerID) => playerID === '0';

const updateSnapshotForCanvasOne = (G, ctx, snapshot, svg) => {
  G.canvasOne = { ...G.canvasOne, snapshot, svg };
};

const updateSnapshotForCanvasTwo = (G, ctx, snapshot, svg) => {
  G.canvasTwo = { ...G.canvasTwo, snapshot, svg };
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
  if(isEmpty(array)) {
    return [0, 1];
  } else {
    return [ (max(array) + 1) % totalPlayers, (max(array) + 2) % totalPlayers];
  }
};
const getArtists = (activePlayers) => Object.keys(filter(activePlayers, (val, _) => val === 'draw'));

const assignStagesAndWordsToPlayers = (ctx) => {
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

  const guessWords = pickWords();
  const playerWords = assignWordsToPlayers(guessWords, nextArtists);
  return { activePlayers, guessWords, playerWords };
}

const assignWordsToPlayers = (guessWords, artists) => {
  let assignments = {};
  let words = guessWords.split(' ');
  assignments[artists[0]] = words[0];
  assignments[artists[1]] = words[1];
  return assignments;
}

const pickWords = () => "hello world";

const initRound = (words, players) => {
  const wordLengths = words.split(' ').length === 2 ? words.split(' ').map(word => word.length) : [0,0];
  return {
    secret: words,
    players: players,
    canvasOne: {snapshot: {}, svg: "", chars: wordLengths[0]},
    canvasTwo: {snapshot: {}, svg: "", chars: wordLengths[1]},
    words: Array(2).fill(""),
  };
};

const CollabSketch = {
  name: 'collab-sketch',

  setup: (ctx) => ({
    ...initRound("", {}),
    state: GameState.WAITING
  }),

  playerView: PlayerView.STRIP_SECRETS,

  phases: {
    wait: {
      moves: { startGame },
      start: true,
      endIf: G => (G.state === GameState.STARTED),
      next: 'play',
    },
    play: {
      turn: {
        onBegin: (G, ctx) => {
          let { activePlayers, guessWords, playerWords } = assignStagesAndWordsToPlayers(ctx);
          ctx.events.setActivePlayers({ value: activePlayers });
          return { ...G, ...initRound(guessWords, playerWords) };
        },
        onEnd: (G, ctx) => {
          console.log("Turn Ended");
        },
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