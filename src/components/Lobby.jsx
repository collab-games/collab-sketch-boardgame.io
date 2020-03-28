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
  }

  createRoomAction = ({roomId}) => {
    this.setState({ roomId, isCardFlipped: true });
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
        <div align="center">
          <ReactCardFlip isFlipped={isCardFlipped}>
            <CardFront createRoomAction={this.createRoomAction}/>
            <CardBack roomId={roomId} />
          </ReactCardFlip>
        </div>
      </div>
    )
  }
}

export default Lobby;