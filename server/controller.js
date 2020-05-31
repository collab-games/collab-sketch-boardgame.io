import Router from "koa-router";
import request from "superagent";
import {INTERNAL_API_PORT} from "../src/constants";
import CollabSketch from "../src/game/Game";
import koaBody from "koa-body";
import { DEFAULT_NUM_OF_PLAYERS} from "../src/constants";

const router = new Router();


router.get('/players/:id', async ctx => {
  const gameID = ctx.params.id;
  const r = await request
    .get(`http://localhost:${INTERNAL_API_PORT}/games/${CollabSketch.name}/${gameID}`);
  ctx.body = r.body;
});

router.post('/create', koaBody(), async ctx => {
  const r = await request
    .post(`http://localhost:${INTERNAL_API_PORT}/games/${CollabSketch.name}/create`)
    .send({
      numPlayers: DEFAULT_NUM_OF_PLAYERS,
    });

  const gameId = r.body.gameID;
  const playerId = 0;
  const { playerName } = JSON.parse(ctx.request.body);

  const player = await joinPlayer(gameId, playerId, playerName);

  ctx.body = {
    gameId: gameId,
    playerId: playerId,
    credentials: player.body.playerCredentials,
  };
});


router.post('/join/:gameId', koaBody(), async ctx => {
  const { playerName } = JSON.parse(ctx.request.body);
  const { gameId } = ctx.params;

  const players = await getAllPlayers(gameId);

  let playerId = getActivePlayers(players.body.players).length;
  const player = await joinPlayer(gameId, playerId, playerName);

  ctx.body = {
    gameId: gameId,
    playerId: playerId,
    credentials: player.body.playerCredentials,
  };
});

const getActivePlayers = (players) => players.filter(player => !!player.name);

const getAllPlayers = async (gameId) => {
  return request
    .get(`http://localhost:${INTERNAL_API_PORT}/games/${CollabSketch.name}/${gameId}`);
};

const joinPlayer = async (gameId, playerId, playerName) => {
  return request
    .post(`http://localhost:${INTERNAL_API_PORT}/games/${CollabSketch.name}/${gameId}/join`)
    .send({
      playerID: playerId,
      playerName,
    });
};


export default router;