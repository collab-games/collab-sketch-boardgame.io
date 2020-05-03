import React from "react";
import {shallow} from "enzyme";
import WaitingRoom from "./WaitingRoom";
import Button from 'react-bootstrap/Button';
import PlayerList from "./PlayerList";

describe('<WaitingRoom>', function () {
  it('should start the game', () => {
    const G = { players: {'0': {}, '1': {}, '2': {}} };
    const startGame = jest.fn();
    const component = shallow(<WaitingRoom isActive={true} startGameMove={startGame} playerID={'0'} G={G}/>);

    component.find(Button).simulate('click');
    expect(startGame).toHaveBeenCalled();
  });

  it('should not have optoin to start the game when player is not admin', () => {
    const G = { players: {'0': {}, '1': {}, '2': {}} };
    const startGame = jest.fn();
    const component = shallow(<WaitingRoom isActive={true} startGameMove={startGame} playerID={'1'} G={G}/>);

    expect(component.find(Button).exists()).toBeFalsy();
  });

  it('should show players', () => {
    const startGame = jest.fn();
    const G = { players: {'0': {}, '1': {}, '2': {}} };
    const component = shallow(<WaitingRoom isActive={true} startGameMove={startGame} playerID={'0'} G={G}/>);

    const playerList = component.find(PlayerList);
    expect(playerList.props().G).toBe(G);
    expect(playerList.props().players).toEqual(G.players);
    expect(playerList.props().currentPlayerId).toBe('0');
  });

  it('should not start the game when players are less than minimum required players', () => {
    const G = { players: { '0': {}, '1': {} } };
    const startGame = jest.fn();
    const component = shallow(<WaitingRoom isActive={true} startGameMove={startGame} playerID={'0'} G={G}/>);

    component.find(Button).simulate('click');
    expect(startGame).not.toHaveBeenCalled();
  });
});