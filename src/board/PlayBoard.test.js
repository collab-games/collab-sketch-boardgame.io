import React from "react";
import { shallow } from "enzyme";
import PlayBoard from "./PlayBoard";
import PlayArea from "../components/PlayArea";
import TurnTimer from "../components/TurnTimer";
import SelectionTimer from "../components/SelectionTimer";

describe('<PlayBoard>', function () {
  const chooseWords = ["hello world", "air cooler"];
  const G = {
    players: {
      '0': {turn: {action: 'choose'}, game: {}},
      '1': {turn: {action: 'waiting'}, game: {}}
    },
    chooseWords: chooseWords
  };
  const moves = {
    chooseWords: () => {},
    choosePlayer: () => {}
  };
  const defaultProps = {
    G: G,
    ctx: {},
    moves: moves,
    playerID: '0',
    isActive: true
  };

  it('should render play area', function () {
    const component = shallow(<PlayBoard {...defaultProps} />);
    const playArea = component.find(PlayArea);

    expect(playArea.props().G).toEqual(G);
    expect(playArea.props().ctx).toEqual({});
    expect(playArea.props().moves).toEqual(moves);
    expect(playArea.props().playerID).toEqual('0');
    expect(playArea.props().isActive).toEqual(true);
  });
});