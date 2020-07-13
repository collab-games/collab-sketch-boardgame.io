import isNull from "lodash/isNull";
import isEmpty from "lodash/isEmpty";
import {GameState, MessageType} from "../constants";
import {isCoArtistSelected, makeCoArtist, newPlayer, playerNameFrom} from "./Players";
import {firstWord, secondWord} from "./Words";
import {initRound} from "./Round";

const isAdmin = (playerID) => playerID === '0';

export const endTurn = {
  move: (G, ctx, turn) => {
    if (ctx.turn === turn && !isNull(G.turn.startTime)) {
      const startTime = G.turn.startTime;
      const period = G.settings.turnPeriod;
      if ((Date.now() - startTime) >= period * 1000) {
        showWordInChat(G);
        ctx.events.endTurn();
      }
    }
  },
  client: false
};

export const endSelection = {
  move: (G, ctx, turn) => {
    if (ctx.turn === turn && !isNull(G.turn.selectionStartTime)) {
      const startTime = G.turn.selectionStartTime;
      const period = G.settings.selectionPeriod;
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

export const endGame = {
  move: (G, ctx) => {
    if (isAdmin(ctx.playerID)) {
      G.state = GameState.ENDED;
    }
  },
  client: false
};

const guessingPlayers = (G) => {
  return Object.values(G.players).filter(player => player.turn.action === 'guess');
};

const drawingPlayers = (G) => {
  return Object.values(G.players).filter(player => player.turn.action !== 'guess');
};

const addScore = (players, currentPlayerId, G) => {
    let activeGuessingPlayers = guessingPlayers(G);
    const currentGuessPosition = activeGuessingPlayers
      .map(player => player.turn.guessPosition)
      .sort((a, b) => b-a)[0];

    const score  = (activeGuessingPlayers.length - currentGuessPosition) * 10;

    players[currentPlayerId].game.score += score;
    players[currentPlayerId].turn.guessPosition = currentGuessPosition + 1;

    const currentPlayerName = players[currentPlayerId].game.name;
    const message = {
      text:  '',
      score: score,
      author: currentPlayerName,
      type: MessageType.GUESSED,
      systemGenerated: true
    };
    G.players[currentPlayerId]['turn']['hasGuessed'] = true;
    G.chatMessages[Date.now()] = message;

    const everybodyGuessed = activeGuessingPlayers.every(player => player.turn.hasGuessed);

    if (everybodyGuessed) {
        showWordInChat(G);
    }
};

const showWordInChat = (G) => {
    const artistsNames = drawingPlayers(G).map((player) => player.game.name);
    const correctGuessedPlayers = guessingPlayers(G).filter((player) => player.turn.hasGuessed);
    const drawingPlayerBonus = correctGuessedPlayers.length * 5;
    drawingPlayers(G).forEach((player) => player.game.score += drawingPlayerBonus);
    const message = {
      text:  G.words.current,
      score: drawingPlayerBonus,
      author: artistsNames.join(' and '),
      type: MessageType.REVEAL,
      systemGenerated: true
    };
    G.chatMessages[Date.now()] = message;
};

const endTurnIfAllGuessed = (players, ctx) => {
    const activeGuessingPlayers = Object.values(players).filter(player => player.turn.action === 'guess');
    const everybodyGuessed = activeGuessingPlayers.every(player => player.turn.hasGuessed);
    if (everybodyGuessed) {
        ctx.events.endTurn();
    }
};

const isCorrect = (guessedWord, actualWord) => {
  return actualWord.replace(/\s/g, "").toUpperCase() === guessedWord.replace(/\s/g, "").toUpperCase();
};

export const guessArt = {
  move: (G, ctx, value) => {
    const playerId = ctx.playerID;
    const guess = value.trim();
    if (G.words && isCorrect(guess, G.words.current)) {
      if (!G.players[playerId]['turn']['hasGuessed']) {
        addScore(G.players, playerId, G);
        endTurnIfAllGuessed(G.players, ctx);
      }
    } else {
      const message = {
        text: value,
        author: playerNameFrom(playerId, G.players),
        type: MessageType.GUESS,
        systemGenerated: false
      };
      G.chatMessages[Date.now()] = message;
    }
  },
  client: false
};

export const joinGame = {
  move: (G, ctx, playerName) => {
    G.players[ctx.playerID] = newPlayer(playerName);
  },
  client: false
};

const updateCurrentWord = (G, word) => {
  G.words.all.splice(G.words.all.indexOf(word), 1);
  G.words= { ...G.words, current: word, selection: []};
  G.canvasOne = { snapshot: {}, svg: "", chars: firstWord(word).length };
  G.canvasTwo = { snapshot: {}, svg: "", chars: secondWord(word).length };
};

const isSelectionComplete = (G) => isCoArtistSelected(G.players) && !isEmpty(G.words.current);

export const chooseWord = {
  move: (G, ctx, word) => {
    updateCurrentWord(G, word);
    if(isSelectionComplete(G)) {
      initRound(G, ctx);
    }
  },
  client: false
};

export const choosePlayer = {
  move: (G, ctx, coArtistId) => {
    if(ctx.playerID !== coArtistId) {
      G.players[coArtistId] = makeCoArtist(G.players[coArtistId]);
      if(isSelectionComplete(G)) {
        initRound(G, ctx);
      }
    }
  },
  client: false
};
