import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import ReactCardFlip from 'react-card-flip';
import CardFront from "./CardFront";
import './Lobby.css';
import CardBack from "./CardBack";

class Lobby extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isCardFlipped: false,
      playerName: ""
    };
    this.joinRoomAction = this.joinRoomAction.bind(this);
  }

  joinRoomAction = ({playerName}) => {
    this.setState({ playerName: playerName, isCardFlipped: true });
  };

  render() {
    const { isCardFlipped, playerName } = this.state;
    return (
      <div>
        <div>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Collab Games</Navbar.Brand>
          </Navbar>
        </div>
        <div className="turn-in-card">
          <ReactCardFlip isFlipped={isCardFlipped}>
            <CardFront joinRoomAction={this.joinRoomAction} browserHistory={this.props.history}/>
            <CardBack playerName={playerName} />
          </ReactCardFlip>
        </div>
      </div>
    )
  }
}

export default Lobby;