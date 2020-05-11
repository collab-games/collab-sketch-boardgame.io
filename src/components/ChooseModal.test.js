import React from "react";
import { shallow } from "enzyme";
import ChooseModal from "./ChooseModal";
import Button from "react-bootstrap/Button";

describe('<ChooseModal>', function () {
  it('should render words', function () {
    const words = ["word1", "word2", "word3"];
    const component = shallow(
      <ChooseModal words={words} chooseWord={jest.fn()} choosePlayer={jest.fn()} players={{'0':{game: {name: 'John'}, turn: {action: 'choose'}}}} currentPlayerId={'0'} />
    );

    const buttons = component.find(Button);
    expect(buttons.length).toBe(3);
    expect(buttons.at(0).text()).toBe(words[0]);
    expect(buttons.at(1).text()).toBe(words[1]);
    expect(buttons.at(2).text()).toBe(words[2]);

  });

  it('should render players', function () {
    const words = ["word1", "word2", "word3"];
    const players = {
      '0':{game: {name: 'Amar'}, turn: {action: 'choose'}},
      '1':{game: {name: 'Akbar'}, turn: {action: 'waiting'}},
      '2':{game: {name: 'Antony'}, turn: {action: 'waiting'}}
    };

    const component = shallow(
      <ChooseModal words={words} chooseWord={jest.fn()} choosePlayer={jest.fn()} players={players} currentPlayerId={'0'} />
    );

    const buttons = component.find(Button);
    expect(buttons.length).toBe(5);
    expect(buttons.at(3).text()).toBe(players[1].game.name);
    expect(buttons.at(4).text()).toBe(players[2].game.name);
  });
});
