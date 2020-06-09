import React from "react";
import { shallow } from "enzyme";
import PlayerList from "./PlayerList";
import ListGroup from "react-bootstrap/ListGroup";
import UIfx from 'uifx';
import cloneDeep from 'lodash/cloneDeep';
import {GameState} from "../constants";

  jest.mock('uifx', () => jest.fn())  ;

describe('<PlayerList>', function () {

  let players;
  let play;

  beforeEach(() => {
    play = jest.fn();
    UIfx.mockImplementation(() => ({play}));
    players = {
      '0' : { game: { joined: true, name: 'bond', score: 10 }, turn: { hasGuessed: false }},
      '1' : { game: { joined: true, name: 'abc', score: 30 }, turn: { hasGuessed: true }},
      '2' : { game: { joined: true, name: 'def', score: 20 }, turn: { hasGuessed: false }}
    };
  });

  it('should render players list header', () => {
    const wrapper = shallow(<PlayerList players={{}}/>);
    expect(wrapper.find('section').find('h2').text()).toContain('Leader Board');
  });

  it('should render players', () => {
    const wrapper = shallow(<PlayerList players={players} currentPlayerId={'1'}/>);
    expect(wrapper.find(ListGroup.Item).length).toEqual(3);
    expect(wrapper.find(ListGroup.Item).at(0).text()).toContain('abc');
    expect(wrapper.find(ListGroup.Item).at(1).text()).toContain('def');
    expect(wrapper.find(ListGroup.Item).at(2).text()).toContain('bond');

    expect(wrapper.find(ListGroup.Item).at(0).text()).toContain('30');
    expect(wrapper.find(ListGroup.Item).at(1).text()).toContain('20');
    expect(wrapper.find(ListGroup.Item).at(2).text()).toContain('10');

    expect(wrapper.find(ListGroup.Item).at(0).props().variant).toContain('success');
  });

  it('should highLight current player', () => {
    const wrapper = shallow(<PlayerList players={players} currentPlayerId={'1'}/>);
    expect(wrapper.find(ListGroup.Item).at(1).find('span').exists()).toBeTruthy();
  });

  it('should play sound on correct guess', () => {
    const wrapper = shallow(<PlayerList G={{state: GameState.STARTED}} players={players} currentPlayerId={'1'}/>);
    const updatedPlayers = cloneDeep(players);
    updatedPlayers['1'].game.score = 50;
    wrapper.setProps({ players: updatedPlayers });
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('should play sound on other players guess', () => {
    const wrapper = shallow(<PlayerList G={{state: GameState.STARTED}} players={players} currentPlayerId={'1'}/>);
    const updatedPlayers = cloneDeep(players);
    updatedPlayers['2'].game.score = 30;
    wrapper.setProps({ players: updatedPlayers });
    expect(play).toHaveBeenCalledTimes(1);
  });
});
