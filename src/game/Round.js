import {pickRandomWords} from "./Words";
import {nextActivePlayersForSelectionFrom, nextActivePlayersFrom, updatePlayers} from "./Players";

export const getRound = ctx => ctx.turn - 1;

export const initChooseStage = (words) => {
  const {selected, rest} = pickRandomWords(words);

  return {
    words: {
      all: rest,
      selection: selected,
      current: ''
    },
    turn: {
      startTime: null,
      selectionStartTime: Date.now(),
    }
  };
};

export const initRound = (G, ctx) => {
  const nextActivePlayers = nextActivePlayersFrom(G.players, ctx.numPlayers);
  G.players = updatePlayers(G.players, nextActivePlayers);
  G.turn.startTime = Date.now();
  ctx.events.setActivePlayers({value: nextActivePlayers});
};

export const onRoundBegin = (G, ctx) => {
  const nextActivePlayers = nextActivePlayersForSelectionFrom(G.players, ctx.numPlayers);
  ctx.events.setActivePlayers({value: nextActivePlayers});
  return {
    ...G,
    ...initChooseStage(G.words.all),
    players: updatePlayers(G.players, nextActivePlayers),
    canvasOne: {snapshot: {}, svg: "", chars: 0},
    canvasTwo: {snapshot: {}, svg: "", chars: 0},
  };
};