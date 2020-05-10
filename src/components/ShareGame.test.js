import React from "react";
import { shallow } from "enzyme";
import ShareGame from "./ShareGame";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import {Union} from "react-bootstrap-icons";


describe('<ShareGame>', function () {
  it('should show room id', function () {
    const component = shallow(<ShareGame gameID="xfxs34"/>);
    expect(component.find('label.share-game-link').text()).toContain('xfxs34');
  });

  it('should render copy to clip board component with copy icon', function () {
    const component = shallow(<ShareGame gameID="xfxs34"/>);
    const copyToClipboard = component.find(CopyToClipboard);
    expect(copyToClipboard.props().text).toContain('xfxs34');

    expect(component.find(Union).exists()).toBeTruthy();
  });

});