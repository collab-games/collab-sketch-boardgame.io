import findKey from 'lodash/findKey';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import range from 'lodash/range';
import some from "lodash/some";

export const newPlayer = (playerName) => ({
  game: {
    joined: true,
    name: playerName,
    score: 0,
  },
  turn: {
    action: '',
    hasGuessed: false,
    guessPosition: 0,
    coArtist: false,
  }
})

export const updatePlayers = (players, nextActivePlayers) => {
  let updatedPlayers = {};
  Object.entries(nextActivePlayers)
    .filter(([_, player]) => player.stage !== 'inactive')
    .forEach(([k, player]) => {
      updatedPlayers[k] = updatePlayerAction(resetPlayer(players[k]), player.stage);
  });
  return updatedPlayers;
}

export const nextActivePlayersFrom = (players, totalPlayers) => {
  const activePlayerIds = playerIds(players);
  const artistId = choosingPlayerIdFrom(players);
  const coArtistId = coArtistIdFrom(players);
  const guessPlayerIds = difference(activePlayerIds, [artistId, coArtistId]);
  const inactivePlayerIds = difference(range(totalPlayers).map( playerId => playerId.toString()), activePlayerIds);
  return {
    ...assignStageTo(artistId, 'drawCanvasOne'),
    ...assignStageTo(coArtistId, 'drawCanvasTwo'),
    ...assignStageTo(guessPlayerIds, 'guess'),
    ...assignStageTo(inactivePlayerIds, 'inactive')
  }
};

export const nextActivePlayersForSelectionFrom = (players, totalPlayers) => {
  const nextArtistId = nextArtistIdFrom(players);
  const activePlayerIds = playerIds(players);
  const waitingPlayerIds = difference(activePlayerIds, [nextArtistId])
  const inactivePlayerIds = difference(range(totalPlayers).map( playerId => playerId.toString()), activePlayerIds);
  return {
    ...assignStageTo(nextArtistId, 'choose'),
    ...assignStageTo(waitingPlayerIds, 'waiting'),
    ...assignStageTo(inactivePlayerIds, 'inactive')
  }
};

export const firstCanvasPlayerIdFrom = (players) => findKey(players, (player) => player.turn.action === 'drawCanvasOne');

export const secondCanvasPlayerIdFrom = (players) => findKey(players, (player) => player.turn.action === 'drawCanvasTwo');

export const artistIdFrom = (players) =>  choosingPlayerIdFrom(players)|| firstCanvasPlayerIdFrom(players);

export const choosingPlayerIdFrom = (players) => findKey(players, player => player.turn.action === 'choose');

const coArtistIdFrom = (players) => findKey(players, player => player.turn.coArtist);

export const playerNames = players => Object.entries(players).map( ([key, player]) => ({ playerId: key, playerName: player.game.name }));

export const makeCoArtist = (player) => ({ ...player, turn: { ...player.turn, coArtist: true }});

export const isCoArtistSelected = players => some(Object.values(players), player => player.turn.coArtist)

const playerIds = players => Object.keys(players);

const updatePlayerAction = (player, action) => ({ ...player, turn:{ ...player.turn, action }});

const resetPlayer = player => ({ ...player, turn:{ action:'', guessPosition: 0, hasGuessed: false, coArtist: false }});

const difference = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));

export const isChoosingStage = players => some(Object.values(players), player => player.turn.action === 'choose');

const assignStageTo = (playerIds, stage) => {
  const ids = Array.isArray(playerIds) ? playerIds : [ playerIds ];
  let activePlayers = {};
  ids.forEach(playerId => {
    activePlayers[playerId] = { stage }
  });
  return activePlayers;
};

export const nextArtistIdFrom = (players) => {
  const numOfPlayers = size(players);
  const currArtistId = artistIdFrom(players);
  if(isEmpty(currArtistId)) {
    return '0';
  } else {
    return ((parseInt(currArtistId) + 1) % numOfPlayers).toString();
  }
};
