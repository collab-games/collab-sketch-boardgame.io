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
  client: false
};

export const updateSnapshotForCanvasOne = {
  move: (G, ctx, snapshot, svg) => {
    G.canvasOne = {...G.canvasOne, snapshot, svg};
  },
  client: false
};

export const updateSnapshotForCanvasTwo = {
  move: (G, ctx, snapshot, svg) => {
    G.canvasTwo = {...G.canvasTwo, snapshot, svg};
  },
  client: false
};

export const startGame = {
  move: (G, ctx) => {
    if (isAdmin(ctx.currentPlayer)) {
      G.state = GameState.STARTED;
    }
  },
  client: false
};

const addScore = (players, currentPlayerId) => {
    let activeGuessingPlayers = Object.values(players).filter(player => player.turn.action === 'guess');
    const currentGuessPosition = activeGuessingPlayers
      .map(player => player.turn.guessPosition)
      .sort((a, b) => b-a)[0];

    const score  = (activeGuessingPlayers.length - currentGuessPosition) * 10;

    players[currentPlayerId].game.score += score;
    players[currentPlayerId].turn.guessPosition = currentGuessPosition + 1;

    const everybodyGuessed = activeGuessingPlayers.every(player => player.turn.hasGuessed);

    if (everybodyGuessed) {
        const drawingPlayers = Object.values(players).filter(player => player.turn.action !== 'guess');
        drawingPlayers.forEach((player) => player.game.score += (activeGuessingPlayers.length) * 5);
    }
};

const endTurnIfAllGuessed = (players, ctx) => {
    const activeGuessingPlayers = Object.values(players).filter(player => player.turn.action === 'guess');
    const everybodyGuessed = activeGuessingPlayers.every(player => player.turn.hasGuessed);
    if (everybodyGuessed) {
        ctx.events.endTurn();
    }
};

export const guessArt = {
  move: (G, ctx, value) => {
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
        endTurnIfAllGuessed(G.players, ctx);
      }
    } else {
      G.chatMessages = [...G.chatMessages, value];
    }
  },
  client: false
};

export const joinGame = {
  move: (G, ctx, playerId, playerName) => {
    G.players[playerId] = newPlayer(playerName);
  },
  client: false
};
