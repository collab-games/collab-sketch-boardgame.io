import React from 'react';
import PropTypes from 'prop-types';
import "./LeaderBoard.css";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const LeaderBoardHeader = () => {
  return (
    <div className="leader-board-header">
      <h2>Leaderboard</h2>
    </div>
  )
};

const Winner = ({ name }) => {
  return (
    <div className="winner">
      <h2>🎉Congratulations {name}🎉</h2>
    </div>
  )
};

const Players = ({ players }) => {
  return Object.values(players)
      .sort((p1, p2) => p2.game.score - p1.game.score)
      .map((player, index) =>
        <User key={index} rank={index+1} username={player.game.name} score={player.game.score} />)
};

const ColumnHeader = () => {
  return (
    <Row className="col-header">
      <Col xs={2}>
        <h4>#</h4>
      </Col>
      <Col>
        <h4>Name</h4>
      </Col>
      <Col>
        <h4>Score</h4>
      </Col>
    </Row>
  )
};

const User = ({ rank, username, score }) => {
  return (
    <Row className="users">
      <Col xs={2} className="rank">
        <h4>{ rank }</h4>
      </Col>
      <Col>
        <h4>{ username }</h4>
      </Col>
      <Col>
        <h4>{ score }</h4>
      </Col>
    </Row>
  )
};

class LeaderBoard extends React.Component {
  static propTypes = {
    players: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { players } = this.props;
    const winner = Object.values(players)
      .sort((p1, p2) => p2.game.score - p1.game.score)[0];
    return (
      <div className="leader-board-container">
        <div className="leader-board">
          <Winner name={winner.game.name} />
          <LeaderBoardHeader/>
          <ColumnHeader/>
          <Players players={players} />
        </div>
      </div>
    );
  }
}



export default LeaderBoard;
