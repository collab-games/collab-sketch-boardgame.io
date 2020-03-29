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

    expect(card.find(Button).text()).toContain("Join");
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
});