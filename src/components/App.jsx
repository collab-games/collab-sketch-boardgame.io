import React from 'react';

class App extends React.Component {

    render() {
        const { gameId, playerId } = this.props.match.params;
        return (<h1>Hello, You are in game: { gameId } and you are player number { playerId } </h1>);
    }

}

export default App;