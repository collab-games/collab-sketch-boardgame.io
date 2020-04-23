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
      '0' : { game: { joined: true, name: 'bond', score: 10 }},
      '1' : { game: { joined: true, name: 'abc', score: 30 }},
      '2' : { game: { joined: true, name: 'def', score: 20 }}
    };

    const wrapper = shallow(<PlayerList players={players}/>);
    expect(wrapper.find(ListGroup.Item).length).toEqual(4);
    expect(wrapper.find(ListGroup.Item).at(1).text()).toContain('abc');
    expect(wrapper.find(ListGroup.Item).at(2).text()).toContain('def');
    expect(wrapper.find(ListGroup.Item).at(3).text()).toContain('bond');

    expect(wrapper.find(ListGroup.Item).at(1).text()).toContain('30');
    expect(wrapper.find(ListGroup.Item).at(2).text()).toContain('20');
    expect(wrapper.find(ListGroup.Item).at(3).text()).toContain('10');
  });
});
