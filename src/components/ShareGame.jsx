import React from 'react';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import {BsUnion} from "react-icons/bs";
import PropTypes from 'prop-types';
import './ShareGame.scss';

class ShareGame extends React.Component {

  static propTypes = {
    gameID: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired
  }

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
    const { gameID, size } = this.props;
    const gameUrl = `${window.location.origin}/${gameID}`;
    return (
      <div className="share-info">
        <label className="share-game-link">{gameUrl}</label>
        <div className="clipboard">
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={this.state.copied ? <Tooltip id="button-tooltip">Copied!</Tooltip>: <Tooltip id="button-tooltip">Click to Copy!</Tooltip>}
          >
            <CopyToClipboard
              text={gameUrl}
              onCopy={this.onCopyToClipboard}
            >
              <BsUnion size={size} color="#495057" />
            </CopyToClipboard>
          </OverlayTrigger>
        </div>
      </div>
    );
  }
}

export default ShareGame;