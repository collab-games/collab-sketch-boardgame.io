import React from 'react';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import { API_PORT } from '../constants';

class CardFront extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: ""
    };
    this.onCreateRoomClick = this.onCreateRoomClick.bind(this);
    this.onPlayerNameChange = this.onPlayerNameChange.bind(this);
    this.apiBase = (process.env.NODE_ENV === 'production') ? '/api' : `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
  }

  onCreateRoomClick = async() => {
    const playerName = this.state.playerName;
    const request = new Request(`${this.apiBase}/create`, {
      method: 'POST',
      body: JSON.stringify({ playerName: playerName })
    });
    const response = await fetch(request);
    const responseBody = await response.json();
    this.props.browserHistory.push(`/${responseBody.gameId}/${responseBody.playerId}`);
  };

  onPlayerNameChange = (target) => {
    const value = target.currentTarget.value;
    this.setState({
      playerName: value
    })
  };

  render() {
    return(
      <Card>
        <Card.Img variant="top" src="/logo192.png"/>
        <Card.Body>
          <Row>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon3">
                  Player Name
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl id="basic-url" aria-describedby="basic-addon3" onChange={this.onPlayerNameChange} />
            </InputGroup>
          </Row>
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