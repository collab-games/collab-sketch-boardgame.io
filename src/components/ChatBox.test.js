import React from "react";
import { shallow } from "enzyme";

import ChatBox from './ChatBox';
import { Launcher } from "react-chat-window";

describe("<ChatBox>", () => {

  let guessArt;
  const currentPlayer = {
    name: 'bond',
    id: 0
  };
  beforeEach(() => {
    guessArt = jest.fn();
  });

  afterEach(() => {
    guessArt.mockReset();
  });

  it("should render chatbox with no messages", () => {
    const G = { chatMessages: [] };
    const wrapper = shallow(<ChatBox  G={G} currentPlayer={currentPlayer} isPlayerGuessing={true} moves={{guessArt}} />);
    expect(wrapper.find(Launcher).exists()).toBeTruthy();
    expect(wrapper.find(Launcher).props().messageList).toEqual([]);
  });

  it("should send message via guessArt", () => {
    const G = { chatMessages: [ {} ] };
    const message = {
      type: 'text',
      data: { text: 'hello' },
      author: 'me'
    };
    const expectedMessage = {
      type: 'text',
      data: { text: 'bond: hello' },
      author: 'me'
    };
    const wrapper = shallow(<ChatBox currentPlayer={currentPlayer} G={G} isPlayerGuessing={true} moves={{guessArt}} />);
    expect(wrapper.find(Launcher).exists()).toBeTruthy();
    wrapper.find(Launcher).props().onMessageWasSent(message);
    expect(guessArt).toHaveBeenCalledWith(expectedMessage);
  });

  it("should send not send message if player isn't guessing", () => {
    const G = { chatMessages: [ {} ] };
    const message = {
      type: 'text',
      data: { text: 'hello' },
      author: 'me'
    };
    const wrapper = shallow(<ChatBox currentPlayer={currentPlayer} G={G} isPlayerGuessing={false} moves={{guessArt}} />);
    expect(wrapper.find(Launcher).exists()).toBeTruthy();
    wrapper.find(Launcher).props().onMessageWasSent(message);
    expect(guessArt).not.toHaveBeenCalled();
  });
});