import React from 'react';
import { Launcher } from 'react-chat-window';
import './ChatBox.scss';
import PropTypes from "prop-types";


class ChatBox extends React.Component {
  static propTypes = {
    G: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    currentPlayer: PropTypes.any.isRequired,
    isPlayerGuessing: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
  }

  sendMessage(message) {
    const { moves, currentPlayer, isPlayerGuessing } = this.props;
    const updatedText = `${currentPlayer.game.name}: ${message.data.text}`;
    const updatedMessage = Object.assign({}, message, {data: {text: updatedText}});
    isPlayerGuessing && moves.guessArt(updatedMessage);
  }

  render() {
    const { G } = this.props;
    return (
      <Launcher
        agentProfile={{}}
        isOpen={true}
        onMessageWasSent={(message) => this.sendMessage(message)}
        messageList={G.chatMessages}
        showEmoji={false}
      />
    );
  }
}

export default ChatBox;
