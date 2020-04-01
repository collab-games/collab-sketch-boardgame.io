import React from 'react';
import PropTypes from 'prop-types';
import { GameState } from '../constants';
import './Board.css';

class CollabSketchBoard extends React.Component {
    static propTypes = {
        G: PropTypes.any.isRequired,
        ctx: PropTypes.any.isRequired,
        moves: PropTypes.any.isRequired,
        playerID: PropTypes.string,
        isActive: PropTypes.bool,
        isMultiplayer: PropTypes.bool,
        gameMetaData: PropTypes.any,
    };

    constructor(props) {
        super(props);
        this.startGame = this.startGame.bind(this);
        this.isAdmin = this.isAdmin.bind(this);
        this.onChange = this.onChange.bind(this);
        this.isActive = this.isActive.bind(this);
    }

    onChange = (event, id) => {
        event.preventDefault();
        const value = event.target.value;
        if (this.isActive(id)) {
            this.props.moves.update(id, value);
        }
    };

    startGame() {
        if (this.props.isActive) {
            this.props.moves.startGame();
        }
    }

    isActive(id) {
        if (!this.props.isActive) return false;
        if (this.props.G.state !== GameState.STARTED) return false;
        return id.toString() === this.props.playerID;

    }

    isAdmin(playerID) {
        return playerID === '0';
    }

    render() {
        let tbody = [];
        let cells = [];
        for (let i = 0; i < this.props.ctx.numPlayers; i++) {
            cells.push(
                <td key={i}>
                    <input
                        key={i}
                        className={this.isActive(i) ? 'active' : ''}
                        onChange={(e) => this.onChange(e, i)}
                        value={this.props.G.cells[i]}
                    />
                </td>
            );
        }
        tbody.push(<tr key={0}>{cells}</tr>);

        return (
            <div>
                { this.isAdmin(this.props.playerID) && this.props.G.state === GameState.WAITING ? <button onClick={this.startGame}>Start</button>: null }
                <table id="board">
                    <tbody>{tbody}</tbody>
                </table>
            </div>
        );
    }
}

export default CollabSketchBoard;