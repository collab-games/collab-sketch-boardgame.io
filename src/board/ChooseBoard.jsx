import React from 'react';
import {choosingPlayerIdFrom, playerNames} from "../game/Players";

const ChooseBoard = (props) => {
  const { words, chooseWord, choosePlayer, players, currentPlayerId } = props;
  if(currentPlayerId === choosingPlayerIdFrom(players)) {
    return (
      <div>
        <h1>Player is choosing</h1>
        <p>Choose Word</p>
        {
          words.map( (word, index) => <button key={index} onClick={() => chooseWord(word)}>
              {word}
            </button>
          )
        }
        <p>Choose Player</p>
        {
          playerNames(players).filter( player => player.playerId !== currentPlayerId ).map( (player, index) => <button key={index} onClick={() => choosePlayer(player.playerId)}>
              {player.playerName}
            </button>
          )
        }
      </div>
    );
  } else {
    return <h1>Waiting till selection is complete!</h1>;
  }

}

export default ChooseBoard;