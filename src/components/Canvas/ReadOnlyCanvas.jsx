import React from "react";
import "./ReadOnlyCanvas.scss";

const ReadOnlyCanvas = props => {
  return (
    <div>
      { props.artistName ? <p className='read-only-canvas__artist-name'>{`${props.artistName}'s drawing` }</p> : null }
      <div className="svg-container">
        <img src={props.svgText} />
      </div>
    </div>
  );
};

export default ReadOnlyCanvas;