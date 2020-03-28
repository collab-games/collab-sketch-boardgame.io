import React from "react";
import { shallow, mount } from "enzyme";

import Lobby from './Lobby';
import CardFront from './CardFront'
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

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

  it("should render create room and join room options", () => {
    const wrapper = mount(<Lobby />);
    const card = wrapper.find(CardFront).find(Card);

    expect(card.find(Button).at(0).text()).toContain("Create Room");
    expect(card.find(Button).at(1).text()).toContain("Join Room");
  });


});