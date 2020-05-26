import React from 'react';
import ReactCardFlip from 'react-card-flip';
import CardFront from "./CardFront";
import './Lobby.scss';
import CardBack from "./CardBack";
import NavbarBrand from "react-bootstrap/NavbarBrand";

class Lobby extends React.Component {

  constructor(props) {
    super(props);
    const { params } = props.match;
    this.state = {
      isCardFlipped: params.gameId ? true : false,
      playerName: ""
    };
    this.joinRoomAction = this.joinRoomAction.bind(this);
  }

  joinRoomAction = ({playerName}) => {
    this.setState({ playerName: playerName, isCardFlipped: true });
  };

  render() {
    const { isCardFlipped, playerName } = this.state;
    const { params } = this.props.match;
    return (
      <div>
        <nav className="navbar navigation">
          <NavbarBrand href="/">Collab Sketch</NavbarBrand>
        </nav>
        <div className="turn-in-card">
          <ReactCardFlip isFlipped={isCardFlipped}>
            <CardFront joinRoomAction={this.joinRoomAction} browserHistory={this.props.history}/>
            <CardBack gameId={params.gameId} playerName={playerName} browserHistory={this.props.history} />
          </ReactCardFlip>
        </div>
      </div>
    )
  }
}

export default Lobby;