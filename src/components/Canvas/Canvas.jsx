import React from "react";
import PropTypes from "prop-types";
import Painterro from 'painterro';
import "./Canvas.scss";

class Canvas extends React.Component {

  static propTypes = {
    snapshot: PropTypes.any,
    updateSnapshot: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.updateCanvas = this.updateCanvas.bind(this);
  }

  updateCanvas(exportableImage) {
    const dataURL = exportableImage.image.asDataURL();
    this.props.updateSnapshot(dataURL, dataURL);
  }

  componentDidMount() {
    Painterro({
      id: 'canvas',
      activeFillColor: '#00ff00',
      activeFillColorAlpha: 1,
      defaultTool: 'brush',
      hiddenTools: ['crop', 'arrow', 'text', 'rotate', 'resize', 'save', 'open', 'close', 'select', 'pixelize', 'settings'],
      toolbarPosition: 'top',
      defaultLineWidth: 2,
      defaultEraserWidth: 5,
      onChange: this.updateCanvas,
      colorScheme: {
        main: '#8db9ca',
        control: '#f5f5f5',
        activeControl: '#0d0735',
        toolControlNameColor: 'rgba(245,245,245,0.5)',
        hoverControl: '#52565e',
      }
    }).show(this.props.snapshot);
  }

  componentWillUnmount() {
    const canvas = document.getElementById('canvas');
    canvas.remove();
  }

  render() {
    return (
      <div className="canvas">
        <div id="canvas">
        </div>
      </div>
    );
  }
}

export default Canvas;