import { GameState } from '../constants'
import {ActivePlayers} from "boardgame.io/core";

const isAdmin = (playerID) => playerID === '0';

const CollabSketch = {
  name: 'collab-sketch',

  setup: (ctx) => ({
    canvases: Array(ctx.numPlayers).fill({ snapshot: {}, svg: ""}),
    state: GameState.WAITING
  }),

  turn: {
    activePlayers: ActivePlayers.ALL,
  },

  moves: {
    updateSnapshot(G, ctx, id, snapshot, svg) {
      G.canvases[id] = { snapshot, svg};
    },

    startGame(G, ctx) {
      if(isAdmin(ctx.currentPlayer)) {
        G.state = GameState.STARTED;
      }
    }
  }

};

export default CollabSketch;