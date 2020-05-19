import React from "react";
import { shallow } from 'enzyme';
import ChooseModal from "./ChooseModal";
import Button from "react-bootstrap/Button";
import ChoosePlayer from "./ChoosePlayer";

describe('<ChoosePlayer>', function () {
  const players = {
    '0':{game: {name: 'Amar'}, turn: {action: 'choose'}},
    '1':{game: {name: 'Akbar'}, turn: {action: 'waiting'}},
    '2':{game: {name: 'Antony'}, turn: {action: 'waiting'}}
  };

  const choosePlayerFn = jest.fn();

  const component = shallow(
    <ChoosePlayer choosePlayer={choosePlayerFn} players={players} currentPlayerId={'0'} />
  );

  it('should render only waiting players', function () {
    const buttons = component.find(Button);
    expect(buttons.length).toBe(2);
    expect(buttons.at(0).text()).toBe(players[1].game.name);
    expect(buttons.at(1).text()).toBe(players[2].game.name);
  });

  it('should choose Akbar when clicked on Akbar button', () => {
    const buttons = component.find(Button);
    expect(buttons.at(0).text()).toEqual('Akbar');

    buttons.at(0).simulate('click');
    expect(choosePlayerFn).toHaveBeenCalledWith('1');
  });

  it('should choose Antony when clicked on Antony button', () => {
    const buttons = component.find(Button);
    expect(buttons.at(1).text()).toEqual('Antony');

    buttons.at(1).simulate('click');
    expect(choosePlayerFn).toHaveBeenCalledWith('2');
  });
});