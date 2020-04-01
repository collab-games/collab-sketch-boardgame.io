import React from 'react';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { API_PORT } from "../constants";

class CardBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: "",
      disableSubmit: true,
    };
    this.onRoomCodeChange = this.onRoomCodeChange.bind(this);
    this.onJoinRoomClick = this.onJoinRoomClick.bind(this);
    this.apiBase = (process.env.NODE_ENV === 'production') ? '/api' : `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
  }

  onRoomCodeChange = (target) => {
    const value = target.currentTarget.value;
    const disableSubmit = value.trim().length <= 0;
    this.setState({
      roomCode: value,
      disableSubmit
    })
  };

  onJoinRoomClick = async(e) => {
    e.preventDefault();
    const { roomCode } = this.state;
    const { playerName } = this.props;
    const request = new Request(`${this.apiBase}/join/${roomCode}`, {
      method: 'POST',
      body: JSON.stringify({ playerName: playerName })
    });
    const response = await fetch(request);
    const responseBody = await response.json();
    localStorage.setItem(`player-${responseBody.playerId}`, responseBody.credentials);
    this.props.browserHistory.push(`/${responseBody.gameId}/${responseBody.playerId}`);
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
                    Room Code
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl id="basic-url" aria-describedby="basic-addon3" onChange={this.onRoomCodeChange} />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 2, offset: 6 }}>
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

export default CardBack;