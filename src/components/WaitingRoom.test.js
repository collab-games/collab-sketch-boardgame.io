import React from "react";
import {shallow} from "enzyme";
import WaitingRoom from "./WaitingRoom";
import PlayerList from "./PlayerList";
import {PlayFill} from "react-bootstrap-icons";
import Quote from './Quote';
import ShareGame from "./ShareGame";

describe('<WaitingRoom>', function () {
  it('should start the game', () => {
    const G = { players: {'0': {}, '1': {}, '2': {}} };
    const startGame = jest.fn();
    const component = shallow(<WaitingRoom isActive={true} startGame={startGame} playerID={'0'} G={G}/>);

    component.find('.start-game-button').simulate('click', { preventDefault: jest.fn() });
    expect(startGame).toHaveBeenCalled();
  });

  it('should not have option to start the game when player is not admin', () => {
    const G = { players: {'0': {}, '1': {}, '2': {}} };
    const startGame = jest.fn();
    const component = shallow(<WaitingRoom isActive={true} startGame={startGame} playerID={'1'} G={G}/>);

    expect(component.find('.start-game-button').exists()).toBeFalsy();
    expect(component.find(PlayFill).exists()).toBeFalsy();
    expect(component.find('.waiting-text').text()).toContain('Waiting for admin to start the Game');
  });

  it('should show players', () => {
    const startGame = jest.fn();
    const G = { players: {'0': {}, '1': {}, '2': {}} };
    const component = shallow(<WaitingRoom isActive={true} startGame={startGame} playerID={'0'} G={G}/>);

    const playerList = component.find(PlayerList);
    expect(playerList.props().G).toBe(G);
    expect(playerList.props().players).toEqual(G.players);
    expect(playerList.props().currentPlayerId).toBe('0');
  });

  it('should not start the game when players are less than minimum required players', () => {
    const G = { players: { '0': {}, '1': {} } };
    const startGame = jest.fn();
    const component = shallow(<WaitingRoom isActive={true} startGame={startGame} playerID={'0'} G={G}/>);

    component.find('.start-game-button').simulate('click', { preventDefault: jest.fn()});
    expect(startGame).not.toHaveBeenCalled();
  });

  it('should show quote for admin', () => {
    const G = { players: {'0': {}, '1': {}, '2': {}} };
    const startGame = jest.fn();
    const component = shallow(<WaitingRoom isActive={true} startGame={startGame} playerID={'0'} G={G}/>);

    const quote = component.find(Quote);
    expect(quote.exists()).toBeTruthy();
  });

  it('should show quote for players who are not admin', () => {
    const G = { players: {'0': {}, '1': {}, '2': {}} };
    const startGame = jest.fn();
    const component = shallow(<WaitingRoom isActive={true} startGame={startGame} playerID={'0'} G={G}/>);

    const quote = component.find(Quote);
    expect(quote.exists()).toBeTruthy();
  });

  it('should show information for sharing room', () => {
    const G = { players: {'0': {}, '1': {}, '2': {}} };
    const startGame = jest.fn();
    const component = shallow(<WaitingRoom isActive={true} startGame={startGame} playerID={'0'} G={G} gameID={'xf3dxf'}/>);

    const shareGame = component.find(ShareGame);
    expect(shareGame.props().gameID).toBe('xf3dxf');
  });

});