import React from "react";
import PropTypes from "prop-types";
import {CircularProgressbar} from "react-circular-progressbar";
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

  endTurn(turn) {
    this.props.moves.endTurn(turn);
  }

  decreaseTimer(turn) {
    const currentTime = this.state.timer - 1;
    if (currentTime <= 0) {
      this.endTurn(turn);
      clearInterval(this.timerHandler);
    }
    if (currentTime <= 5) this.timerTick.play();
    this.setState({ timer: currentTime });
  }

  renderTimer() {
    if (this.state.timer > 0) {
      return (
        <div className="count-down-timer">
          <CircularProgressbar maxValue={60} value={this.state.timer} text={this.state.timer}/>
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