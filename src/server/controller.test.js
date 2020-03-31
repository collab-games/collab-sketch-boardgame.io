import Koa from 'koa';
import cors from "@koa/cors";
import router from "./controller";
import React from "react";
// const fetch = require("jest-fetch-mock");
jest.mock('node-fetch', () => global.fetch);


const request = require("supertest");
const app = new Koa();

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

describe("Contoller", () => {
    it("create game", done => {
        const gameId = 'EEEE4444';
        fetch.mockResponseOnce(req => {
            return ((req.url === 'http://localhost:8002/games/collab-sketch/create'))
                ? Promise.resolve(JSON.stringify({ gameID: gameId }))
                : Promise.reject(new Error('bad url'));
        });
        fetch.mockResponseOnce(req => {
            return ((req.url === 'http://localhost:8002/games/collab-sketch/EEEE4444/join'))
                ? Promise.resolve(JSON.stringify({ gameID: gameId }))
                : Promise.reject(new Error('bad url'));
        });
        request(app.callback())
            .post("/create")
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({ playerName: 'Alex' }))
            // .expect("Content-Type", /json/)
            .expect(200, done)
            .expect({ name: "frodo" });
    });
});

