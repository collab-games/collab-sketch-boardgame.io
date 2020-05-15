import React from "react";
import { shallow } from "enzyme";
import PlayBoard from "./PlayBoard";
import PlayArea from "../components/PlayArea";
import ChooseModal from "../components/ChooseModal/ChooseModal";
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

  it('should show modal to choose player and game if the current player is in choosing action', function () {
    const component = shallow(<PlayBoard {...defaultProps} />);
    const chooseModal = component.find(ChooseModal);

    expect(chooseModal.props().words).toEqual(chooseWords);
    expect(chooseModal.props().chooseWord).toEqual(moves.chooseWord);
    expect(chooseModal.props().choosePlayer).toEqual(moves.choosePlayer);
    expect(chooseModal.props().players).toEqual(G.players);
    expect(chooseModal.props().currentPlayerId).toEqual('0');
    expect(chooseModal.props().show).toEqual(true);
  });

  it('should not show modal to choose player and game if the current player is not in choosing action', function () {
    const props = {...defaultProps, playerID: '1'};
    const component = shallow(<PlayBoard {...props} />);
    const chooseModal = component.find(ChooseModal);
    expect(chooseModal.props().show).toEqual(false);
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