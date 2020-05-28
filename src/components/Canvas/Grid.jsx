import React from 'react';
import LC from "literallycanvas";
import 'literallycanvas/scss/literallycanvas.scss';
import PropTypes from "prop-types";
import "./Grid.scss";

class Grid extends React.Component {
  static propTypes = {
    snapshot: PropTypes.any.isRequired,
    updateSnapshot: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      canvasRef: null,
    };

    this.initFunc = this.initFunc.bind(this);
    this.saveSnapshot = this.saveSnapshot.bind(this);
  }

  initFunc = (ref) => {
    ref.on('drawingChange', this.saveSnapshot);
    this.setState({canvasRef: ref});
    ref.loadSnapshot(this.props.snapshot);
  };

  saveSnapshot() {
    const canvas = this.state.canvasRef;
    if(canvas) {
      this.props.updateSnapshot(canvas.getSnapshot(), canvas.getSVGString());
    }
  };

  render() {
    return (
      <div className="canvas">
        <LC.LiterallyCanvasReactComponent
          toolbarPosition='left'
          imageURLPrefix="/img"
          onInit={this.initFunc}
          imageSize={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
  );
  }
}

export default Grid;
