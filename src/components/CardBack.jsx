import React from 'react';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

class CardBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: "",
      disableSubmit: true,
    };
    this.onRoomCodeChange = this.onRoomCodeChange.bind(this);
    this.onJoinRoomClick = this.onJoinRoomClick.bind(this);
  }

  onRoomCodeChange = (target) => {
    const value = target.currentTarget.value;
    const disableSubmit = value.trim().length <= 0;
    this.setState({
      roomCode: value,
      disableSubmit
    })
  };

  onJoinRoomClick = () => {
    console.log(this.state.roomCode);
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