import React from "react";
import { shallow, mount } from "enzyme";
import CardFront from "./CardFront";
import Button from "react-bootstrap/Button";
import FormControl from 'react-bootstrap/FormControl';


describe('<CardFront>', function () {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should create game and pass gameId to parent', async () => {
    const gameId = 'EEEE4444';
    const playerId = "1";
    const playerSecret = 'RRRR2222';
    const joinRoomAction = jest.fn();
    const history = { push: jest.fn() };
    const wrapper = shallow(<CardFront joinRoomAction={joinRoomAction} browserHistory={history} />);
    const createRoomButton = wrapper.find(Button).at(0);
    const playerNameInput = wrapper.find(FormControl);
    expect(createRoomButton.text()).toContain("Create Room");

    playerNameInput.simulate('change', { currentTarget: { value: 'Alexander' } });

    wrapper.update();
    fetch.mockResponseOnce(req => {
        return ((req.url === 'http://localhost:8001/create') && (JSON.parse(req.body).playerName === 'Alexander'))
          ? Promise.resolve(JSON.stringify({ gameId: gameId, playerId: playerId, playerSecret: playerSecret}))
          : Promise.reject(new Error('bad url'));
    }

    );
    createRoomButton.simulate('click', { preventDefault: jest.fn() });
    await flushPromises();
    expect(history.push).toHaveBeenCalledWith(`/${gameId}/${playerId}`);
  });

  it('should render join game options', async () => {
    const joinRoomAction = jest.fn();
    const wrapper = shallow(<CardFront joinRoomAction={joinRoomAction} browserHistory={{}}/>);
    const joinRoomButton = wrapper.find(Button).at(1);
    expect(joinRoomButton.text()).toContain("Join Room");

    const playerNameInput = wrapper.find(FormControl);
    playerNameInput.simulate('change', { currentTarget: { value: 'Alexander' } });

    joinRoomButton.simulate('click', { preventDefault: jest.fn() });
    expect(joinRoomAction).toHaveBeenCalledWith({playerName: 'Alexander'});
  });
});