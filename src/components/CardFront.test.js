import React from "react";
import { shallow, mount } from "enzyme";
import CardFront from "./CardFront";
import Button from "react-bootstrap/Button";


describe('<CardFront>', function () {
  beforeEach(() => {
    fetch.resetMocks();
  });
  it('should create game and pass gameId to parent', async () => {
    const gameId = 'EEEE4444';
    const roomId = 'RRRR2222';
    const createRoomAction = jest.fn();
    const joinRoomAction = jest.fn();
    const wrapper = shallow(<CardFront createRoomAction={createRoomAction} joinRoomAction={joinRoomAction}/>);
    const createRoomButton = wrapper.find(Button).at(0);
    expect(createRoomButton.text()).toContain("Create Room");

    fetch.mockResponseOnce(req =>
      req.url === 'http://localhost:8001/create'
        ? Promise.resolve(JSON.stringify({ gameId: gameId, roomId: roomId }))
        : Promise.reject(new Error('bad url'))
    );
    createRoomButton.simulate('click');
    await flushPromises();
    expect(createRoomAction).toHaveBeenCalledWith({ gameId: "", roomId: "" });
    expect(createRoomAction).toHaveBeenCalledWith({ gameId: gameId, roomId: roomId });
  });

  it('should render join game options', async () => {
    const createRoomAction = jest.fn();
    const joinRoomAction = jest.fn();
    const wrapper = shallow(<CardFront createRoomAction={createRoomAction} joinRoomAction={joinRoomAction}/>);
    const joinRoomButton = wrapper.find(Button).at(1);
    expect(joinRoomButton.text()).toContain("Join Room");

    joinRoomButton.simulate('click');
    expect(joinRoomAction).toHaveBeenCalled();
  });
});