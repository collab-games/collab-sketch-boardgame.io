import React from 'react';
import LC from "literallycanvas";
import 'literallycanvas/scss/literallycanvas.scss';
import PropTypes from "prop-types";
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

class Grid extends React.Component {
  static propTypes = {
    snapshot: PropTypes.any.isRequired,
    updateSnapshot: PropTypes.func.isRequired,
    playerID: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      canvasRef: null,
    };

    this.initFunc = this.initFunc.bind(this);
    this.saveSnapshot = this.saveSnapshot.bind(this);
    this.loadSnapshot = this.loadSnapshot.bind(this);
  }

  initFunc = (ref) => {
    ref.on('drawingChange', this.saveSnapshot);
    this.setState({canvasRef: ref});
  };

  loadSnapshot() {
    if (!isEmpty(this.props.snapshot) ) {
      this.state.canvasRef.loadSnapshot(this.props.snapshot);
    }
  }

  saveSnapshot = () => {
      const canvas = this.state.canvasRef;
      this.props.updateSnapshot(this.props.id.toString(), canvas.getSnapshot());
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!isEqual(prevProps.snapshot, this.props.snapshot)) {
      this.loadSnapshot();
    }
  }

  render() {
    return (
        <LC.LiterallyCanvasReactComponent
          imageURLPrefix="/img"
          onInit={this.initFunc}
        />
    );
  }
}

export default Grid;
