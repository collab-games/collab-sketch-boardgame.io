import React from 'react';
import LC from "literallycanvas";
import 'literallycanvas/scss/literallycanvas.scss';

import Button from 'react-bootstrap/Button';

const click = (lc) => {
  console.log("click ++++++++++++++", lc);
};

const change = (lc) => {
  console.log("change ++++++++++++++", lc);
};

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasRef: {},
      canvas2Ref: {},
    };

    this.saveSnapshot = this.saveSnapshot.bind(this);
  }

  initFunc = (ref) => {
    ref.on('drawingChange', this.saveSnapshot);
    this.setState({canvasRef: ref});
  };

  secondFunc = (ref) => {
    this.setState({canvas2Ref: ref});
  };

  saveSnapshot = () => {
    const canvas1Ref = this.state.canvasRef;
    const canvas2Ref = this.state.canvas2Ref;
    canvas2Ref.loadSnapshot(canvas1Ref.getSnapshot());
  };

  render() {
    return (
      <div>
        <LC.LiterallyCanvasReactComponent
          imageURLPrefix="/img"
          onInit={this.initFunc}
        />
        <Button onClick={this.saveSnapshot}>Save</Button>
        <LC.LiterallyCanvasReactComponent
          imageURLPrefix="/img"
          onInit={this.secondFunc}/>
      </div>
    );
  }
}

export default Grid;
