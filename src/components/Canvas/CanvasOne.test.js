import React from "react";
import { shallow } from 'enzyme';
import CanvasOne from "./CanvasOne";
import ReadOnlyCanvas from "./ReadOnlyCanvas";
import Canvas from "./Canvas";
import {repeat} from "lodash";

describe('<CanvasOne>', function () {
  const G = {
    players: {
      '0': {turn: {action: 'guess'}, game: {}},
      '1': {turn: {action: 'drawCanvasOne'}, game: {name: 'John'}},
      '2': {turn: {action: 'drawCanvasTwo'}, game: {}}
    },
    canvasOne: {snapshot: null, svg: "", chars: 5},
    word: 'hello world'
  };

  const ctx = {
    activePlayers: {
      '1': 'drawCanvasOne'
    }
  };
  const moves = {
    guessArt: () => {},
    endTurn: () => {},
    updateSnapshotForCanvasOne: () => {}
  };

  it('should render read only canvas if current player is not drawing', function () {
    const component = shallow(
      <CanvasOne isActive={true} playerID='0' G={G} ctx={ctx} moves={moves} />
    );

    const readOnlyCanvas = component.find(ReadOnlyCanvas);
    expect(readOnlyCanvas.exists()).toBeTruthy();
    expect(readOnlyCanvas.props().svgText).toEqual(G.canvasOne.svg);
    expect(readOnlyCanvas.props().artistName).toEqual('John');
  });

  it('should render Grid canvas if current player is canvas one artist', function () {
    const component = shallow(
      <CanvasOne isActive={true} playerID='1' G={G} ctx={ctx} moves={moves} />
    );

    const canvasGrid = component.find(Canvas);
    expect(canvasGrid.exists()).toBeTruthy();
    expect(canvasGrid.props().snapshot).toEqual(G.canvasOne.snapshot)
    expect(canvasGrid.props().updateSnapshot).toEqual(moves.updateSnapshotForCanvasOne);
  });

  it('should not render Grid canvas if current player is canvas two artist', function () {
    const component = shallow(
      <CanvasOne isActive={true} playerID='2' G={G} ctx={ctx} moves={moves} />
    );

    const canvasGrid = component.find(Canvas);
    expect(canvasGrid.exists()).toBeFalsy();
  });

  it('should render drawing word if player is canvas one artist', function () {
    const component = shallow(
      <CanvasOne isActive={true} playerID='1' G={G} ctx={ctx} moves={moves} />
    );

    expect(component.find('.word').text()).toContain(G.word);
  });

  it('should render blanks if player is not canvas two artist', function () {
    const component = shallow(
      <CanvasOne isActive={true} playerID='2' G={G} ctx={ctx} moves={moves} />
    );

    expect(component.find('.word').text()).toEqual(repeat('_ ', G.canvasOne['chars']));
  });

  it('should render blanks if player is not drawing', function () {
    const component = shallow(
      <CanvasOne isActive={true} playerID='0' G={G} ctx={ctx} moves={moves} />
    );

    expect(component.find('.word').text()).toEqual(repeat('_ ', G.canvasOne['chars']));
  });
});