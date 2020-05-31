import React from "react";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";

class ChooseWords extends React.Component {

  static propTypes = {
    words: PropTypes.array.isRequired,
    chooseWord: PropTypes.func.isRequired
  };

  render() {
    const { words, chooseWord } = this.props;
    return (
      <div className="choose-word">
        <p className="choose-word__header">Choose Word</p>
        <div className="choose-word__words">
          { words.map((word, index) =>
                <Button variant="success" key={index} className="choose-word__word"
                        onClick={() => chooseWord(word)}>
                  {word}
                </Button>)
          }
        </div>
      </div>
    );
  }
}

export default ChooseWords;