import React from 'react';
import PropTypes from 'prop-types';
import UIfx from 'uifx';
import "./LeaderBoard.scss";

const LeaderBoardTitle = () => {
  return (
    <div className="leader-board__title">
      <h2>Leaderboard</h2>
    </div>
  )
};

const Winner = ({ name }) => {
  return (
    <div className="winner">
      <h2>🎉 Congratulations {name}🎉 </h2>
    </div>
  )
};

const Players = ({ players }) => {

  const playerList = Object.values(players)
    .sort((p1, p2) => p2.game.score - p1.game.score)
    .map((player, index) =>
      <Player key={index} rank={index+1} username={player.game.name} score={player.game.score} />)

  return (
    <div className="leader-board__players">
      {playerList}
    </div>
  )
};

const LeaderBoardHeader = () => {
  return (
    <div className="leader-board__header">
        <h4 className="rank">#</h4>
        <h4>Name</h4>
        <h4>Score</h4>
    </div>
  )
};

const Player = ({ rank, username, score }) => {
  return (
    <div className="leader-board__player">
      <h4 className="rank">{rank}</h4>
      <h4>{username}</h4>
      <h4>{score}</h4>
    </div>
  )
};

class LeaderBoard extends React.Component {
  static propTypes = {
    players: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    new UIfx('/ta-da.mp3').play();
  }

  render() {
    const { players } = this.props;
    const winner = Object.values(players)
      .sort((p1, p2) => p2.game.score - p1.game.score)[0];
    return (
      <div className="leader-board-container">
        <div className="leader-board">
          <Winner name={winner.game.name} />
          <div className="leader-board-body">
            <LeaderBoardTitle/>
            <LeaderBoardHeader/>
            <Players players={players} />
          </div>
        </div>
      </div>
    );
  }
}



export default LeaderBoard;
