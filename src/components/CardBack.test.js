import React from "react";
import { shallow } from "enzyme";

import CardBack from "./CardBack";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

describe('<CardBack>', function () {

  it('should render card with image and join room options', function () {
    const wrapper = shallow(<CardBack />);
    const card = wrapper.find(Card);

    expect(card.find(InputGroup).exists()).toBeTruthy();
    expect(card.find(InputGroup).find(InputGroup.Text).text()).toContain("Room Code");
    expect(card.find(InputGroup).find(FormControl).exists()).toBeTruthy();

    expect(card.find(Button).text()).toContain("Join Room");
  });

  it('should render disabled buttons by default', () => {
    const wrapper = shallow(<CardBack />);
    const joinRoomButton = wrapper.find(Button).at(0);
    expect(joinRoomButton.props().disabled).toBeTruthy();
  });

  it('should enable buttons on change of room code', () => {
    const wrapper = shallow(<CardBack />);
    const roomCodeInput = wrapper.find(FormControl);
    roomCodeInput.simulate('change', { currentTarget: { value: '81230123' } });
    const joinRoomButton = wrapper.find(Button).at(0);
    expect(joinRoomButton.props().disabled).toBeFalsy();
  });

  it('should join game and redirect to game page', async () => {
    const gameId = 'EEEE4444';
    const playerId = "1";
    const playerSecret = 'RRRR2222';
    const history = { push: jest.fn() };
    const wrapper = shallow(<CardBack playerName={'Alexander'} browserHistory={history} />);
    const joinRoomButton = wrapper.find(Button).at(0);
    const roomCodeInput = wrapper.find(FormControl);

    roomCodeInput.simulate('change', { currentTarget: { value: 'EEEE4444' } });

    wrapper.update();
    fetch.mockResponseOnce(req => {
          return ((req.url === 'http://localhost:8001/join/EEEE4444') && (JSON.parse(req.body).playerName === 'Alexander'))
              ? Promise.resolve(JSON.stringify({ gameId: gameId, playerId: playerId, playerSecret: playerSecret}))
              : Promise.reject(new Error('bad url'));
        }

    );
    joinRoomButton.simulate('click', { preventDefault: jest.fn() });
    await flushPromises();
    expect(history.push).toHaveBeenCalledWith(`/${gameId}/${playerId}`);
  });
});