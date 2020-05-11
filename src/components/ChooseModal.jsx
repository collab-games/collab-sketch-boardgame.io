import React from 'react';
import PropTypes from 'prop-types';
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./ChooseModal.scss";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import isEmpty from 'lodash/isEmpty';
import {choosingPlayerIdFrom, isCoArtistSelected, playerNames} from "../game/Players";

const ChooseModal = (props) => {
  const { words, chooseWord, choosePlayer, players, currentPlayerId, show } = props;
  return (
    <Modal show={show} size="lg" centered >
      <ModalBody>
        <Container>
          <Row>
            <Col md={{span: 6}} className="choose-word">
              <p className="choose-word__label">Choose Word</p>
              {
                isEmpty(words)
                  ? <p>Word Chosen !</p>
                  : words.map( (word, index) =>
                    <Button variant="secondary" key={index} className="choose-word__word" onClick={() => chooseWord(word)}>
                      {word}
                    </Button> )
              }
            </Col>
            <Col md={{span: 6}} className="choose-player">
              <p className="choose-player__label">Choose Player</p>
              {
                isCoArtistSelected(players)
                  ? <p>Player Chosen !</p>
                  : playerNames(players).filter( player => player.playerId !== currentPlayerId ).map( (player, index) =>
                    <Button variant="secondary" key={index} className="choose-player__player" onClick={() => choosePlayer(player.playerId)}>
                      {player.playerName}
                    </Button> )
              }
            </Col>
          </Row>
        </Container>
      </ModalBody>
    </Modal>
  );
}

ChooseModal.propTypes = {
  words: PropTypes.array.isRequired,
  chooseWord: PropTypes.func.isRequired,
  choosePlayer: PropTypes.func.isRequired,
  players: PropTypes.object.isRequired,
  currentPlayerId: PropTypes.string.isRequired
}

export default ChooseModal;