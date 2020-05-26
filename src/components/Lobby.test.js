import React from "react";
import { shallow, mount } from "enzyme";

import Lobby from './Lobby';
import CardFront from './CardFront'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import CardBack from "./CardBack";

describe("<Lobby>", () => {
  const match = { params: {} };
  it("should render Game name", () => {
    const wrapper = shallow(<Lobby match={match} />);
    expect(wrapper.find('nav').exists()).toBeTruthy();
    expect(wrapper.find('nav').text()).toContain("Collab Sketch");
    expect(wrapper.find('NavbarBrand').props().href).toBe("/");
  });

  it("should render create game block", () => {
    const wrapper = shallow(<Lobby match={match} history={{}}/>);
    expect(wrapper.find(CardFront).exists()).toBeTruthy();
    expect(wrapper.find(CardFront).props().browserHistory).toEqual({});
  });

  it("should flip the card and provide option to join the room", () => {
    const wrapper = shallow(<Lobby match={match} />);
    const cardFront = wrapper.find(CardFront);

    cardFront.props().joinRoomAction({ playerName: "Alexander" });

    expect(wrapper.find(CardBack).props().playerName).toContain("Alexander");
  });

  it("should flip the card and provide option to join the room if joining via url", () => {
    const match = { params: { gameId: 'abcdef' } };
    const wrapper = shallow(<Lobby match={match} />);
    expect(wrapper.find(CardBack).props().playerName).toContain("");
    expect(wrapper.find(CardBack).props().gameId).toContain("abcdef");
  });

  it("should render create room and join room options", () => {
    const wrapper = mount(<Lobby match={match} />);
    const card = wrapper.find(CardFront).find(Card);

    expect(card.find(Button).at(0).text()).toContain("Create Room");
    expect(card.find(Button).at(1).text()).toContain("Join Room");
  });


});