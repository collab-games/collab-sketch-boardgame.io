import React from 'react';
import PropTypes from 'prop-types';
import {choosingPlayerIdFrom, playerNames} from "../game/Players";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./ChooseModal.scss";

const ChooseModal = (props) => {
  const { words, chooseWord, choosePlayer, players, currentPlayerId } = props;
  if(currentPlayerId === choosingPlayerIdFrom(players)) {
    return (
      <Container>
        <Row>
          <Col md={{span: 6}} className="choose-word">
            <p className="choose-word__label">Choose Word</p>
            {
              words.map( (word, index) =>
                <Button variant="secondary" key={index} className="choose-word__word" onClick={() => chooseWord(word)}>
                  {word}
                </Button>
              )
            }
          </Col>
          <Col md={{span: 6}} className="choose-player">
            <p className="choose-player__label">Choose Player</p>
            {
              playerNames(players).filter( player => player.playerId !== currentPlayerId ).map( (player, index) =>
                <Button variant="secondary" key={index} className="choose-player__player" onClick={() => choosePlayer(player.playerId)}>
                  {player.playerName}
                </Button>
              )
            }
          </Col>
        </Row>
      </Container>
    );
  } else {
    return <h1>Waiting till selection is complete!</h1>;
  }

}

ChooseModal.propTypes = {
  words: PropTypes.array.isRequired,
  chooseWord: PropTypes.func.isRequired,
  choosePlayer: PropTypes.func.isRequired,
  players: PropTypes.object.isRequired,
  currentPlayerId: PropTypes.string.isRequired
}

export default ChooseModal;