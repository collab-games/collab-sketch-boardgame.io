import React from "react";
import { shallow, mount } from "enzyme";

import Lobby from './Lobby';
import CardFront from './CardFront'
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import CardBack from "./CardBack";

describe("<Lobby>", () => {
  it("should render Game name", () => {
    const wrapper = shallow(<Lobby />);
    expect(wrapper.find(Navbar).exists()).toBeTruthy();
    expect(wrapper.find(Navbar).text()).toContain("Collab Games");
  });

  it("should render create game block", () => {
    const wrapper = shallow(<Lobby />);
    expect(wrapper.find(CardFront).exists()).toBeTruthy();
  });

  it("should flip the card and show gameId to join", () => {
    const wrapper = shallow(<Lobby />);
    const cardFront = wrapper.find(CardFront);
    const roomId = "RRRR2222";
    cardFront.props().createRoomAction({ gameId: "EEEE4444", roomId: roomId });

    expect(wrapper.find(CardBack).props().roomId).toContain(roomId);
  });

  it("should render create room and join room options", () => {
    const wrapper = mount(<Lobby />);
    const card = wrapper.find(CardFront).find(Card);

    expect(card.find(Button).at(0).text()).toContain("Create Room");
    expect(card.find(Button).at(1).text()).toContain("Join Room");
  });


});