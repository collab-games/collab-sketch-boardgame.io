import React from "react";
import { shallow } from "enzyme";

import CardBack from "./CardBack";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

describe('<CardBack>', function () {
  it('should render card with image and join room options', function () {
    const wrapper = shallow(<CardBack />);
    const card = wrapper.find(Card);

    expect(card.find(Form).exists()).toBeTruthy();
    expect(card.find(Form).find(Form.Label).text()).toContain("Room Code");
    expect(card.find(Form).find(Form.Control).exists()).toBeTruthy();

    expect(card.find(Form).find(Button).text()).toContain("Join");
  });
});