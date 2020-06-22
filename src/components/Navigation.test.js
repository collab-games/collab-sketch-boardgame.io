import {shallow} from "enzyme";
import TurnTimer from "./TurnTimer";
import SelectionTimer from "./SelectionTimer";
import React from "react";
import Navigation from "./Navigation";
import {GameState} from "../constants";
import Button from "react-bootstrap/Button";

describe('<Navigation>', function () {
  const chooseWords = ["hello world", "air cooler"];
  const startGameMock = jest.fn();
  const endGameMock = jest.fn();
  const G = {
    settings: {
      rounds: 20
    },
    players: {
      '0': {turn: {action: 'choose'}, game: {}},
      '1': {turn: {action: 'waiting'}, game: {}},
      '2': {turn: {action: 'waiting'}, game: {}}
    },
    chooseWords: chooseWords,
    state: GameState.STARTED
  };
  const moves = {
    chooseWords: () => {},
    choosePlayer: () => {},
    startGame: startGameMock,
    endGame: endGameMock
  };
  const defaultProps = {
    G: G,
    ctx: {},
    moves: moves,
    playerID: '0',
    gameID: '',
    isActive: true
  };

  afterEach(() => {
    startGameMock.mockReset();
    endGameMock.mockReset();
  });

  it('should start the game', () => {
    const newG = { ...G, state: GameState.WAITING};
    const props = { ...defaultProps, G: newG };
    const component = shallow(<Navigation {...props} />);
    const startButton = component.find(Button);

    expect(startButton.text()).toContain("Start Game");
    startButton.simulate('click', { preventDefault: jest.fn() });
    expect(startGameMock).toHaveBeenCalled();
  });

  it('should be able to end the game when player is admin', () => {
    const component = shallow(<Navigation {...defaultProps} />);
    const endGameButton = component.find('.end-game-button');

    expect(endGameButton.text()).toContain("End Game");
    endGameButton.simulate('click', { preventDefault: jest.fn() });
    expect(endGameMock).toHaveBeenCalled();
  });

  it('should not be able to end the game when player is not admin', () => {
    const props = { ...defaultProps, playerID: '1'};
    const component = shallow(<Navigation {...props}/>);

    const endGameButton = component.find('.end-game-button');
    expect(endGameButton.length).toBe(0);
  });

  it('should not start the game when players are less than minimum required players', () => {
    const newG = { ...G, state: GameState.WAITING, players: { '0': {}, '1': {} }};
    const props = { ...defaultProps, G: newG };
    const component = shallow(<Navigation {...props}/>);

    component.find(Button).simulate('click', { preventDefault: jest.fn()});
    expect(startGameMock).not.toHaveBeenCalled();
  });

  it('should not have option to start the game when player is not admin', () => {
    const newG = { ...G, state: GameState.WAITING};
    const props = { ...defaultProps, G: newG, playerID: '1'}
    const component = shallow(<Navigation {...props}/>);

    expect(component.find(Button).exists()).toBeFalsy();
  });

  it('should show TurnTimer if current stage is not choosing', function () {
    const newG = { ...defaultProps.G, players: {'0': {turn: {action: 'drawCanvasOne'}}}};
    const props = {...defaultProps, G: newG};

    const component = shallow(<Navigation {...props} />);
    const turnTimer = component.find(TurnTimer);
    expect(turnTimer.props().G).toEqual(newG);
    expect(turnTimer.props().ctx).toEqual({});
    expect(turnTimer.props().moves).toEqual(moves);
  });

  it('should show Selection if current stage is choosing', function () {
    const newG = { ...defaultProps.G, players: {'0': {turn: {action: 'choose'}}}};
    const props = {...defaultProps, G: newG};

    const component = shallow(<Navigation {...props} />);
    const turnTimer = component.find(SelectionTimer);
    expect(turnTimer.props().G).toEqual(newG);
    expect(turnTimer.props().ctx).toEqual({});
    expect(turnTimer.props().moves).toEqual(moves);
  });
});