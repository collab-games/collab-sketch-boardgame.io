import React from "react";
import {Toast} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import './Toaster.css';
import Alert from "react-bootstrap/Alert";

class Toaster extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: true
    }
  }

  render() {
    const { message } = this.props;
    return (
      <div className="toaster">
        <Toast onClose={() => this.setState({show: true})} show={this.state.show} delay={10000} autohide>
          <Toast.Body className="toaster-body">
              {message}
          </Toast.Body>
        </Toast>
      </div>
    );
  }
}

export default Toaster;