import findKey from 'lodash/findKey';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import range from 'lodash/range';

export const newPlayer = (playerName) => ({
  game: {
    joined: true,
    name: playerName,
    score: 0,
  },
  turn: {
    score: 0,
    action: '',
    hasGuessed: false,
    guessPosition: 0,
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
  const artistIds = nextArtistIdsFrom(players);
  const guessPlayerIds = difference(activePlayerIds, artistIds);
  const inactivePlayerIds = difference(range(totalPlayers), activePlayerIds);
  const activePlayers = {
    ...assignStageTo(artistIds[0], 'drawCanvasOne'),
    ...assignStageTo(artistIds[1], 'drawCanvasTwo'),
    ...assignStageTo(guessPlayerIds, 'guess'),
    ...assignStageTo(inactivePlayerIds, 'inactive')
  }
  return activePlayers;
};

export const firstCanvasPlayerIdFrom = (players) => findKey(players, (player) => player.turn.action === 'drawCanvasOne');

export const secondCanvasPlayerIdFrom = (players) => findKey(players, (player) => player.turn.action === 'drawCanvasTwo');

const playerIds = players => Object.keys(players).map( key => parseInt(key));

const updatePlayerAction = (player, action) => ({ ...player, turn:{ score: player.turn.score, action}});

const resetPlayer = player => ({ ...player, turn:{ score: 0, action:''}});

const difference = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));

const assignStageTo = (playerIds, stage) => {
  const ids = Array.isArray(playerIds) ? playerIds : [ playerIds ];
  let activePlayers = {};
  ids.forEach(playerId => {
    activePlayers[playerId] = { stage }
  });
  return activePlayers;
};

const currentArtistIdsFrom = (players) => {
  const firstArtist = firstCanvasPlayerIdFrom(players);
  const secondArtist = secondCanvasPlayerIdFrom(players);
  if ( firstArtist && secondArtist) {
    return [ parseInt(firstArtist), parseInt(secondArtist) ]
  } else {
    return [];
  }
}

const nextArtistIdsFrom = (players) => {
  const numOfPlayers = size(players);
  const currArtistIds = currentArtistIdsFrom(players);
  if(isEmpty(currArtistIds)) {
    return [0, 1];
  } else {
    return [ (currArtistIds[1] + 1) % numOfPlayers, (currArtistIds[1] + 2) % numOfPlayers];
  }
};
