import React from "react";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PlayerList from "../components/PlayerList";
import Grid from "../components/Grid";
import ReadOnlyCanvas from "../components/ReadOnlyCanvas";
import ChatBox from "../components/ChatBox";
import {GameState} from "../constants";
import isEmpty from "lodash/isEmpty";
import repeat from "lodash/repeat";
import './PlayArea.css';

class PlayArea extends React.Component {
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    playerID: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    moves: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.isActive = this.isActive.bind(this);
    this.getActivePlayers = this.getActivePlayers.bind(this);
    this.isCanvasOneArtist = this.isCanvasOneArtist.bind(this);
    this.isCanvasTwoArtist = this.isCanvasTwoArtist.bind(this);
    this.isPlayerGuessing = this.isPlayerGuessing.bind(this);
    this.renderFirstWord = this.renderFirstWord.bind(this);
    this.renderSecondWord = this.renderSecondWord.bind(this);
  }

  getActivePlayers() {
    return this.props.G.players;
  }

  isCanvasOneArtist() {
    if (this.isActive() && !isEmpty(this.props.ctx.activePlayers)) {
      const activePlayers = this.props.ctx.activePlayers;
      const playerId = this.props.playerID;
      return activePlayers[playerId] === 'drawCanvasOne';
    }
    return false;
  }

  isCanvasTwoArtist() {
    if (this.isActive() && !isEmpty(this.props.ctx.activePlayers)) {
      const activePlayers = this.props.ctx.activePlayers;
      const playerId = this.props.playerID;
      return activePlayers[playerId] === 'drawCanvasTwo';
    }
    return false;
  }

  isPlayerGuessing() {
    return !this.isCanvasOneArtist() && !this.isCanvasTwoArtist();
  }

  isActive() {
    if (!this.props.isActive) return false;
    else if (this.props.G.state !== GameState.STARTED) return false;
    return true
  }

  renderFirstWord() {
    const { G } = this.props;
    return <div className="word">
      { this.isCanvasOneArtist() ? G.word : repeat('_ ', G.canvasOne['chars'])}
    </div>;
  }

  renderSecondWord() {
    const { G } = this.props;
    return <div className="word">
      { this.isCanvasTwoArtist() ? G.word : repeat('_ ', G.canvasTwo['chars'])}
    </div>;
  }

  render() {
    const {G, playerID, moves} = this.props;
    let body = [
      <div key={0}>
        {this.renderFirstWord()}
        {this.isCanvasOneArtist() && <Grid
          snapshot={G.canvasOne['snapshot']}
          updateSnapshot={moves.updateSnapshotForCanvasOne}
          isActive={this.isActive}
          playerID={playerID}
          id={0}
        />}
        {!this.isCanvasOneArtist() && <ReadOnlyCanvas
          svgText={G.canvasOne['svg']}
        />}
      </div>,
      <div key={1}>
        {this.renderSecondWord()}
        {this.isCanvasTwoArtist() && <Grid
          snapshot={G.canvasTwo['snapshot']}
          updateSnapshot={moves.updateSnapshotForCanvasTwo}
          isActive={this.isActive}
          playerID={playerID}
          id={1}
        />}
        {!this.isCanvasTwoArtist() && <ReadOnlyCanvas
          svgText={G.canvasTwo['svg']}
        />}
      </div>
    ];

    return(
      <Container fluid={true}>
        <Row>
          <Col md={{span: 10}}>
            <div>
              <div className='board'>
                { body }
              </div>
            </div>
          </Col>
          <Col style={{paddingRight: 0}} md={{span: 2}}>
            <div>
              <PlayerList G={G} players={this.getActivePlayers()} currentPlayerId={playerID}/>
            </div>
            <div>
              <ChatBox G={G} moves={moves} currentPlayer={G.players[playerID]}
                       isPlayerGuessing={this.isPlayerGuessing()}/>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default PlayArea;
