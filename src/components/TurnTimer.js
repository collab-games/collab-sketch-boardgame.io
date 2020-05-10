import React from "react";
import PropTypes from "prop-types";
import {CircularProgressbar} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import './TurnTimer.css';

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
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.ctx.turn > prevState.turn) {
      return {turn: nextProps.ctx.turn};
    } else return null;
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
    this.setState({ timer: currentTime });
  }

  componentDidUpdate(prevProps, prevState) {
    const previousTurn = prevState.turn;
    const currentTurn = this.state.turn;
    if (currentTurn > previousTurn) {
      clearInterval(this.timerHandler);
      this.timerHandler = setInterval(() => this.decreaseTimer(currentTurn), 1000);
      this.setState({ timer: prevProps.G.settings.turnPeriod });
    }
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