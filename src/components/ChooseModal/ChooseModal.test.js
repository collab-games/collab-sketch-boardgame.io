import React from "react";
import { shallow } from "enzyme";
import ChooseModal from "./ChooseModal";
import Button from "react-bootstrap/Button";
import ChoosePlayer from "./ChoosePlayer";
import ChooseWords from "./ChooseWords";

describe('<ChooseModal>', function () {
  it('should render choose player when word is already selected', function () {
    const choosePlayerFn = () => {};
    const chooseWordFn = () => {};
    const component = shallow(
      <ChooseModal words={[]} chooseWord={chooseWordFn} choosePlayer={choosePlayerFn} players={{}} currentPlayerId='0'/>
      );
    const choosePlayer = component.find(ChoosePlayer);

    expect(choosePlayer.exists()).toBeTruthy();
    expect(choosePlayer.props().choosePlayer).toBe(choosePlayerFn);
    expect(choosePlayer.props().players).toEqual({});
    expect(choosePlayer.props().currentPlayerId).toBe('0');

    expect(component.find(ChooseWords).exists()).toBeFalsy();
  });

  it('should render choose words when word are not selected', function () {
    const choosePlayerFn = () => {};
    const chooseWordFn = () => {};
    const words = ["hello world", "air cooler"];
    const component = shallow(
      <ChooseModal words={words} chooseWord={chooseWordFn} choosePlayer={choosePlayerFn} players={{}} currentPlayerId='0'/>
    );
    const chooseWords = component.find(ChooseWords);

    expect(chooseWords.exists()).toBeTruthy();
    expect(chooseWords.props().words).toBe(words);
    expect(chooseWords.props().chooseWord).toEqual(chooseWordFn);

    expect(component.find(ChoosePlayer).exists()).toBeFalsy();
  });
});
