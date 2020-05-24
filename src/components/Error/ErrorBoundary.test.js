import React from "react";
import { shallow } from 'enzyme';
import ErrorBoundary from "./ErrorBoundary";

describe('<ErrorBoundary>', function () {

  class FooComponent extends React.Component {
    render() {
      return <h1>Hey working</h1>;
    }
  }

  it('should render children when there is no error', () => {

    const component = shallow(
      <ErrorBoundary>
        <FooComponent />
      </ErrorBoundary>
    );

    expect(component.find(FooComponent).exists()).toBeTruthy();
  });

  it('should render error information when there is an error in the child component', () => {

    const component = shallow(
      <ErrorBoundary>
        <FooComponent />
      </ErrorBoundary>
    );

    component.find(FooComponent).simulateError("");
    expect(component.find(FooComponent).exists()).toBeFalsy();
  });
});