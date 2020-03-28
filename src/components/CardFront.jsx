import React from 'react';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { API_PORT } from '../constants';

class CardFront extends React.Component {
  constructor(props) {
    super(props);
    this.onCreateRoomClick = this.onCreateRoomClick.bind(this);
    this.apiBase = (process.env.NODE_ENV === 'production') ? '/api' : `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
  }

  onCreateRoomClick = async(e) => {
    e.preventDefault();
    this.props.createRoomAction({ gameId: "", roomId: "" });
    const request = new Request(`${this.apiBase}/create`, {
      method: 'POST',
      body: JSON.stringify({})
    });
    const response = await fetch(request);
    const responseBody = await response.json();
    this.props.createRoomAction(responseBody);
  };

  render() {
    return(
      <Card>
        <Card.Img variant="top" src="/logo192.png"/>
        <Card.Body>
          <Row>
            <Col>
              <Button variant="primary" size="lg" onClick={this.onCreateRoomClick}>Create Room</Button>
            </Col>
            <Col>
              <Button variant="warning" size="lg" onClick={this.props.joinRoomAction}>Join Room</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default CardFront;