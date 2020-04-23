import isNull from "lodash/isNull";
import {GameState} from "../constants";
import { newPlayer } from "./Players";

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

const addScore = (players, currentPlayerId) => {
    let activePlayers = Object.values(players);
    const currentGuessPosition = activePlayers
      .map(player => player.turn.guessPosition)
      .sort((a, b) => b-a)[0];

    const score  = (activePlayers.length - (currentGuessPosition + 1) ) * 10;

    players[currentPlayerId].game.score += score;
    players[currentPlayerId].turn.guessPosition = currentGuessPosition + 1;
};

export const guessArt = (G, ctx, value) => {
    const playerId = ctx.playerID;
    const split = value.data.text.split(':');
    const playerName = split[0];
    const guess = split[1].trim();
    if (G.words && guess === G.words.current) {
        if (!G.players[playerId]['turn']['hasGuessed']) {
            const message = { ...value, data: { text: `${playerName} has guessed it correct` } };
            G.players[playerId]['turn']['hasGuessed'] = true;
            G.chatMessages = [...G.chatMessages, message];
            addScore(G.players, playerId);
        }
    } else {
        G.chatMessages = [...G.chatMessages, value];
    }
};

export const joinGame = (G, ctx, playerId, playerName) => {
    G.players[playerId] = newPlayer(playerName);
};
