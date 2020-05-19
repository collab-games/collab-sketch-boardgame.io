import React from "react";

const ReadOnlyCanvas = props => {
  return (
    <div>
      { props.artistName ? <p className='read-only-canvas__artist-name'>{ props.artistName }</p> : null }
      <div className="svg-container" dangerouslySetInnerHTML={{__html: props.svgText}} />
    </div>
  );
};

export default ReadOnlyCanvas;