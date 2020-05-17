import React from "react";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PlayerList from "../components/PlayerList";
import ChatBox from "../components/ChatBox";
import './PlayArea.css';
import CanvasOne from "./Canvas/CanvasOne";
import CanvasTwo from "./Canvas/CanvasTwo";
import { choosingPlayerIdFrom, isChoosingStage, isChoosingPlayer } from "../game/Players";
import Toaster from "./Toaster";

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
    this.getActivePlayers = this.getActivePlayers.bind(this);
    this.isPlayerGuessing = this.isPlayerGuessing.bind(this);
  }

  getActivePlayers() {
    return this.props.G.players;
  }

  isPlayerGuessing() {
    const { ctx: { activePlayers }, playerID } = this.props;
    const isDrawing = activePlayers[playerID] === 'drawCanvasTwo' || activePlayers[playerID] === 'drawCanvasOne';
    return !isDrawing;
  }

  showToast() {
    const { G: {players}, playerID } = this.props;
    if (isChoosingStage(players) && !isChoosingPlayer(players, playerID)) {
      const message = `${players[choosingPlayerIdFrom(players)].game.name} is choosing word and co-artist`;
      return (<Toaster message={message} />);
    }
    return null;
  }

  render() {
    const {G, ctx, playerID, moves, isActive} = this.props;

    return(
      <Container fluid={true}>
        <Row>
          <Col md={{span: 10}}>
            <div>
              { this.showToast() }
              <div className='board'>
                <CanvasOne G={G} ctx={ctx} playerID={playerID} moves={moves} isActive={isActive} />
                <CanvasTwo G={G} ctx={ctx} playerID={playerID} moves={moves} isActive={isActive} />
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
