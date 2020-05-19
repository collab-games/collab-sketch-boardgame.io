import React from "react";
import { shallow } from 'enzyme';
import Button from "react-bootstrap/Button";
import ChooseWords from "./ChooseWords";

describe('<ChooseWords>', function () {
  it('should render words', function () {
    const words = ["word1", "word2", "word3"];
    const component = shallow(
      <ChooseWords words={words} chooseWord={jest.fn()} />
    );

    const buttons = component.find(Button);
    expect(buttons.length).toBe(3);
    expect(buttons.at(0).text()).toBe(words[0]);
    expect(buttons.at(1).text()).toBe(words[1]);
    expect(buttons.at(2).text()).toBe(words[2]);
  });

  it('should choose hello word when clicked on hello world button', function () {
    const words = ["hello world", "air cooler"];
    const chooseWordFn = jest.fn();
    const component = shallow(
      <ChooseWords words={words} chooseWord={chooseWordFn} />
    );

    const buttons = component.find(Button);
    buttons.at(0).simulate('click');

    expect(buttons.at(0).text()).toBe("hello world");
    expect(chooseWordFn).toHaveBeenCalledWith("hello world");
  });

  it('should choose air cooler when clicked on air cooler button', function () {
    const words = ["hello world", "air cooler"];
    const chooseWordFn = jest.fn();
    const component = shallow(
      <ChooseWords words={words} chooseWord={chooseWordFn} />
    );

    const buttons = component.find(Button);
    buttons.at(1).simulate('click');

    expect(buttons.at(1).text()).toBe("air cooler");
    expect(chooseWordFn).toHaveBeenCalledWith("air cooler");
  });
});