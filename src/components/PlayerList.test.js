import React from "react";
import { shallow } from "enzyme";
import PlayerList from "./PlayerList";
import ListGroup from "react-bootstrap/ListGroup";


describe('<PlayerList>', function () {

  it('should render players list header', () => {
    const wrapper = shallow(<PlayerList players={{}}/>);
    expect(wrapper.find(ListGroup.Item).at(0).text()).toEqual('Players');
  });

  it('should render players', () => {
    const players = {
      '0' : { game: { joined: true, name: 'bond' }},
      '1' : { game: { joined: true, name: 'abc' }},
      '2' : { game: { joined: true, name: 'def' }}
    };

    const wrapper = shallow(<PlayerList players={players}/>);
    expect(wrapper.find(ListGroup.Item).length).toEqual(4);
    expect(wrapper.find(ListGroup.Item).at(1).text()).toEqual('bond');
    expect(wrapper.find(ListGroup.Item).at(2).text()).toEqual('abc');
    expect(wrapper.find(ListGroup.Item).at(3).text()).toEqual('def');
  });
});
