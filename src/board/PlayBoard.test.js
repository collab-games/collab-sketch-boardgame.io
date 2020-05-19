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

  it('should show TurnTimer if current stage is not choosing', function () {
    const newG = { ...defaultProps.G, players: {'0': {turn: {action: 'drawCanvasOne'}}}};
    const props = {...defaultProps, G: newG};

    const component = shallow(<PlayBoard {...props} />);
    const turnTimer = component.find(TurnTimer);
    expect(turnTimer.props().G).toEqual(newG);
    expect(turnTimer.props().ctx).toEqual({});
    expect(turnTimer.props().moves).toEqual(moves);
  });

  it('should show Selection if current stage is choosing', function () {
    const newG = { ...defaultProps.G, players: {'0': {turn: {action: 'choose'}}}};
    const props = {...defaultProps, G: newG};

    const component = shallow(<PlayBoard {...props} />);
    const turnTimer = component.find(SelectionTimer);
    expect(turnTimer.props().G).toEqual(newG);
    expect(turnTimer.props().ctx).toEqual({});
    expect(turnTimer.props().moves).toEqual(moves);
  });
});