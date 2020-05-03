import React from "react";
import { shallow } from "enzyme";

import Quote from './Quote';

describe('<Quote>', function () {
  it('render quote', () => {
    const quote = shallow(<Quote text="Genius is one percent inspiration and ninety-nine percent perspiration" author="THOMAS EDISON" />);
    expect(quote.find('blockquote').text()).toContain("Genius is one percent inspiration and ninety-nine percent perspiration");
    expect(quote.find('cite').text()).toContain("THOMAS EDISON");
  });
});