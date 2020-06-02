import React from 'react';
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
    this.state = {
      message: ''
    };
    this.changeInputValue = this.changeInputValue.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  changeInputValue (e) {
    this.setState({
      message: e.target.value
    });
  }

  sendMessage(event) {
    if (event.key === 'Enter') {
      const { message } = this.state;
      const { moves, isPlayerGuessing } = this.props;
      isPlayerGuessing && moves.guessArt(message);
      this.setState({
        message: ''
      });
    }
  }

  renderMessages() {
    const renderMessage = (message, index) => {
      if (message.systemGenerated) {
        return <p key={index} className="chat-box__message__system">{message.text}</p>
      }
      return <p key={index} className="chat-box__message__player">
        <span>{message.author}</span>
        {message.text}
      </p>
    };
    const { G: {chatMessages} } = this.props;
    return chatMessages.map(renderMessage);
  }

  render() {
    return (
      <div className="chat-box">
        <div className="chat-box__messages">
          {this.renderMessages()}
        </div>
        <div className="chat-box__input">
          <input value={this.state.message} placeholder="Guess here" onChange={this.changeInputValue} onKeyPress={this.sendMessage}/>
        </div>
      </div>
    );
  }
}

export default ChatBox;
