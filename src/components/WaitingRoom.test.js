import React from "react";
import {shallow} from "enzyme";
import WaitingRoom from "./WaitingRoom";
import PlayerList from "./PlayerList";
import Quote from './Quote';
import ShareGame from "./ShareGame";

describe('<WaitingRoom>', function () {

  it('should wait for admin to start the game', () => {
    const G = { players: {'0': { game: { name: 'James' }}, '1': {}, '2': {}} };
    const startGame = jest.fn();
    const component = shallow(<WaitingRoom isActive={true} startGame={startGame} playerID={'1'} G={G}/>);

    expect(component.find('.waiting-text').text()).toContain('Waiting for James to start the Game');
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