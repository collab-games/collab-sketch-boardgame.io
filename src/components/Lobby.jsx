import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import ReactCardFlip from 'react-card-flip';
import CardFront from "./CardFront";
import './Lobby.css';

class Lobby extends React.Component {

  render() {
    return (
      <div>
        <div>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Collab Games</Navbar.Brand>
          </Navbar>
        </div>
        <div align="center">
          <ReactCardFlip>
            <CardFront />
            <h1>Hey</h1>
          </ReactCardFlip>
        </div>
      </div>
    )
  }
}

export default Lobby;