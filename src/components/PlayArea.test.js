import React from "react";
import { shallow } from 'enzyme';
import ChooseModal from "./ChooseModal/ChooseModal";
import PlayArea from "./PlayArea";

describe('<PlayArea>', function () {
  const chooseWords = ["hello world", "air cooler"];
  const G = {
    players: {
      '0': {turn: {action: 'choose'}, game: {}},
      '1': {turn: {action: 'waiting'}, game: {}}
    },
    chooseWords: chooseWords,
    settings: {
      selectionPeriod: 10,
      turnPeriod: 60
    }
  };
  const moves = {
    chooseWords: () => {},
    choosePlayer: () => {}
  };
  const defaultProps = {
    G: G,
    ctx: {
      activePlayers: {'0': 'drawCanvasOne'}
    },
    moves: moves,
    playerID: '0',
    isActive: true
  };

  it('should show modal to choose player and game if the current player is in choosing action', function () {
    const component = shallow(<PlayArea {...defaultProps} />);
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
    const component = shallow(<PlayArea {...props} />);
    const chooseModal = component.find(ChooseModal);
    expect(chooseModal.props().show).toEqual(false);
  });
});
