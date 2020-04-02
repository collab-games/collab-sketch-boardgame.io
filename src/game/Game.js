import { GameState } from '../constants'
import {ActivePlayers} from "boardgame.io/core";

const isAdmin = (playerID) => playerID === '0';

const CollabSketch = {
  name: 'collab-sketch',

  setup: (ctx) => ({
    canvases: Array(ctx.numPlayers).fill({}),
    cells: Array(ctx.numPlayers).fill(""),
    state: GameState.WAITING
  }),

  turn: {
    activePlayers: ActivePlayers.ALL,
  },

  moves: {
    update(G, ctx, id, value) {
      G.cells[id] = value;
    },

    updateSnapshot(G, ctx, id, value) {
      G.canvases[id] = value;
    },

    startGame(G, ctx) {
      if(isAdmin(ctx.currentPlayer)) {
        G.state = GameState.STARTED;
      }
    }
  }

};

export default CollabSketch;