import isNull from "lodash/isNull";
import {GameState} from "../constants";

const isAdmin = (playerID) => playerID === '0';

export const endTurn = {
    move: (G, ctx, turn) => {
        if (ctx.turn === turn && !isNull(G.turn.startTime)) {
            const startTime = G.turn.startTime;
            const period = G.settings.turnPeriod;
            if ((Date.now() - startTime) >= period * 1000) {
                ctx.events.endTurn();
            }
        }
    },
    client: false,
}

export const updateSnapshotForCanvasOne = (G, ctx, snapshot, svg) => {
    G.canvasOne = {...G.canvasOne, snapshot, svg};
};

export const updateSnapshotForCanvasTwo = (G, ctx, snapshot, svg) => {
    G.canvasTwo = {...G.canvasTwo, snapshot, svg};
};

export const startGame = (G, ctx) => {
    if (isAdmin(ctx.currentPlayer)) {
        G.state = GameState.STARTED;
    }
};

export const guessArt = (G, ctx, value) => {
    G.chatMessages = [...G.chatMessages, value];
};

export const joinGame = (G, ctx, playerId, playerName) => {
    G.players[playerId] = { joined: true, name: playerName };
};