export const SERVER_PORT = process.env.SERVER_PORT || 8000;
export const API_PORT = process.env.API_PORT || 8001;
export const INTERNAL_API_PORT = process.env.INTERNAL_API_PORT || 8002;

export const GameState = {
    WAITING: 0,
    STARTED: 1,
    ENDED: 2
};

export const MIN_PLAYERS_REQUIRED = 3;

export const DEFAULT_NUM_OF_PLAYERS = 20;
export const DEFAULT_NUM_OF_ROUNDS = process.env.DEFAULT_NUM_OF_ROUNDS || 3;
