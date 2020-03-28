import React from 'react';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

class CardFront extends React.Component {
  render() {
    return(
      <Card className="turn-in-card">
        <Card.Img variant="top" src="/logo192.png"/>
        <Card.Body>
          <Row>
            <Col>
              <Button variant="primary" size="lg">Create Room</Button>
            </Col>
            <Col>
              <Button variant="warning" size="lg">Join Room</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default CardFront;