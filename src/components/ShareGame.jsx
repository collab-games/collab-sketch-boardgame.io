import React from 'react';
import Row from "react-bootstrap/Row";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import {Union} from "react-bootstrap-icons";

class ShareGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false
    };
    this.onCopyToClipboard = this.onCopyToClipboard.bind(this);
  }

  onCopyToClipboard() {
    this.setState({ copied: true });
  }

  render() {
    const { gameID } = this.props;
    return (
      <Row className="share-info-container">
        <label> Share Room Code:</label>
        <div className="share-info">
          <label className="share-game-link">{gameID}</label>
          <div className="clipboard">
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={this.state.copied ? <Tooltip id="button-tooltip">Copied!</Tooltip>: <Tooltip id="button-tooltip">Click to Copy!</Tooltip>}
            >
              <CopyToClipboard
                text={gameID}
                onCopy={this.onCopyToClipboard}
              >
                <Union size="30" color="#495057" />
              </CopyToClipboard>
            </OverlayTrigger>
          </div>
        </div>
      </Row>
    );
  }
}

export default ShareGame;