import React from 'react';
import PropTypes from 'prop-types';
import "./ChooseModal.scss";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import isEmpty from 'lodash/isEmpty';
import ChoosePlayer from "./ChoosePlayer";
import ChooseWords from "./ChooseWords";

const ChooseModal = (props) => {
  const { words, chooseWord, choosePlayer, players, currentPlayerId, show } = props;
  return (
      <Modal show={show} size="lg" className="choose-modal">
        <ModalBody className="modal-outline">
                {isEmpty(words)
                  ? <ChoosePlayer choosePlayer={choosePlayer} players={players} currentPlayerId={currentPlayerId}/>
                  : <ChooseWords words={words} chooseWord={chooseWord} />
                }
        </ModalBody>
      </Modal>
  );
};

ChooseModal.propTypes = {
  words: PropTypes.array.isRequired,
  chooseWord: PropTypes.func.isRequired,
  choosePlayer: PropTypes.func.isRequired,
  players: PropTypes.object.isRequired,
  currentPlayerId: PropTypes.string.isRequired
};

export default ChooseModal;