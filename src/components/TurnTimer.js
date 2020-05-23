import React from "react";
import PropTypes from "prop-types";
import UIfx from 'uifx';
import 'react-circular-progressbar/dist/styles.css';
import './Timer.css';

class TurnTimer extends React.Component {
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      turn: props.ctx.turn,
      timer: 0
    };
    this.endTurn = this.endTurn.bind(this);
    this.decreaseTimer = this.decreaseTimer.bind(this);
    this.renderTimer = this.renderTimer.bind(this);
    this.timerHandler = null;
    this.timerTick = new UIfx('/tick.mp3');
  }

  componentDidMount() {
    const serverTime = this.props.G.turn.startTime;
    const remainingTime =  this.props.G.settings.turnPeriod - Math.floor((Date.now() - serverTime)/1000);
    clearInterval(this.timerHandler);
    this.timerHandler = setInterval(() => this.decreaseTimer(this.props.ctx.turn), 1000);
    this.setState({ timer: remainingTime });
  }

  componentWillUnmount() {
    clearInterval(this.timerHandler);
  }

  endTurn(turn) {
    this.props.moves.endTurn(turn);
  }

  decreaseTimer(turn) {
    const currentTime = this.state.timer - 1;
    if (currentTime <= 0) {
      clearInterval(this.timerHandler);
      this.endTurn(turn);
    }
    if (currentTime <= 5) this.timerTick.play();
    this.setState({ timer: currentTime });
  }

  renderTimer() {
    if (this.state.timer > 0) {
      return (
        <div className="count-down-timer">
          <svg className="bi bi-alarm" width="1em" height="1em" viewBox="0 0 16 16" fill="#efdf00"
               xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8 15A6 6 0 1 0 8 3a6 6 0 0 0 0 12zm0 1A7 7 0 1 0 8 2a7 7 0 0 0 0 14z"/>
            <path fill-rule="evenodd"
                  d="M8 4.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.053.224l-1.5 3a.5.5 0 1 1-.894-.448L7.5 8.882V5a.5.5 0 0 1 .5-.5z"/>
            <path
              d="M.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.035 8.035 0 0 0 .86 5.387zM11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.035 8.035 0 0 0-3.527-3.527z"/>
            <path fill-rule="evenodd"
                  d="M11.646 14.146a.5.5 0 0 1 .708 0l1 1a.5.5 0 0 1-.708.708l-1-1a.5.5 0 0 1 0-.708zm-7.292 0a.5.5 0 0 0-.708 0l-1 1a.5.5 0 0 0 .708.708l1-1a.5.5 0 0 0 0-.708zM5.5.5A.5.5 0 0 1 6 0h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
            <path d="M7 1h2v2H7V1z"/>
          </svg>
          <span className="time">
            {this.state.timer}
          </span>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return this.renderTimer()
  }
}

export default TurnTimer;