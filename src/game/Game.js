import { GameState } from '../constants'
import { ActivePlayers } from "boardgame.io/core";
import { Stage } from "boardgame.io/core";

const isAdmin = (playerID) => playerID === '0';

const updateSnapshot = (G, ctx, id, snapshot, svg) => {
  G.canvases[id] = { snapshot, svg};
};

const startGame = (G, ctx) => {
  if(isAdmin(ctx.currentPlayer)) {
    G.state = GameState.STARTED;
  }
};

const guessArt = (G, ctx, id, value) => {
  G.words[id] = value;
}

// const assignStages = (G, ctx) => {
//   const totalPlayers = ctx.numPlayers;
//   const previousArtists = G.players.artists;
//   let nextArtists = [];
//   for (let i =0; i<2; i++) {
//     nextArtists.push(max(previousArtists) + 1 + i % totalPlayers);
//   }
// }

const CollabSketch = {
  name: 'collab-sketch',

  setup: (ctx) => ({
    canvases: Array(ctx.numPlayers).fill({ snapshot: {}, svg: ""}),
    words: Array(2).fill(""),
    players: { artists: [0, 1]},
    state: GameState.WAITING
  }),

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
          value: {
            '0': { stage: 'draw'},
            '1': { stage: 'draw'},
            '2': { stage: 'guess'},
            '3': { stage: 'guess'},
          }
        })
      },
      turn: {
        stages: {
          draw: {
            moves: { updateSnapshot },
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