import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import PropTypes from "prop-types";

class ChooseWords extends React.Component {

  static propTypes = {
    words: PropTypes.array.isRequired,
    chooseWord: PropTypes.func.isRequired
  };

  render() {
    const { words, chooseWord } = this.props;
    return (
      <Col md={{span: 12}} className="choose-word">
        <p className="choose-word__label">Choose Word</p>
        { words.map((word, index) =>
              <Button variant="secondary" key={index} className="choose-word__word"
                      onClick={() => chooseWord(word)}>
                {word}
              </Button>)
        }
      </Col>
    );
  }
}

export default ChooseWords;