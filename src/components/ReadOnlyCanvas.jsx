import React from "react";

const ReadOnlyCanvas = props => <div className="svg-container" dangerouslySetInnerHTML={{__html: props.svgText}} />;

export default ReadOnlyCanvas;