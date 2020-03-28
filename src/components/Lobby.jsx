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
      roomId: ""
    };
    this.createRoomAction = this.createRoomAction.bind(this);
    this.joinRoomAction = this.joinRoomAction.bind(this);
  }

  createRoomAction = ({roomId}) => {
    this.setState({ roomId, isCardFlipped: true });
  };

  joinRoomAction = (e) => {
    e.preventDefault();
    this.setState({ roomId: "", isCardFlipped: true });
  };

  render() {
    const { isCardFlipped, roomId } = this.state;
    return (
      <div>
        <div>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Collab Games</Navbar.Brand>
          </Navbar>
        </div>
        <div className="turn-in-card">
          <ReactCardFlip isFlipped={isCardFlipped}>
            <CardFront createRoomAction={this.createRoomAction} joinRoomAction={this.joinRoomAction}/>
            <CardBack roomId={roomId} />
          </ReactCardFlip>
        </div>
      </div>
    )
  }
}

export default Lobby;