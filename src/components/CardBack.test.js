import React from "react";
import { shallow } from "enzyme";

import CardBack from "./CardBack";
import CardFront from "./CardFront";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

describe('<CardBack>', function () {
  it('should render card with image and join room options', function () {
    const wrapper = shallow(<CardBack roomId=""/>);
    const card = wrapper.find(Card);

    expect(card.find(Form).exists()).toBeTruthy();
    expect(card.find(Form).find(Form.Label).at(0).text()).toContain("Player Name");
    expect(card.find(Form).find(Form.Control).at(0).exists()).toBeTruthy();

    expect(card.find(Form).find(Form.Label).at(1).text()).toContain("Room Code");
    expect(card.find(Form).find(Form.Control).at(1).exists()).toBeTruthy();

    expect(card.find(Form).find(Button).text()).toContain("Join Room");
  });

  it('should render card with image and create room options', function () {
    const wrapper = shallow(<CardBack roomId="RRRR2222"/>);
    const card = wrapper.find(Card);

    expect(card.find(Form).exists()).toBeTruthy();
    expect(card.find(Form).find(Form.Label).at(0).text()).toContain("Player Name");
    expect(card.find(Form).find(Form.Control).at(0).exists()).toBeTruthy();

    expect(card.find(Form).find(Form.Label).at(1).text()).toContain("RRRR2222");
    expect(card.find(Form).find(Button).text()).toContain("Join Room");
  });
});