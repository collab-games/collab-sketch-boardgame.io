import isNull from "lodash/isNull";
import {GameState} from "../constants";
import {isCoArtistSelected, makeCoArtist, newPlayer, nextActivePlayersFrom, updatePlayers} from "./Players";
import isEmpty from "lodash/isEmpty";
import {firstWord, secondWord} from "./Words";

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

const addScore = (players, currentPlayerId, value, G) => {
    let activeGuessingPlayers = guessingPlayers(G);
    const currentGuessPosition = activeGuessingPlayers
      .map(player => player.turn.guessPosition)
      .sort((a, b) => b-a)[0];

    const score  = (activeGuessingPlayers.length - currentGuessPosition) * 10;

    players[currentPlayerId].game.score += score;
    players[currentPlayerId].turn.guessPosition = currentGuessPosition + 1;

    const currentPlayerName = players[currentPlayerId].game.name;
    const message = { ...value, data: { text: `${currentPlayerName} has guessed it correct [+${score}]` } };
    G.players[currentPlayerId]['turn']['hasGuessed'] = true;
    G.chatMessages = [...G.chatMessages, message];

    const everybodyGuessed = activeGuessingPlayers.every(player => player.turn.hasGuessed);

    if (everybodyGuessed) {
        const drawingPlayerBonus = (activeGuessingPlayers.length) * 5;
        drawingPlayers(G).forEach((player) => player.game.score += drawingPlayerBonus);
        showWordInChat(G);
        const message = { ...value, data: { text: `Everybody has guessed it correct [+${drawingPlayerBonus}]` } };
        G.chatMessages = [...G.chatMessages, message];
    }
};

const showWordInChat = (G) => {
    const artistsNames = drawingPlayers(G).map((player) => player.game.name);
    const message = {
      author: 'me',
      data: {
        text: `${artistsNames.join(' and ')} were drawing ${G.words.current}.`
      },
      type: 'text'
    };
    G.chatMessages = [...G.chatMessages, message];
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
    const guess = split[1].trim();
    if (G.words && guess === G.words.current) {
      if (!G.players[playerId]['turn']['hasGuessed']) {
        addScore(G.players, playerId, value, G);
        endTurnIfAllGuessed(G.players, ctx);
      }
    } else {
      G.chatMessages = [...G.chatMessages, value];
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
  G.words= { ...G.words, current: word, selection: []};
  G.canvasOne = { snapshot: {}, svg: "", chars: firstWord(word).length };
  G.canvasTwo = { snapshot: {}, svg: "", chars: secondWord(word).length };
};

const isSelectionComplete = (G) => isCoArtistSelected(G.players) && !isEmpty(G.words.current);

const initRound = (G, ctx) => {
  const nextActivePlayers = nextActivePlayersFrom(G.players, ctx.numPlayers);
  G.players = updatePlayers(G.players, nextActivePlayers);
  G.turn.startTime = Date.now();
  ctx.events.setActivePlayers({value: nextActivePlayers});
};

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
      G.players[coArtistId] = makeCoArtist(G.players[coArtistId])
      if(isSelectionComplete(G)) {
        initRound(G, ctx);
      }
    }
  },
  client: false
};
