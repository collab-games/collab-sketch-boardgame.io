import { Server } from 'boardgame.io/server';
import Koa from 'koa';
import cors from '@koa/cors';
import { getDatabase } from '../src/config';
import { SERVER_PORT, API_PORT, INTERNAL_API_PORT } from '../src/constants';
import times from 'lodash/times';
import random from 'lodash/random';

import router from './controller';
import CollabSketch from "./game/Game";

const app = new Koa();

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());
const appHandle = app.listen(API_PORT, () => {
    console.log(`API serving at: http://localhost:${API_PORT}/`);
});

const uniqueId = () => {
    return times(8, () => random(35).toString(36)).join('');
};

const server = Server({
    games: [CollabSketch],
    db: getDatabase(),
});

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

export {
    app,
    server,
    serverHandle,
    appHandle,
}
