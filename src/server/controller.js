import Router from "koa-router";
import request from "superagent";
import {INTERNAL_API_PORT} from "../constants";
import CollabSketch from "./game/Game";
import koaBody from "koa-body";
import fetch from 'node-fetch';
const router = new Router();


router.get('/players/:id', async ctx => {
  const gameID = ctx.params.id;
  const r = await request
    .get(`http://localhost:${INTERNAL_API_PORT}/games/${CollabSketch.name}/${gameID}`);
  ctx.body = r.body;
});

router.post('/create', koaBody(), async ctx => {

  const r = await fetch(`http://localhost:${INTERNAL_API_PORT}/games/${CollabSketch.name}/create`,
      { method: 'POST', body: JSON.stringify({ numPlayers: 2 } )});
  const { gameID } = await r.json();
  const playerId = 0;
  const { playerName } = JSON.parse(ctx.request.body);
  console.log(playerName, 'sss');
  const player = await joinPlayer(gameID, playerId, playerName);
  ctx.body = {
    gameId: gameID,
    playerId: playerId,
    credentials: player.body.playerCredentials,
  };
});


router.post('/join/:gameId', koaBody(), async ctx => {
  const { playerName } = JSON.parse(ctx.request.body);
  const { gameId } = ctx.params;
  // const response = await getAllPlayers(gameId);

  let playerId = 1;
  const player = await joinPlayer(gameId, playerId, playerName);

  ctx.body = {
    gameId: gameId,
    playerId: playerId,
    credentials: player.body.playerCredentials,
  };
});

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