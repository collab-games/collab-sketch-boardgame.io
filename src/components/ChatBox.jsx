import React from 'react';
import { Launcher } from 'react-chat-window';
import './ChatBox.css';


class ChatBox extends React.Component {

  constructor(props){
      super(props);
  }

  sendMessage(message) {
    const { moves, currentPlayer  } = this.props;
    const updatedMessage = Object.assign({}, message,
        { data: { text: `${currentPlayer.name}: ${message.data.text}`} } );
    moves.guessArt(updatedMessage);
  }

  render() {
    const { G } = this.props;
    return (
        <Launcher
            agentProfile={{
                teamName: 'collab-sketch',
                imageUrl: ''
            }}
            isOpen={true}
            onMessageWasSent={(message) => this.sendMessage(message)}
            messageList={G.chatMessages}
            showEmoji
        />
    );
  }
}

export default ChatBox;
