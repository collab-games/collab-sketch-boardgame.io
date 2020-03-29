import { Server } from 'boardgame.io/server';
import Router from 'koa-router';
import Koa from 'koa';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import { getDatabase } from './config';
import request from 'superagent';
import { SERVER_PORT, API_PORT, INTERNAL_API_PORT } from './constants';
import times from 'lodash/times';
import random from 'lodash/random';

import CollabSketch from "./game/Game";

const app = new Koa();
const router = new Router();

const server = Server({
    games: [CollabSketch],
    db: getDatabase(),
});

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
            numPlayers: 2,
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


const uniqueId = () => {
    return times(8, () => random(35).toString(36)).join('');
};

const serverHandle = server.run({
    port: SERVER_PORT,
    callback: () => {
        console.log(`Serving at: http://localhost:${SERVER_PORT}/`);
    },
    lobbyConfig: {
        apiPort: INTERNAL_API_PORT,
        uuid: uniqueId,
        apiCallback: () => {
            console.log(`Internal API serving at: http://localhost:${INTERNAL_API_PORT}/`);
        },
    }
});

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());
const appHandle = app.listen(API_PORT, () => {
    console.log(`API serving at: http://localhost:${API_PORT}/`);
});

export {
    app,
    server,
    serverHandle,
    appHandle,
}
