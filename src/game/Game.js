import {GameState} from '../constants'
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';
import {ActivePlayers, PlayerView} from "boardgame.io/dist/esm/core";
import {endTurn, guessArt, startGame, updateSnapshotForCanvasOne, updateSnapshotForCanvasTwo, joinGame} from "./Moves";

const nextArtistsFromPrevArtists = (artists, totalPlayers) => {
  if(isEmpty(artists)) {
    return [0, 1];
  } else {
    return [ (artists[1] + 1) % totalPlayers, (artists[1] + 2) % totalPlayers];
  }
};

const difference = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));

const getArtists = (players) => Object.entries(players).map(([k,_]) => parseInt(k));

const assignStagesAndWordsToPlayers = (G, ctx) => {
  const totalPlayers = ctx.numPlayers;
  const registeredPlayers = Object.keys(G.registeredPlayers).map( key => parseInt(key));
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
    turn: {
      startTime: Date.now()
    },
    canvasOne: { snapshot: {}, svg: "", chars: wordLengths[0] },
    canvasTwo: { snapshot: {}, svg: "", chars: wordLengths[1] },
    words: Array(2).fill(""),
  };
};

const CollabSketch = {
  name: 'collab-sketch',

  setup: (ctx) => ({
    ...initRound("", {}),
    registeredPlayers: {},
    state: GameState.WAITING,
    chatMessages: Array(),
    settings: {
      turnPeriod: 20,
      rounds: 5,
    }
  }),

  playerView: PlayerView.STRIP_SECRETS,

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
          let { activePlayers, guessWords, playerWords } = assignStagesAndWordsToPlayers(G, ctx);
          ctx.events.setActivePlayers({ value: activePlayers, next: activePlayers });
          return { ...G, ...initRound(guessWords, playerWords) };
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
        if (ctx.turn === G.settings.rounds + 1) {
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