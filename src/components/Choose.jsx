import React from 'react';

const Choose = (props) => {
  const { words, chooseWord, choosePlayer, players } = props;
  console.log(props);
  return (
    <div>
      <h1>Player is choosing</h1>
      <p>Choose Word</p>
      {
        words.map( word => <button onClick={() => chooseWord(word)}>
          {word}
          </button>
        )
      }
      <p>Choose Player</p>
      {
        players.map( player => <button onClick={() => choosePlayer(player.playerId)}>
            {player.playerName}
          </button>
        )
      }
    </div>
  )
}

export default Choose;