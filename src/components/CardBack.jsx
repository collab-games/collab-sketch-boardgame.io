import React from 'react';
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

class CardBack extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Card>
        <Card.Img variant="top" src="/logo192.png"/>
        <Card.Body>
          { this.joinForm() }
        </Card.Body>
      </Card>
    );
  }

  joinForm() {
    return <Form>
      <Form.Group controlId="roomCode">
        <Form.Label>Room Code</Form.Label>
        <Form.Control type="text" placeholder="Room Code" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Join
      </Button>
    </Form>;
  }
}

export default CardBack;