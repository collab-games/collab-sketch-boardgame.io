import React from 'react';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import {API_PORT, GAME_NAME} from "../constants";
import {isEmpty, isNil} from "lodash";
import {IoIosLogIn} from "react-icons/io";

class CardBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: props.gameId || "",
      inputError: false,
      playerName: props.playerName || ""
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onJoinRoomClick = this.onJoinRoomClick.bind(this);
    this.apiBase = (process.env.NODE_ENV === 'production') ? '/api' : `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.playerName !== this.props.playerName) {
        this.setState({ playerName: this.props.playerName})
    }
  }

  onInputChange = (target) => {
    const { gameId } = this.props;
    const value = target.currentTarget.value;
    const inputError = value.trim().length <= 0;
    (isNil(gameId) || isEmpty(gameId)) ?
      this.setState( { inputError, roomCode: value }) :
      this.setState( { inputError, playerName: value });
  };

  onJoinRoomClick = async(e) => {
    e.preventDefault();
    const { roomCode, playerName } = this.state;
    if(playerName.trim().length <= 0) {
      this.setState({ inputError: true})
      return;
    }
    const request = new Request(`${this.apiBase}/join/${roomCode}`, {
      method: 'POST',
      body: JSON.stringify({ playerName: playerName })
    });
    const response = await fetch(request);
    const responseBody = await response.json();
    const secretStore = localStorage.getItem(`${GAME_NAME}-${responseBody.gameId}`);
    let credentials;
    if(secretStore) {
      credentials = { ...(JSON.parse(secretStore)), [responseBody.playerId]: responseBody.credentials };
    } else {
      credentials = { [responseBody.playerId]: responseBody.credentials };
    }
    localStorage.setItem(`${GAME_NAME}-${responseBody.gameId}`, JSON.stringify(credentials));
    this.props.browserHistory.push(`/${responseBody.gameId}/${responseBody.playerId}`);
  };

  label() {
    const { gameId } = this.props;
    return isEmpty(gameId) ? "Room Code" : "Player Name";
  }

  render() {
    const { inputError } = this.state;
    return(
      <Card>
        <Card.Img variant="top" src="/starry_night.jpg"/>
        <Card.Body>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Prepend className="player-name-container">
                  <InputGroup.Text id="basic-addon3">
                    { this.label() }
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  className={`player-name ${inputError?"error":""}`}
                  id="basic-url"
                  aria-describedby="basic-addon3"
                  onChange={this.onInputChange}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 2, offset: 6 }}>
              <Button
                  className="join-room-btn"
                  variant="warning"
                  size="lg"
                  onClick={this.onJoinRoomClick}>
                Join Room <IoIosLogIn size={32}/>
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default CardBack;