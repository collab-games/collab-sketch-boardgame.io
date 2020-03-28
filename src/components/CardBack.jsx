import React from 'react';
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import isEmpty from 'lodash/isEmpty';

class CardBack extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const roomId = this.props.roomId;
    return(
      <Card className="turn-in-card">
        <Card.Img variant="top" src="/logo192.png"/>
        <Card.Body>
          {isEmpty(roomId) ? this.joinForm() : this.creatorForm(roomId)}
        </Card.Body>
      </Card>
    );
  }

  creatorForm(roomId) {
    return <Form>
      <Form.Group controlId="playerName">
        <Form.Label>Player Name</Form.Label>
        <Form.Control type="text" placeholder="Enter name" />
      </Form.Group>
      <Form.Group controlId="roomCode">
        <Form.Label>{ roomId }</Form.Label>
      </Form.Group>
      <Button variant="primary" type="submit">
        Join Room
      </Button>
    </Form>;
  }

  joinForm() {
    return <Form>
      <Form.Group controlId="playerName">
        <Form.Label>Player Name</Form.Label>
        <Form.Control type="text" placeholder="Enter name" />
      </Form.Group>
      <Form.Group controlId="roomCode">
        <Form.Label>Room Code</Form.Label>
        <Form.Control type="text" placeholder="Room Code" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Join Room
      </Button>
    </Form>;
  }
}

export default CardBack;