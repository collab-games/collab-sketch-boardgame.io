import React from "react";
import { shallow } from "enzyme";
import LC from "literallycanvas";
import Grid from "./Grid";

describe('<Grid>', function () {
  it('should render Canvas', function () {
    const updateSnapFn = jest.fn();
    const wrapper = shallow(
      <Grid id={1} snapshot={{}} updateSnapshot={updateSnapFn}/>
    );
    expect(wrapper.find(LC.LiterallyCanvasReactComponent).exists()).toBeTruthy();
  });

  it('should update snapshot on change of drawing', async function () {
    const updateSnapFn = jest.fn();
    const snapshot = {};
    const wrapper = shallow(
      <Grid id={1} snapshot={snapshot} updateSnapshot={updateSnapFn}/>
    );
    const canvasOnInit = wrapper.find(LC.LiterallyCanvasReactComponent).prop('onInit');

    let onchangeListener;
    const loadSnapshotFn = jest.fn();
    const canvasRef = {
      on: (changeEvent, changeListener) => {
        expect(changeEvent).toBe('drawingChange');
        onchangeListener = changeListener;
      },
      loadSnapshot: loadSnapshotFn,
      getSnapshot: () => ({}),
      getSVGString: () => ""
    };
    canvasOnInit(canvasRef);

    onchangeListener();
    expect(loadSnapshotFn).toHaveBeenCalledWith(snapshot);
    expect(updateSnapFn).toHaveBeenCalledWith({}, "");
  });
});