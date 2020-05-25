import React from 'react';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import {API_PORT, GAME_NAME} from '../constants';

class CardFront extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: "",
      disableSubmit: true,
    };
    this.onCreateRoomClick = this.onCreateRoomClick.bind(this);
    this.onJoinRoomClick = this.onJoinRoomClick.bind(this);
    this.onPlayerNameChange = this.onPlayerNameChange.bind(this);
    this.apiBase = (process.env.NODE_ENV === 'production') ? '/api' : `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
  }

  onCreateRoomClick = async(e) => {
    e.preventDefault();
    const playerName = this.state.playerName;
    const request = new Request(`${this.apiBase}/create`, {
      method: 'POST',
      body: JSON.stringify({ playerName: playerName })
    });
    const response = await fetch(request);
    const responseBody = await response.json();
    localStorage.setItem(`${GAME_NAME}-${responseBody.gameId}`, JSON.stringify({ [responseBody.playerId]: responseBody.credentials }));
    this.props.browserHistory.push(`/${responseBody.gameId}/${responseBody.playerId}`);
  };

  onJoinRoomClick = (e) => {
    e.preventDefault();
    const playerName = this.state.playerName;
    this.props.joinRoomAction({ playerName: playerName });
  };

  onPlayerNameChange = (target) => {
    const value = target.currentTarget.value;
    const disableSubmit = value.trim().length <= 0;
    this.setState({
      playerName: value,
      disableSubmit
    })
  };

  render() {
    const { disableSubmit } = this.state;
    return(
      <Card>
        <Card.Img variant="top" src="/starry_night.jpg"/>
        <Card.Body>
          <Row>
            <Col>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon3">
                  Player Name
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl id="basic-url" aria-describedby="basic-addon3" onChange={this.onPlayerNameChange} />
            </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                  className="create-room-btn"
                  disabled={disableSubmit}
                  variant="primary"
                  size="lg"
                  onClick={this.onCreateRoomClick}>
                Create Room
              </Button>
            </Col>
            <Col>
              <Button
                  className="join-room-btn"
                  disabled={disableSubmit}
                  variant="warning"
                  size="lg"
                  onClick={this.onJoinRoomClick}>
                Join Room
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default CardFront;