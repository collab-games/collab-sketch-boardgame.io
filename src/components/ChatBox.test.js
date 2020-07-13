import React from "react";
import { shallow } from "enzyme";

import ChatBox from './ChatBox';
import { Launcher } from "react-chat-window";

describe("<ChatBox>", () => {

  let guessArt;
  const currentPlayer = {
    game: {
      name: 'bond'
    }
  };
  beforeEach(() => {
    guessArt = jest.fn();
  });

  afterEach(() => {
    guessArt.mockReset();
  });

  it("should render chatbox with no messages", () => {
    const G = { chatMessages: {} };
    const wrapper = shallow(<ChatBox  G={G} currentPlayer={currentPlayer} isPlayerGuessing={true} moves={{guessArt}} />);
    expect(wrapper.find('input').exists()).toBeTruthy();
    expect(wrapper.find('p').exists()).toBeFalsy();
  });

  it("should send message via guessArt", () => {
    const G = { chatMessages: {} };
    const expectedMessage = 'collab sketch';
    const wrapper = shallow(<ChatBox currentPlayer={currentPlayer} G={G} isPlayerGuessing={true} moves={{guessArt}} />);
    wrapper.find('input').simulate('change', {target: {value: 'collab sketch'}});
    wrapper.find('input').simulate('keypress', {key: 'Enter'});
    expect(guessArt).toHaveBeenCalledWith(expectedMessage);
  });

  it("should not send an empty message", () => {
    const G = { chatMessages: {} };
    const wrapper = shallow(<ChatBox currentPlayer={currentPlayer} G={G} isPlayerGuessing={true} moves={{guessArt}} />);
    wrapper.find('input').simulate('change', {target: {value: ' '}});
    wrapper.find('input').simulate('keypress', {key: 'Enter'});
    expect(guessArt).not.toHaveBeenCalled();
  });

  it("should send not send message if player isn't guessing", () => {
    const G = { chatMessages: {} };
    const wrapper = shallow(<ChatBox currentPlayer={currentPlayer} G={G} isPlayerGuessing={false} moves={{guessArt}} />);
    wrapper.find('input').simulate('change', {target: {value: 'collab sketch'}});
    wrapper.find('input').simulate('keypress', {key: 'Enter'});
    expect(guessArt).not.toHaveBeenCalled();
  });
});